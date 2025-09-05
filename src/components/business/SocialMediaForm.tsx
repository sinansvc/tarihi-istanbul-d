import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Instagram, Facebook, Twitter, Linkedin, Youtube, Video } from "lucide-react";

interface SocialMediaFormProps {
  formData: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    social_media_enabled?: boolean;
  };
  setFormData: (data: any) => void;
}

const SocialMediaForm = ({ formData, setFormData }: SocialMediaFormProps) => {
  const socialMediaEnabled = formData.social_media_enabled || false;

  const socialPlatforms = [
    {
      key: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      color: 'text-pink-500',
      placeholder: '@kullaniciadi veya https://instagram.com/kullaniciadi'
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      placeholder: 'Sayfa adı veya https://facebook.com/sayfa'
    },
    {
      key: 'twitter',
      label: 'Twitter/X',
      icon: Twitter,
      color: 'text-blue-400',
      placeholder: '@kullaniciadi veya https://twitter.com/kullaniciadi'
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700',
      placeholder: 'https://linkedin.com/company/sirket'
    },
    {
      key: 'youtube',
      label: 'YouTube',
      icon: Youtube,
      color: 'text-red-600',
      placeholder: 'https://youtube.com/@kanal'
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      icon: Video,
      color: 'text-black',
      placeholder: '@kullaniciadi veya https://tiktok.com/@kullaniciadi'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sosyal Medya Hesapları</CardTitle>
          <Switch
            checked={socialMediaEnabled}
            onCheckedChange={(checked) => 
              setFormData({...formData, social_media_enabled: checked})
            }
          />
        </div>
        <p className="text-sm text-muted-foreground">
          İşletmenizin sosyal medya hesaplarını müşterilerle paylaşın
        </p>
      </CardHeader>
      
      {socialMediaEnabled && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPlatforms.map(({ key, label, icon: Icon, color, placeholder }) => (
              <div key={key}>
                <Label htmlFor={key} className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  {label}
                </Label>
                <Input
                  id={key}
                  value={(formData[key as keyof typeof formData] as string) || ''}
                  onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                  placeholder={placeholder}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Sosyal Medya İpuçları:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Tam URL veya kullanıcı adı yazabilirsiniz</li>
              <li>• Aktif hesaplarınızı eklemeyi unutmayın</li>
              <li>• Müşterileriniz bu hesaplardan sizi takip edebilir</li>
              <li>• Hesap adlarınızı doğru yazdığınızdan emin olun</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default SocialMediaForm;