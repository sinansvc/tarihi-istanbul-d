-- Güvenlik uyarılarını düzeltmek için fonksiyonları güncelle

-- handle_new_user fonksiyonunu güvenli hale getir
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

-- update_updated_at_column fonksiyonunu güvenli hale getir
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- make_first_user_admin fonksiyonunu güvenli hale getir
CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Eğer hiç admin yoksa, ilk kullanıcıyı admin yap
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
        INSERT INTO public.user_roles (user_id, role)
        SELECT id, 'admin'::app_role
        FROM auth.users
        ORDER BY created_at ASC
        LIMIT 1
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END;
$$;