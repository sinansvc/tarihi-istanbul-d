-- İlk admin kullanıcısını eklemek için basit bir migration
-- Not: Bu migration sadece ilk admin'i ekliyoruz, gerisi admin panelinden yapılacak

-- Eğer user_roles tablosu yoksa (zaten var gibi görünüyor), ama yine de kontrol edelim
DO $$ 
BEGIN
    -- user_roles tablosunun varlığını kontrol et
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        -- Eğer yoksa oluştur
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
        
        CREATE TABLE public.user_roles (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            role app_role NOT NULL,
            created_at timestamp with time zone DEFAULT now(),
            UNIQUE (user_id, role)
        );
        
        -- RLS'yi etkinleştir
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
        
        -- Politikaları oluştur
        CREATE POLICY "Users can view their own roles" ON public.user_roles
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Admins can view all user roles" ON public.user_roles
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.user_roles ur 
                    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
                )
            );
            
        CREATE POLICY "Admins can manage user roles" ON public.user_roles
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.user_roles ur 
                    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
                )
            );
    END IF;
END $$;

-- Admin kullanıcı ID'sini elle eklemek için bir yorum bırakıyoruz
-- Gerçek admin user_id'sini buraya eklemek gerekecek
-- ÖRNEK: INSERT INTO public.user_roles (user_id, role) VALUES ('your-user-id-here', 'admin');

-- Geçici olarak, ilk kayıt olan kullanıcıyı admin yapacak bir fonksiyon
CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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