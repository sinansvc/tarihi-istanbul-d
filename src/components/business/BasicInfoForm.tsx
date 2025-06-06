
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BasicInfoFormProps {
  formData: {
    name_tr: string;
    name_en: string;
  };
  setFormData: (data: any) => void;
}

const BasicInfoForm = ({ formData, setFormData }: BasicInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name_tr">İşletme Adı (Türkçe) *</Label>
        <Input
          id="name_tr"
          value={formData.name_tr}
          onChange={(e) => setFormData({...formData, name_tr: e.target.value})}
          placeholder="Örn: Aşçıbaşı Restaurant"
          required
        />
      </div>
      <div>
        <Label htmlFor="name_en">İşletme Adı (İngilizce)</Label>
        <Input
          id="name_en"
          value={formData.name_en}
          onChange={(e) => setFormData({...formData, name_en: e.target.value})}
          placeholder="Örn: Aşçıbaşı Restaurant"
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
