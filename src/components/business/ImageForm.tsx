
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ImageFormProps {
  formData: {
    cover_image_url: string;
  };
  setFormData: (data: any) => void;
}

const ImageForm = ({ formData, setFormData }: ImageFormProps) => {
  return (
    <div>
      <Label htmlFor="cover_image_url">Kapak Resmi URL'si</Label>
      <Input
        id="cover_image_url"
        value={formData.cover_image_url}
        onChange={(e) => setFormData({...formData, cover_image_url: e.target.value})}
        placeholder="Resim URL'si girin"
      />
    </div>
  );
};

export default ImageForm;
