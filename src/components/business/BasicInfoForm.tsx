
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { basicInfoSchema, validateInput } from "@/lib/validation";

interface BasicInfoFormProps {
  formData: {
    name_tr: string;
    name_en: string;
  };
  setFormData: (data: any) => void;
}

const BasicInfoForm = ({ formData, setFormData }: BasicInfoFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const validation = validateInput(basicInfoSchema, { ...formData, [field]: value });
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name_tr">İşletme Adı (Türkçe) *</Label>
        <Input
          id="name_tr"
          value={formData.name_tr}
          onChange={(e) => handleInputChange('name_tr', e.target.value)}
          placeholder="Örn: Aşçıbaşı Restaurant"
          maxLength={100}
          className={errors.name_tr ? 'border-red-500' : ''}
          required
        />
        {errors.name_tr && (
          <p className="text-sm text-red-500 mt-1">{errors.name_tr}</p>
        )}
      </div>
      <div>
        <Label htmlFor="name_en">İşletme Adı (İngilizce)</Label>
        <Input
          id="name_en"
          value={formData.name_en}
          onChange={(e) => handleInputChange('name_en', e.target.value)}
          placeholder="Örn: Aşçıbaşı Restaurant"
          maxLength={100}
          className={errors.name_en ? 'border-red-500' : ''}
        />
        {errors.name_en && (
          <p className="text-sm text-red-500 mt-1">{errors.name_en}</p>
        )}
      </div>
    </div>
  );
};

export default BasicInfoForm;
