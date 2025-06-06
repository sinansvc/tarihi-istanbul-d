
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from 'lucide-react';

interface CategoryLocationFormProps {
  formData: {
    category_id: string;
    location_id: string;
  };
  setFormData: (data: any) => void;
  categories: any[];
  locations: any[];
}

const CategoryLocationForm = ({ formData, setFormData, categories, locations }: CategoryLocationFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Kategori *</Label>
        <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.icon} {category.name_tr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Lokasyon *</Label>
        <Select value={formData.location_id} onValueChange={(value) => setFormData({...formData, location_id: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Lokasyon seçin" />
          </SelectTrigger>
          <SelectContent>
            {locations?.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                <MapPin className="w-4 h-4 mr-2" />
                {location.name_tr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CategoryLocationForm;
