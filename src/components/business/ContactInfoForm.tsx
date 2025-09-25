
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Globe, Instagram, Facebook, Twitter, Linkedin, AlertCircle } from "lucide-react";
import { contactInfoSchema, validateInput } from "@/lib/validation";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const validation = validateInput(contactInfoSchema, { ...formData, [field]: value });
    if (!validation.success && validation.errors) {
      setErrors(prev => ({ ...prev, [field]: validation.errors![field] || '' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Sanitize input - remove potentially harmful characters
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    setFormData({ ...formData, [field]: sanitizedValue });
    validateField(field, sanitizedValue);
  };

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
              onChange={(e) => handleInputChange('shop_number', e.target.value)}
              placeholder="Örn: 15A, Kat 2"
              maxLength={20}
              className={errors.shop_number ? 'border-red-500' : ''}
            />
            {errors.shop_number && (
              <p className="text-sm text-red-500 mt-1">{errors.shop_number}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Telefon *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Örn: +90 212 555 0123"
              maxLength={15}
              className={errors.phone ? 'border-red-500' : ''}
              required
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Örn: info@isletme.com"
              maxLength={255}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp || ''}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              placeholder="Örn: +90 555 123 4567"
              maxLength={15}
              className={errors.whatsapp ? 'border-red-500' : ''}
            />
            {errors.whatsapp && (
              <p className="text-sm text-red-500 mt-1">{errors.whatsapp}</p>
            )}
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
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="Örn: https://www.isletme.com"
              maxLength={500}
              className={errors.website ? 'border-red-500' : ''}
            />
            {errors.website && (
              <p className="text-sm text-red-500 mt-1">{errors.website}</p>
            )}
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
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              placeholder="@kullaniciadi veya tam URL"
              maxLength={100}
              className={errors.instagram ? 'border-red-500' : ''}
            />
            {errors.instagram && (
              <p className="text-sm text-red-500 mt-1">{errors.instagram}</p>
            )}
          </div>
          <div>
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </Label>
            <Input
              id="facebook"
              value={formData.facebook || ''}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              placeholder="Sayfa adı veya tam URL"
              maxLength={100}
              className={errors.facebook ? 'border-red-500' : ''}
            />
            {errors.facebook && (
              <p className="text-sm text-red-500 mt-1">{errors.facebook}</p>
            )}
          </div>
          <div>
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <Twitter className="w-4 h-4 text-blue-400" />
              Twitter/X
            </Label>
            <Input
              id="twitter"
              value={formData.twitter || ''}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              placeholder="@kullaniciadi veya tam URL"
              maxLength={100}
              className={errors.twitter ? 'border-red-500' : ''}
            />
            {errors.twitter && (
              <p className="text-sm text-red-500 mt-1">{errors.twitter}</p>
            )}
          </div>
          <div>
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-blue-700" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={formData.linkedin || ''}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="Şirket sayfası URL'si"
              maxLength={100}
              className={errors.linkedin ? 'border-red-500' : ''}
            />
            {errors.linkedin && (
              <p className="text-sm text-red-500 mt-1">{errors.linkedin}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Input validation tips */}
      {Object.keys(errors).length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            Lütfen geçersiz bilgileri düzeltiniz. Tüm URL'ler http:// veya https:// ile başlamalı ve geçerli format olmalıdır.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ContactInfoForm;
