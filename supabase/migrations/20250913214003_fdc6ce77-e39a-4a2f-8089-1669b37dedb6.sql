-- Phase 1: Critical Security Fixes (Fixed)

-- 1. Drop existing overly permissive business policies
DROP POLICY IF EXISTS "Users can update businesses" ON public.businesses;
DROP POLICY IF EXISTS "Users can delete businesses" ON public.businesses; 
DROP POLICY IF EXISTS "Users can view businesses" ON public.businesses;

-- 2. Create secure business policies that protect contact information
-- Authenticated users can see businesses
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
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  AND user_id != auth.uid()
);

-- 4. Secure business_images table
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