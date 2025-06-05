
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { Store, MapPin, Phone, Globe, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AddBusiness = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name_tr: '',
    name_en: '',
    description_tr: '',
    description_en: '',
    category_id: '',
    location_id: '',
    shop_number: '',
    phone: '',
    website: '',
    working_hours: '',
    accepts_online_orders: false,
    delivery_available: false,
    cover_image_url: ''
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_tr');
      if (error) throw error;
      return data;
    },
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name_tr');
      if (error) throw error;
      return data;
    },
  });

  // User kontrolünü hooks'lardan sonra yapıyoruz
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_tr || !formData.category_id || !formData.location_id) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert working_hours to JSON format if provided
      const workingHoursJson = formData.working_hours 
        ? { general: formData.working_hours }
        : null;

      const { error } = await supabase
        .from('businesses')
        .insert({
          name_tr: formData.name_tr,
          name_en: formData.name_en || null,
          description_tr: formData.description_tr || null,
          description_en: formData.description_en || null,
          category_id: formData.category_id,
          location_id: formData.location_id,
          shop_number: formData.shop_number || null,
          phone: formData.phone || null,
          website: formData.website || null,
          working_hours: workingHoursJson,
          accepts_online_orders: formData.accepts_online_orders,
          delivery_available: formData.delivery_available,
          cover_image_url: formData.cover_image_url || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('İşletme başarıyla eklendi! Onay bekliyor.');
      navigate('/profile');
    } catch (error) {
      console.error('Error adding business:', error);
      toast.error('İşletme eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">İşletme Ekle</h1>
          <p className="text-gray-600">Yeni bir işletme ekleyin ve İstanbul Çarşı'da yer alın</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="w-5 h-5 mr-2" />
              İşletme Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Temel Bilgiler */}
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

              {/* Kategori ve Lokasyon */}
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

              {/* İletişim Bilgileri */}
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

              {/* Açıklama */}
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

              {/* Çalışma Saatleri */}
              <div>
                <Label htmlFor="working_hours">Çalışma Saatleri</Label>
                <Input
                  id="working_hours"
                  value={formData.working_hours}
                  onChange={(e) => setFormData({...formData, working_hours: e.target.value})}
                  placeholder="Örn: Pazartesi-Cumartesi 09:00-18:00"
                />
              </div>

              {/* Kapak Resmi */}
              <div>
                <Label htmlFor="cover_image_url">Kapak Resmi URL'si</Label>
                <Input
                  id="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({...formData, cover_image_url: e.target.value})}
                  placeholder="Resim URL'si girin"
                />
              </div>

              {/* Özellikler */}
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

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Ekleniyor...' : 'İşletme Ekle'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default AddBusiness;
