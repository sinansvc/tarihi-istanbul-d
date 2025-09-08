-- user_roles tablosundaki mevcut RLS policy'lerini kaldır
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- RLS'i geçici olarak kapat
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Güvenli admin kontrolü için fonksiyon oluştur
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS'i yeniden etkinleştir
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Yeni güvenli RLS policy'leri oluştur
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- İlk kullanıcıyı admin yapmak için fonksiyonu çalıştır
SELECT public.make_first_user_admin();