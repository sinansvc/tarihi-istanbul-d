-- Add owner_id to businesses table to support multiple businesses per user
ALTER TABLE public.businesses
ADD COLUMN owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Migrate existing data from profiles.business_id to businesses.owner_id
UPDATE public.businesses b
SET owner_id = p.id
FROM public.profiles p
WHERE p.business_id = b.id;

-- Create index for better performance
CREATE INDEX idx_businesses_owner_id ON public.businesses(owner_id);

-- Update RLS policies for businesses
DROP POLICY IF EXISTS "Business owners can update their businesses" ON public.businesses;
DROP POLICY IF EXISTS "Business owners can view their own business details" ON public.businesses;

-- New policies for multiple business ownership
CREATE POLICY "Business owners can view their businesses"
ON public.businesses
FOR SELECT
USING (owner_id = auth.uid() OR status = 'active'::business_status);

CREATE POLICY "Business owners can update their businesses"
ON public.businesses
FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Update business_images RLS policy
DROP POLICY IF EXISTS "Business owners can manage their images" ON public.business_images;

CREATE POLICY "Business owners can manage their images"
ON public.business_images
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_images.business_id
    AND b.owner_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_images.business_id
    AND b.owner_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);