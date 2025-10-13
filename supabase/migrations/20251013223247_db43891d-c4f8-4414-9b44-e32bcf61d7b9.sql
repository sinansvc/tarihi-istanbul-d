-- Create site_settings table for general settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage site settings"
  ON public.site_settings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create page_contents table for managing static pages
CREATE TABLE IF NOT EXISTS public.page_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_tr text NOT NULL,
  title_en text,
  content_tr text NOT NULL,
  content_en text,
  meta_description_tr text,
  meta_description_en text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can view active page contents"
  ON public.page_contents
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all page contents"
  ON public.page_contents
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can manage page contents"
  ON public.page_contents
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default page contents
INSERT INTO public.page_contents (slug, title_tr, title_en, content_tr, content_en, meta_description_tr, meta_description_en) VALUES
('contact-support', 'İletişim & Destek', 'Contact & Support', 'İletişim ve destek içeriği buraya gelecek.', 'Contact and support content will be here.', 'İletişim ve destek sayfası', 'Contact and support page'),
('about', 'Hakkımızda', 'About Us', 'Hakkımızda içeriği buraya gelecek.', 'About us content will be here.', 'Hakkımızda sayfası', 'About us page'),
('business-registration', 'İşletme Kaydı', 'Business Registration', 'İşletme kaydı içeriği buraya gelecek.', 'Business registration content will be here.', 'İşletme kaydı sayfası', 'Business registration page'),
('customer-service', 'Müşteri Hizmetleri', 'Customer Service', 'Müşteri hizmetleri içeriği buraya gelecek.', 'Customer service content will be here.', 'Müşteri hizmetleri sayfası', 'Customer service page'),
('help-center', 'Yardım Merkezi', 'Help Center', 'Yardım merkezi içeriği buraya gelecek.', 'Help center content will be here.', 'Yardım merkezi sayfası', 'Help center page'),
('privacy-policy', 'Gizlilik Politikası', 'Privacy Policy', 'Gizlilik politikası içeriği buraya gelecek.', 'Privacy policy content will be here.', 'Gizlilik politikası sayfası', 'Privacy policy page'),
('terms-of-service', 'Kullanım Koşulları', 'Terms of Service', 'Kullanım koşulları içeriği buraya gelecek.', 'Terms of service content will be here.', 'Kullanım koşulları sayfası', 'Terms of service page');

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
('site_info', '{"name_tr": "İşletmeler Rehberi", "name_en": "Business Directory", "description_tr": "Yerel işletmeleri keşfedin", "description_en": "Discover local businesses", "logo_url": "", "favicon_url": ""}'::jsonb, 'Site genel bilgileri'),
('contact_info', '{"email": "info@example.com", "phone": "+90 555 123 4567", "address_tr": "Adres bilgisi", "address_en": "Address info"}'::jsonb, 'İletişim bilgileri'),
('social_media', '{"facebook": "", "instagram": "", "twitter": "", "linkedin": ""}'::jsonb, 'Sosyal medya linkleri'),
('seo_settings', '{"home_title_tr": "Ana Sayfa", "home_title_en": "Home", "home_description_tr": "İşletmeler rehberi", "home_description_en": "Business directory", "keywords_tr": "işletme, rehber", "keywords_en": "business, directory"}'::jsonb, 'SEO ayarları'),
('business_settings', '{"auto_approve": false, "min_required_fields": "name,category,location", "owner_role_auto_assign": true}'::jsonb, 'İşletme yönetimi ayarları'),
('notification_settings', '{"email_enabled": true, "new_business_notification": true, "review_notification": true}'::jsonb, 'Bildirim ayarları'),
('appearance_settings', '{"theme_color": "#f59e0b", "featured_count": 6, "list_view_default": "grid"}'::jsonb, 'Görünüm ayarları'),
('maintenance_mode', '{"enabled": false, "message_tr": "Bakım çalışması yapılıyor", "message_en": "Under maintenance"}'::jsonb, 'Bakım modu ayarları');

-- Trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_contents_updated_at
  BEFORE UPDATE ON public.page_contents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();