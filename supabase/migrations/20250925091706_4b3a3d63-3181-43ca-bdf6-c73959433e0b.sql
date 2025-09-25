-- Clean up overlapping RLS policies on businesses table
-- Remove duplicate policies that create conflicts

-- Drop the redundant "Active businesses are viewable by everyone" policy
-- Keep the more specific "Authenticated users can view businesses" policy
DROP POLICY IF EXISTS "Active businesses are viewable by everyone" ON public.businesses;

-- Drop the redundant "Business owners can manage their businesses" policy  
-- Keep the more specific individual policies
DROP POLICY IF EXISTS "Business owners can manage their businesses" ON public.businesses;

-- Update the "Business owners can update their businesses" policy to be more secure
-- Ensure it only allows updates, not all operations
DROP POLICY IF EXISTS "Business owners can update their businesses" ON public.businesses;

CREATE POLICY "Business owners can update their businesses" 
ON public.businesses 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.business_id = businesses.id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.business_id = businesses.id
  )
);

-- Add a specific policy for business owners to view their own business details
CREATE POLICY "Business owners can view their own business details" 
ON public.businesses 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.business_id = businesses.id
  )
);

-- Update user_roles table constraints to prevent duplicate roles
-- Add constraint to prevent users from having multiple instances of the same role
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS unique_user_role;

ALTER TABLE public.user_roles 
ADD CONSTRAINT unique_user_role UNIQUE (user_id, role);

-- Ensure profiles.business_id is properly constrained
-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_business_id_fkey'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_business_id_fkey 
    FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE SET NULL;
  END IF;
END $$;