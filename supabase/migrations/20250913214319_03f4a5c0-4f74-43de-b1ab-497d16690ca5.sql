-- Fix function search path security warnings

-- Update validation function with proper search path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update audit function with proper search path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;