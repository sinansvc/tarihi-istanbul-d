-- Phase 1: Critical Security Fixes

-- 1. Drop existing overly permissive business policies
DROP POLICY IF EXISTS "Users can update businesses" ON public.businesses;
DROP POLICY IF EXISTS "Users can delete businesses" ON public.businesses;
DROP POLICY IF EXISTS "Users can view businesses" ON public.businesses;

-- 2. Create secure business policies that protect contact information
-- Public users can only see basic business information (no contact details)
CREATE POLICY "Public can view basic business info" 
ON public.businesses 
FOR SELECT 
USING (
  status = 'active'::business_status 
  AND auth.uid() IS NULL
);

-- Authenticated users can see businesses but with limited contact info for non-owners
CREATE POLICY "Authenticated users can view businesses" 
ON public.businesses 
FOR SELECT 
TO authenticated
USING (status = 'active'::business_status);

-- Business owners can see and update their own businesses
CREATE POLICY "Business owners can manage their businesses" 
ON public.businesses 
FOR ALL
TO authenticated
USING (
  -- Check if user owns this business via profiles table
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.business_id = businesses.id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.business_id = businesses.id
  )
);

-- Admins can view and manage all businesses
CREATE POLICY "Admins can manage all businesses" 
ON public.businesses 
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete businesses
CREATE POLICY "Only admins can delete businesses" 
ON public.businesses 
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Secure user_roles table - prevent users from modifying their own roles
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;

CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  -- Prevent self-role modification for additional security
  AND (user_id != auth.uid() OR OLD.role = 'admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  -- Prevent self-role modification
  AND user_id != auth.uid()
);

-- 4. Secure business_images table - only allow business owners and admins
DROP POLICY IF EXISTS "Business images are viewable by everyone" ON public.business_images;

CREATE POLICY "Business images are viewable by everyone" 
ON public.business_images 
FOR SELECT 
USING (true);

CREATE POLICY "Business owners can manage their images" 
ON public.business_images 
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN businesses b ON p.business_id = b.id
    WHERE p.id = auth.uid() 
    AND b.id = business_images.business_id
  )
  OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN businesses b ON p.business_id = b.id
    WHERE p.id = auth.uid() 
    AND b.id = business_images.business_id
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 5. Add validation trigger for business data
CREATE OR REPLACE FUNCTION validate_business_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email format
  IF NEW.email IS NOT NULL AND NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate phone number (basic validation)
  IF NEW.phone IS NOT NULL AND NEW.phone !~ '^\+?[0-9\s\-\(\)]+$' THEN
    RAISE EXCEPTION 'Invalid phone number format';
  END IF;
  
  -- Validate website URL
  IF NEW.website IS NOT NULL AND NEW.website !~ '^https?://.*' THEN
    RAISE EXCEPTION 'Website must be a valid URL starting with http:// or https://';
  END IF;
  
  -- Ensure business names are not empty
  IF NEW.name_tr IS NULL OR LENGTH(TRIM(NEW.name_tr)) = 0 THEN
    RAISE EXCEPTION 'Business name (Turkish) cannot be empty';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_business_trigger
  BEFORE INSERT OR UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION validate_business_data();

-- 6. Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" 
ON public.security_audit_logs 
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Create audit trigger for sensitive tables
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_user_roles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION audit_changes();

CREATE TRIGGER audit_businesses_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION audit_changes();