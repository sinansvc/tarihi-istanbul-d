
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Globe, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

interface ContactInfoFormProps {
  formData: {
    shop_number: string;
    phone: string;
    website: string;
    email?: string;
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  setFormData: (data: any) => void;
}

const ContactInfoForm = ({ formData, setFormData }: ContactInfoFormProps) => {
  return (
    <div className="space-y-6">
      {/* Temel İletişim Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Temel İletişim Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shop_number">Dükkan/Mağaza No</Label>
            <Input
              id="shop_number"
              value={formData.shop_number}
              onChange={(e) => setFormData({...formData, shop_number: e.target.value})}
              placeholder="Örn: 15A, Kat 2"
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefon *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="Örn: +90 212 555 0123"
            />
          </div>
          <div>
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Örn: info@isletme.com"
            />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp || ''}
              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              placeholder="Örn: +90 555 123 4567"
            />
          </div>
        </CardContent>
      </Card>

      {/* Web Sitesi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Web Sitesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="website">Website URL'si</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              placeholder="Örn: https://www.isletme.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sosyal Medya */}
      <Card>
        <CardHeader>
          <CardTitle>Sosyal Medya Hesapları</CardTitle>
          <p className="text-sm text-muted-foreground">
            İşletmenizin sosyal medya hesaplarını ekleyin
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-500" />
              Instagram
            </Label>
            <Input
              id="instagram"
              value={formData.instagram || ''}
              onChange={(e) => setFormData({...formData, instagram: e.target.value})}
              placeholder="@kullaniciadi veya tam URL"
            />
          </div>
          <div>
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </Label>
            <Input
              id="facebook"
              value={formData.facebook || ''}
              onChange={(e) => setFormData({...formData, facebook: e.target.value})}
              placeholder="Sayfa adı veya tam URL"
            />
          </div>
          <div>
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <Twitter className="w-4 h-4 text-blue-400" />
              Twitter/X
            </Label>
            <Input
              id="twitter"
              value={formData.twitter || ''}
              onChange={(e) => setFormData({...formData, twitter: e.target.value})}
              placeholder="@kullaniciadi veya tam URL"
            />
          </div>
          <div>
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-blue-700" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={formData.linkedin || ''}
              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              placeholder="Şirket sayfası URL'si"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfoForm;
