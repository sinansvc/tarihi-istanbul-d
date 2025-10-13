import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Settings, Save } from 'lucide-react';

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
            <Settings className="w-5 h-5 mr-2" />
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
            <div>
              <Label>Açıklama (TR)</Label>
              <Input
                value={settings.site_info?.description_tr || ''}
                onChange={(e) => updateField('site_info', 'description_tr', e.target.value)}
              />
            </div>
            <div>
              <Label>Açıklama (EN)</Label>
              <Input
                value={settings.site_info?.description_en || ''}
                onChange={(e) => updateField('site_info', 'description_en', e.target.value)}
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
          <CardTitle>İletişim Bilgileri</CardTitle>
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
              <Label>Adres (TR)</Label>
              <Input
                value={settings.contact_info?.address_tr || ''}
                onChange={(e) => updateField('contact_info', 'address_tr', e.target.value)}
              />
            </div>
            <div>
              <Label>Adres (EN)</Label>
              <Input
                value={settings.contact_info?.address_en || ''}
                onChange={(e) => updateField('contact_info', 'address_en', e.target.value)}
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
          <CardTitle>Sosyal Medya</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Facebook</Label>
              <Input
                value={settings.social_media?.facebook || ''}
                onChange={(e) => updateField('social_media', 'facebook', e.target.value)}
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input
                value={settings.social_media?.instagram || ''}
                onChange={(e) => updateField('social_media', 'instagram', e.target.value)}
              />
            </div>
            <div>
              <Label>Twitter</Label>
              <Input
                value={settings.social_media?.twitter || ''}
                onChange={(e) => updateField('social_media', 'twitter', e.target.value)}
              />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input
                value={settings.social_media?.linkedin || ''}
                onChange={(e) => updateField('social_media', 'linkedin', e.target.value)}
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
          <CardTitle>SEO Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Ana Sayfa Başlık (TR)</Label>
              <Input
                value={settings.seo_settings?.home_title_tr || ''}
                onChange={(e) => updateField('seo_settings', 'home_title_tr', e.target.value)}
              />
            </div>
            <div>
              <Label>Ana Sayfa Başlık (EN)</Label>
              <Input
                value={settings.seo_settings?.home_title_en || ''}
                onChange={(e) => updateField('seo_settings', 'home_title_en', e.target.value)}
              />
            </div>
            <div>
              <Label>Ana Sayfa Açıklama (TR)</Label>
              <Input
                value={settings.seo_settings?.home_description_tr || ''}
                onChange={(e) => updateField('seo_settings', 'home_description_tr', e.target.value)}
              />
            </div>
            <div>
              <Label>Ana Sayfa Açıklama (EN)</Label>
              <Input
                value={settings.seo_settings?.home_description_en || ''}
                onChange={(e) => updateField('seo_settings', 'home_description_en', e.target.value)}
              />
            </div>
            <div>
              <Label>Anahtar Kelimeler (TR)</Label>
              <Input
                value={settings.seo_settings?.keywords_tr || ''}
                onChange={(e) => updateField('seo_settings', 'keywords_tr', e.target.value)}
              />
            </div>
            <div>
              <Label>Anahtar Kelimeler (EN)</Label>
              <Input
                value={settings.seo_settings?.keywords_en || ''}
                onChange={(e) => updateField('seo_settings', 'keywords_en', e.target.value)}
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
          <CardTitle>İşletme Yönetimi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Yeni İşletmeleri Otomatik Onayla</Label>
            <Switch
              checked={settings.business_settings?.auto_approve || false}
              onCheckedChange={(checked) => updateField('business_settings', 'auto_approve', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>İşletme Sahibi Rolünü Otomatik Ata</Label>
            <Switch
              checked={settings.business_settings?.owner_role_auto_assign || false}
              onCheckedChange={(checked) => updateField('business_settings', 'owner_role_auto_assign', checked)}
            />
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
          <CardTitle>Bildirim Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Email Bildirimleri</Label>
            <Switch
              checked={settings.notification_settings?.email_enabled || false}
              onCheckedChange={(checked) => updateField('notification_settings', 'email_enabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Yeni İşletme Bildirimleri</Label>
            <Switch
              checked={settings.notification_settings?.new_business_notification || false}
              onCheckedChange={(checked) => updateField('notification_settings', 'new_business_notification', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Yorum Bildirimleri</Label>
            <Switch
              checked={settings.notification_settings?.review_notification || false}
              onCheckedChange={(checked) => updateField('notification_settings', 'review_notification', checked)}
            />
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
          <CardTitle>Görünüm Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tema Rengi</Label>
            <Input
              type="color"
              value={settings.appearance_settings?.theme_color || '#f59e0b'}
              onChange={(e) => updateField('appearance_settings', 'theme_color', e.target.value)}
            />
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
          <Button onClick={() => handleSave('appearance_settings')}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle>Bakım Modu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Bakım Modunu Etkinleştir</Label>
            <Switch
              checked={settings.maintenance_mode?.enabled || false}
              onCheckedChange={(checked) => updateField('maintenance_mode', 'enabled', checked)}
            />
          </div>
          <div>
            <Label>Bakım Mesajı (TR)</Label>
            <Input
              value={settings.maintenance_mode?.message_tr || ''}
              onChange={(e) => updateField('maintenance_mode', 'message_tr', e.target.value)}
            />
          </div>
          <div>
            <Label>Bakım Mesajı (EN)</Label>
            <Input
              value={settings.maintenance_mode?.message_en || ''}
              onChange={(e) => updateField('maintenance_mode', 'message_en', e.target.value)}
            />
          </div>
          <Button onClick={() => handleSave('maintenance_mode')}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;