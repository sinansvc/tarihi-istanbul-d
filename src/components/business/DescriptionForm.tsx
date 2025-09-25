
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { descriptionSchema, validateInput } from "@/lib/validation";

interface DescriptionFormProps {
  formData: {
    description_tr: string;
  };
  setFormData: (data: any) => void;
}

const DescriptionForm = ({ formData, setFormData }: DescriptionFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const validation = validateInput(descriptionSchema, { ...formData, [field]: value });
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

  const handleInputChange = (value: string) => {
    // Sanitize input - remove potentially harmful characters but allow basic formatting
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    setFormData({ ...formData, description_tr: sanitizedValue });
    validateField('description_tr', sanitizedValue);
  };

  return (
    <div>
      <Label htmlFor="description_tr">Açıklama (Türkçe)</Label>
      <Textarea
        id="description_tr"
        value={formData.description_tr}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="İşletmeniz hakkında bilgi verin..."
        rows={3}
        maxLength={1000}
        className={errors.description_tr ? 'border-red-500' : ''}
      />
      {errors.description_tr && (
        <p className="text-sm text-red-500 mt-1">{errors.description_tr}</p>
      )}
      <p className="text-sm text-gray-500 mt-1">
        {formData.description_tr?.length || 0}/1000 karakter
      </p>
    </div>
  );
};

export default DescriptionForm;
