
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Store } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BasicInfoForm from '@/components/business/BasicInfoForm';
import CategoryLocationForm from '@/components/business/CategoryLocationForm';
import ContactInfoForm from '@/components/business/ContactInfoForm';
import DescriptionForm from '@/components/business/DescriptionForm';
import WorkingHoursForm from '@/components/business/WorkingHoursForm';
import ImageForm from '@/components/business/ImageForm';
import BusinessFeaturesForm from '@/components/business/BusinessFeaturesForm';
import SocialMediaForm from '@/components/business/SocialMediaForm';

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
    email: '',
    whatsapp: '',
    website: '',
    working_hours: '',
    detailed_hours: null,
    accepts_online_orders: false,
    delivery_available: false,
    cover_image_url: '',
    gallery_images: [],
    social_media_enabled: false,
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: ''
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
      // Prepare working hours data
      const workingHoursJson = formData.detailed_hours 
        ? { detailed: formData.detailed_hours }
        : formData.working_hours 
        ? { general: formData.working_hours }
        : null;

      // Prepare social media data
      const socialMediaData = formData.social_media_enabled ? {
        instagram: formData.instagram || null,
        facebook: formData.facebook || null,
        twitter: formData.twitter || null,
        linkedin: formData.linkedin || null,
        youtube: formData.youtube || null,
        tiktok: formData.tiktok || null
      } : null;

      const businessData = {
        name_tr: formData.name_tr,
        name_en: formData.name_en || null,
        description_tr: formData.description_tr || null,
        description_en: formData.description_en || null,
        category_id: formData.category_id,
        location_id: formData.location_id,
        shop_number: formData.shop_number || null,
        phone: formData.phone || null,
        email: formData.email || null,
        whatsapp: formData.whatsapp || null,
        website: formData.website || null,
        working_hours: workingHoursJson,
        accepts_online_orders: formData.accepts_online_orders,
        delivery_available: formData.delivery_available,
        cover_image_url: formData.cover_image_url || null,
        social_media: socialMediaData,
        status: 'pending' as const
      };

      const { data: newBusiness, error: businessError } = await supabase
        .from('businesses')
        .insert({
          ...businessData,
          owner_id: user.id
        })
        .select()
        .single();

      if (businessError) throw businessError;

      // Insert gallery images if any
      if (formData.gallery_images && formData.gallery_images.length > 0 && newBusiness) {
        const imageInserts = formData.gallery_images.map((imageUrl, index) => ({
          business_id: newBusiness.id,
          image_url: imageUrl,
          sort_order: index
        }));

        const { error: imagesError } = await supabase
          .from('business_images')
          .insert(imageInserts);

        if (imagesError) {
          console.error('Error adding gallery images:', imagesError);
          // Don't throw - business was created successfully
        }
      }

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
              <BasicInfoForm formData={formData} setFormData={setFormData} />
              
              <CategoryLocationForm 
                formData={formData} 
                setFormData={setFormData}
                categories={categories}
                locations={locations}
              />

              <ContactInfoForm formData={formData} setFormData={setFormData} />

              <DescriptionForm formData={formData} setFormData={setFormData} />

              <WorkingHoursForm formData={formData} setFormData={setFormData} />

              <ImageForm formData={formData} setFormData={setFormData} />

              <SocialMediaForm formData={formData} setFormData={setFormData} />

              <BusinessFeaturesForm formData={formData} setFormData={setFormData} />

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
