import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Settings, Save, Globe, Mail, Share2, Search, Palette, Shield, Wrench } from 'lucide-react';

const SystemSettings = () => {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<Record<string, any>>({});

  const { isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      const settingsMap: Record<string, any> = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = setting.value;
      });
      
      setSettings(settingsMap);
      return data;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Ayarlar güncellendi');
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast.error('Ayarlar güncellenirken hata oluştu');
    }
  });

  const updateField = (settingKey: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [settingKey]: {
        ...prev[settingKey],
        [field]: value
      }
    }));
  };

  const handleSave = (key: string) => {
    updateSettingMutation.mutate({ key, value: settings[key] });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ayarlar yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Site Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Genel Ayarlar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Site Adı (TR)</Label>
              <Input
                value={settings.site_info?.name_tr || ''}
                onChange={(e) => updateField('site_info', 'name_tr', e.target.value)}
              />
            </div>
            <div>
              <Label>Site Adı (EN)</Label>
              <Input
                value={settings.site_info?.name_en || ''}
                onChange={(e) => updateField('site_info', 'name_en', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Açıklama (TR)</Label>
              <Textarea
                value={settings.site_info?.description_tr || ''}
                onChange={(e) => updateField('site_info', 'description_tr', e.target.value)}
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Açıklama (EN)</Label>
              <Textarea
                value={settings.site_info?.description_en || ''}
                onChange={(e) => updateField('site_info', 'description_en', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input
                value={settings.site_info?.logo_url || ''}
                onChange={(e) => updateField('site_info', 'logo_url', e.target.value)}
              />
            </div>
            <div>
              <Label>Favicon URL</Label>
              <Input
                value={settings.site_info?.favicon_url || ''}
                onChange={(e) => updateField('site_info', 'favicon_url', e.target.value)}
              />
            </div>
          </div>
          <Button onClick={() => handleSave('site_info')}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            İletişim Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={settings.contact_info?.email || ''}
                onChange={(e) => updateField('contact_info', 'email', e.target.value)}
              />
            </div>
            <div>
              <Label>Telefon</Label>
              <Input
                value={settings.contact_info?.phone || ''}
                onChange={(e) => updateField('contact_info', 'phone', e.target.value)}
              />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input
                value={settings.contact_info?.whatsapp || ''}
                onChange={(e) => updateField('contact_info', 'whatsapp', e.target.value)}
                placeholder="+90..."
              />
            </div>
            <div>
              <Label>Destek Email</Label>
              <Input
                type="email"
                value={settings.contact_info?.support_email || ''}
                onChange={(e) => updateField('contact_info', 'support_email', e.target.value)}
              />
            </div>
            <div>
              <Label>Adres (TR)</Label>
              <Textarea
                value={settings.contact_info?.address_tr || ''}
                onChange={(e) => updateField('contact_info', 'address_tr', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label>Adres (EN)</Label>
              <Textarea
                value={settings.contact_info?.address_en || ''}
                onChange={(e) => updateField('contact_info', 'address_en', e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <Button onClick={() => handleSave('contact_info')}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Sosyal Medya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Facebook</Label>
              <Input
                value={settings.social_media?.facebook || ''}
                onChange={(e) => updateField('social_media', 'facebook', e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input
                value={settings.social_media?.instagram || ''}
                onChange={(e) => updateField('social_media', 'instagram', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label>Twitter / X</Label>
              <Input
                value={settings.social_media?.twitter || ''}
                onChange={(e) => updateField('social_media', 'twitter', e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input
                value={settings.social_media?.linkedin || ''}
                onChange={(e) => updateField('social_media', 'linkedin', e.target.value)}
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <Label>YouTube</Label>
              <Input
                value={settings.social_media?.youtube || ''}
                onChange={(e) => updateField('social_media', 'youtube', e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <Label>TikTok</Label>
              <Input
                value={settings.social_media?.tiktok || ''}
                onChange={(e) => updateField('social_media', 'tiktok', e.target.value)}
                placeholder="https://tiktok.com/..."
              />
            </div>
          </div>
          <Button onClick={() => handleSave('social_media')}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            SEO Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Ana Sayfa Başlık (TR)</Label>
              <Input
                value={settings.seo_settings?.home_title_tr || ''}
                onChange={(e) => updateField('seo_settings', 'home_title_tr', e.target.value)}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground mt-1">Max 60 karakter</p>
            </div>
            <div>
              <Label>Ana Sayfa Başlık (EN)</Label>
              <Input
                value={settings.seo_settings?.home_title_en || ''}
                onChange={(e) => updateField('seo_settings', 'home_title_en', e.target.value)}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground mt-1">Max 60 karakter</p>
            </div>
            <div>
              <Label>Ana Sayfa Açıklama (TR)</Label>
              <Textarea
                value={settings.seo_settings?.home_description_tr || ''}
                onChange={(e) => updateField('seo_settings', 'home_description_tr', e.target.value)}
                maxLength={160}
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">Max 160 karakter</p>
            </div>
            <div>
              <Label>Ana Sayfa Açıklama (EN)</Label>
              <Textarea
                value={settings.seo_settings?.home_description_en || ''}
                onChange={(e) => updateField('seo_settings', 'home_description_en', e.target.value)}
                maxLength={160}
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">Max 160 karakter</p>
            </div>
            <div>
              <Label>Anahtar Kelimeler (TR)</Label>
              <Input
                value={settings.seo_settings?.keywords_tr || ''}
                onChange={(e) => updateField('seo_settings', 'keywords_tr', e.target.value)}
                placeholder="anahtar1, anahtar2, anahtar3"
              />
            </div>
            <div>
              <Label>Anahtar Kelimeler (EN)</Label>
              <Input
                value={settings.seo_settings?.keywords_en || ''}
                onChange={(e) => updateField('seo_settings', 'keywords_en', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
            <div>
              <Label>Google Analytics ID</Label>
              <Input
                value={settings.seo_settings?.google_analytics_id || ''}
                onChange={(e) => updateField('seo_settings', 'google_analytics_id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div>
              <Label>Google Search Console</Label>
              <Input
                value={settings.seo_settings?.google_search_console || ''}
                onChange={(e) => updateField('seo_settings', 'google_search_console', e.target.value)}
                placeholder="Doğrulama kodu"
              />
            </div>
          </div>
          <Button onClick={() => handleSave('seo_settings')}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            İşletme Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Yeni İşletmeleri Otomatik Onayla</Label>
                <p className="text-sm text-muted-foreground">Yeni eklenen işletmeler manuel onay beklemeden yayınlanır</p>
              </div>
              <Switch
                checked={settings.business_settings?.auto_approve || false}
                onCheckedChange={(checked) => updateField('business_settings', 'auto_approve', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">İşletme Sahibi Rolünü Otomatik Ata</Label>
                <p className="text-sm text-muted-foreground">İşletme ekleyen kullanıcıya otomatik işletme sahibi rolü verilir</p>
              </div>
              <Switch
                checked={settings.business_settings?.owner_role_auto_assign || false}
                onCheckedChange={(checked) => updateField('business_settings', 'owner_role_auto_assign', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Yorumlara İzin Ver</Label>
                <p className="text-sm text-muted-foreground">Kullanıcılar işletmelere yorum yapabilir</p>
              </div>
              <Switch
                checked={settings.business_settings?.enable_reviews || true}
                onCheckedChange={(checked) => updateField('business_settings', 'enable_reviews', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Yorum Moderasyonu</Label>
                <p className="text-sm text-muted-foreground">Yorumlar onaylanmadan yayınlanmaz</p>
              </div>
              <Switch
                checked={settings.business_settings?.review_moderation || false}
                onCheckedChange={(checked) => updateField('business_settings', 'review_moderation', checked)}
              />
            </div>
            <div>
              <Label>Maksimum Galeri Görseli</Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={settings.business_settings?.max_gallery_images || 10}
                onChange={(e) => updateField('business_settings', 'max_gallery_images', parseInt(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={() => handleSave('business_settings')}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Bildirim Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Email Bildirimleri</Label>
                <p className="text-sm text-muted-foreground">Sistem bildirimleri email ile gönderilir</p>
              </div>
              <Switch
                checked={settings.notification_settings?.email_enabled || false}
                onCheckedChange={(checked) => updateField('notification_settings', 'email_enabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Yeni İşletme Bildirimleri</Label>
                <p className="text-sm text-muted-foreground">Yeni işletme eklendiğinde adminlere bildirim gönder</p>
              </div>
              <Switch
                checked={settings.notification_settings?.new_business_notification || false}
                onCheckedChange={(checked) => updateField('notification_settings', 'new_business_notification', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Yorum Bildirimleri</Label>
                <p className="text-sm text-muted-foreground">Yeni yorum eklendiğinde işletme sahibine bildirim gönder</p>
              </div>
              <Switch
                checked={settings.notification_settings?.review_notification || false}
                onCheckedChange={(checked) => updateField('notification_settings', 'review_notification', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">İletişim Formu Bildirimleri</Label>
                <p className="text-sm text-muted-foreground">İletişim formundan mesaj geldiğinde bildirim gönder</p>
              </div>
              <Switch
                checked={settings.notification_settings?.contact_notification || false}
                onCheckedChange={(checked) => updateField('notification_settings', 'contact_notification', checked)}
              />
            </div>
            <div>
              <Label>Bildirim Email Adresi</Label>
              <Input
                type="email"
                value={settings.notification_settings?.notification_email || ''}
                onChange={(e) => updateField('notification_settings', 'notification_email', e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <Button onClick={() => handleSave('notification_settings')}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Görünüm Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Ana Tema Rengi</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings.appearance_settings?.primary_color || '#f59e0b'}
                  onChange={(e) => updateField('appearance_settings', 'primary_color', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={settings.appearance_settings?.primary_color || '#f59e0b'}
                  onChange={(e) => updateField('appearance_settings', 'primary_color', e.target.value)}
                  placeholder="#f59e0b"
                />
              </div>
            </div>
            <div>
              <Label>İkincil Tema Rengi</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings.appearance_settings?.secondary_color || '#0ea5e9'}
                  onChange={(e) => updateField('appearance_settings', 'secondary_color', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={settings.appearance_settings?.secondary_color || '#0ea5e9'}
                  onChange={(e) => updateField('appearance_settings', 'secondary_color', e.target.value)}
                  placeholder="#0ea5e9"
                />
              </div>
            </div>
            <div>
              <Label>Öne Çıkan İşletme Sayısı</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={settings.appearance_settings?.featured_count || 6}
                onChange={(e) => updateField('appearance_settings', 'featured_count', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>Sayfa Başına İşletme Sayısı</Label>
              <Input
                type="number"
                min="6"
                max="100"
                value={settings.appearance_settings?.items_per_page || 12}
                onChange={(e) => updateField('appearance_settings', 'items_per_page', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg md:col-span-2">
              <div>
                <Label className="text-base">Karanlık Mod</Label>
                <p className="text-sm text-muted-foreground">Kullanıcılar karanlık modu kullanabilir</p>
              </div>
              <Switch
                checked={settings.appearance_settings?.enable_dark_mode || false}
                onCheckedChange={(checked) => updateField('appearance_settings', 'enable_dark_mode', checked)}
              />
            </div>
          </div>
          <Button onClick={() => handleSave('appearance_settings')}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Güvenlik Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">İki Faktörlü Doğrulama</Label>
                <p className="text-sm text-muted-foreground">Kullanıcılar için 2FA zorunlu tutulur</p>
              </div>
              <Switch
                checked={settings.security_settings?.require_2fa || false}
                onCheckedChange={(checked) => updateField('security_settings', 'require_2fa', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Email Doğrulama</Label>
                <p className="text-sm text-muted-foreground">Kullanıcılar email adreslerini doğrulamalı</p>
              </div>
              <Switch
                checked={settings.security_settings?.require_email_verification || true}
                onCheckedChange={(checked) => updateField('security_settings', 'require_email_verification', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Güvenlik Logları</Label>
                <p className="text-sm text-muted-foreground">Tüm önemli işlemler loglanır</p>
              </div>
              <Switch
                checked={settings.security_settings?.enable_audit_logs || true}
                onCheckedChange={(checked) => updateField('security_settings', 'enable_audit_logs', checked)}
              />
            </div>
            <div>
              <Label>Parola Minimum Uzunluk</Label>
              <Input
                type="number"
                min="6"
                max="32"
                value={settings.security_settings?.password_min_length || 8}
                onChange={(e) => updateField('security_settings', 'password_min_length', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>Oturum Süresi (dakika)</Label>
              <Input
                type="number"
                min="15"
                max="1440"
                value={settings.security_settings?.session_timeout || 60}
                onChange={(e) => updateField('security_settings', 'session_timeout', parseInt(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={() => handleSave('security_settings')}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="w-5 h-5 mr-2" />
            Bakım Modu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50 dark:bg-amber-950">
            <div>
              <Label className="text-base">Bakım Modunu Etkinleştir</Label>
              <p className="text-sm text-muted-foreground">Site ziyaretçilere kapalı olur, sadece adminler erişebilir</p>
            </div>
            <Switch
              checked={settings.maintenance_mode?.enabled || false}
              onCheckedChange={(checked) => updateField('maintenance_mode', 'enabled', checked)}
            />
          </div>
          <div>
            <Label>Bakım Mesajı (TR)</Label>
            <Textarea
              value={settings.maintenance_mode?.message_tr || ''}
              onChange={(e) => updateField('maintenance_mode', 'message_tr', e.target.value)}
              placeholder="Site bakımda. Lütfen daha sonra tekrar deneyin."
              rows={3}
            />
          </div>
          <div>
            <Label>Bakım Mesajı (EN)</Label>
            <Textarea
              value={settings.maintenance_mode?.message_en || ''}
              onChange={(e) => updateField('maintenance_mode', 'message_en', e.target.value)}
              placeholder="Site is under maintenance. Please try again later."
              rows={3}
            />
          </div>
          <div>
            <Label>Tahmini Bitiş Zamanı</Label>
            <Input
              type="datetime-local"
              value={settings.maintenance_mode?.estimated_end || ''}
              onChange={(e) => updateField('maintenance_mode', 'estimated_end', e.target.value)}
            />
          </div>
          <Button onClick={() => handleSave('maintenance_mode')} variant="destructive">
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;