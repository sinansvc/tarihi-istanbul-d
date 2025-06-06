
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContactInfoFormProps {
  formData: {
    shop_number: string;
    phone: string;
    website: string;
  };
  setFormData: (data: any) => void;
}

const ContactInfoForm = ({ formData, setFormData }: ContactInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="shop_number">Dükkan No</Label>
        <Input
          id="shop_number"
          value={formData.shop_number}
          onChange={(e) => setFormData({...formData, shop_number: e.target.value})}
          placeholder="Örn: 15A"
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="Örn: +90 212 555 0123"
        />
      </div>
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={formData.website}
          onChange={(e) => setFormData({...formData, website: e.target.value})}
          placeholder="Örn: www.ornek.com"
        />
      </div>
    </div>
  );
};

export default ContactInfoForm;
