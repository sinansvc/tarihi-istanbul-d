-- Create featured_businesses table to manage homepage featured listings
CREATE TABLE public.featured_businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  featured_until TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id)
);

-- Enable RLS
ALTER TABLE public.featured_businesses ENABLE ROW LEVEL SECURITY;

-- Create policies for featured businesses
CREATE POLICY "Everyone can view active featured businesses" 
ON public.featured_businesses 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage featured businesses" 
ON public.featured_businesses 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add foreign key constraint
ALTER TABLE public.featured_businesses 
ADD CONSTRAINT featured_businesses_business_id_fkey 
FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;

-- Add trigger for updated_at
CREATE TRIGGER update_featured_businesses_updated_at
BEFORE UPDATE ON public.featured_businesses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add audit trigger
CREATE TRIGGER audit_featured_businesses_changes
AFTER INSERT OR UPDATE OR DELETE ON public.featured_businesses
FOR EACH ROW
EXECUTE FUNCTION public.audit_changes();

-- Add admin policies for categories table to allow CRUD operations
CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));