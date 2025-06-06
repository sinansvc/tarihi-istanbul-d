
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WorkingHoursFormProps {
  formData: {
    working_hours: string;
  };
  setFormData: (data: any) => void;
}

const WorkingHoursForm = ({ formData, setFormData }: WorkingHoursFormProps) => {
  return (
    <div>
      <Label htmlFor="working_hours">Çalışma Saatleri</Label>
      <Input
        id="working_hours"
        value={formData.working_hours}
        onChange={(e) => setFormData({...formData, working_hours: e.target.value})}
        placeholder="Örn: Pazartesi-Cumartesi 09:00-18:00"
      />
    </div>
  );
};

export default WorkingHoursForm;
