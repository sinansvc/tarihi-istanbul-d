-- Add RLS policies for locations table to allow admins to manage locations
CREATE POLICY "Admins can insert locations"
ON public.locations
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update locations"
ON public.locations
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete locations"
ON public.locations
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));