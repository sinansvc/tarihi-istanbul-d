
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFormProps {
  formData: {
    description_tr: string;
  };
  setFormData: (data: any) => void;
}

const DescriptionForm = ({ formData, setFormData }: DescriptionFormProps) => {
  return (
    <div>
      <Label htmlFor="description_tr">Açıklama (Türkçe)</Label>
      <Textarea
        id="description_tr"
        value={formData.description_tr}
        onChange={(e) => setFormData({...formData, description_tr: e.target.value})}
        placeholder="İşletmeniz hakkında bilgi verin..."
        rows={3}
      />
    </div>
  );
};

export default DescriptionForm;
