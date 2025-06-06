
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface BusinessFeaturesFormProps {
  formData: {
    accepts_online_orders: boolean;
    delivery_available: boolean;
  };
  setFormData: (data: any) => void;
}

const BusinessFeaturesForm = ({ formData, setFormData }: BusinessFeaturesFormProps) => {
  return (
    <div className="space-y-3">
      <Label>Özellikler</Label>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="online_orders"
          checked={formData.accepts_online_orders}
          onCheckedChange={(checked) => setFormData({...formData, accepts_online_orders: checked as boolean})}
        />
        <Label htmlFor="online_orders">Online sipariş kabul eder</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="delivery"
          checked={formData.delivery_available}
          onCheckedChange={(checked) => setFormData({...formData, delivery_available: checked as boolean})}
        />
        <Label htmlFor="delivery">Teslimat hizmeti verir</Label>
      </div>
    </div>
  );
};

export default BusinessFeaturesForm;
