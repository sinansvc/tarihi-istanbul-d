
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Phone, Instagram, Facebook, Globe, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeaturedBusiness {
  id: string;
  business_id: string;
  sort_order: number;
  is_active: boolean;
  businesses: {
    id: string;
    name_tr: string;
    name_en: string | null;
    description_tr: string | null;
    phone: string | null;
    website: string | null;
    whatsapp: string | null;
    working_hours: any;
    logo_url: string | null;
    cover_image_url: string | null;
    social_media: any;
    status: string;
    categories: {
      name_tr: string;
    } | null;
    locations: {
      name_tr: string;
    } | null;
    business_images: Array<{
      image_url: string;
      alt_text: string | null;
    }> | null;
  };
}

const FeaturedBusinesses = () => {
  const navigate = useNavigate();

  const { data: featuredBusinesses, isLoading } = useQuery({
    queryKey: ['featured-businesses-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_businesses')
        .select(`
          *,
          businesses:business_id (
            id,
            name_tr,
            name_en,
            description_tr,
            phone,
            website,
            whatsapp,
            working_hours,
            logo_url,
            cover_image_url,
            social_media,
            status,
            categories (name_tr),
            locations (name_tr),
            business_images (
              image_url,
              alt_text
            )
          )
        `)
        .eq('is_active', true)
        .eq('businesses.status', 'active')
        .order('sort_order');
      
      if (error) throw error;
      return data as any[];
    },
  });

  // Helper function to get working hours text
  const getWorkingHoursText = (workingHours: any) => {
    if (typeof workingHours === 'string') {
      return workingHours;
    }
    if (workingHours?.detailed_hours && Array.isArray(workingHours.detailed_hours)) {
      const openDays = workingHours.detailed_hours.filter((day: any) => day.isOpen);
      if (openDays.length === 0) return 'Kapalı';
      
      const groups: { [key: string]: string[] } = {};
      openDays.forEach((day: any) => {
        const key = `${day.openTime}-${day.closeTime}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(day.day);
      });

      return Object.entries(groups).map(([timeRange, days]) => {
        const dayLabels: any = {
          monday: 'Pt', tuesday: 'Sa', wednesday: 'Ça', thursday: 'Pe',
          friday: 'Cu', saturday: 'Ct', sunday: 'Pa'
        };
        const dayNames = days.map(d => dayLabels[d] || d);
        const dayRange = dayNames.length > 1 ? `${dayNames[0]}-${dayNames[dayNames.length - 1]}` : dayNames[0];
        return `${dayRange} ${timeRange}`;
      }).join(', ');
    }
    return 'Çalışma saatleri belirlenmemiş';
  };

  // Helper function to check if business is currently open
  const isBusinessOpen = (workingHours: any) => {
    // Simple check - can be enhanced with actual time logic
    if (typeof workingHours === 'string') {
      return workingHours.toLowerCase().includes('açık') || 
             workingHours.toLowerCase().includes('open');
    }
    if (workingHours?.detailed_hours && Array.isArray(workingHours.detailed_hours)) {
      return workingHours.detailed_hours.some((day: any) => day.isOpen);
    }
    return true; // Default to open if no data
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!featuredBusinesses || featuredBusinesses.length === 0) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Öne Çıkan İşletmeler
          </h2>
          <p className="text-xl text-gray-600">
            Henüz öne çıkan işletme bulunmuyor.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Öne Çıkan İşletmeler
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Çarşılarımızın köklü ve güvenilir işletmeleri ile tanışın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBusinesses.map((featured) => {
            const business = featured.businesses;
            
            // Skip if business doesn't exist or is null
            if (!business) return null;
            
            const isOpen = isBusinessOpen(business.working_hours);
            const workingHoursText = getWorkingHoursText(business.working_hours);
            const mainImage = business.cover_image_url || business.logo_url || business.business_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=400&q=80';
            const socialMedia = business.social_media || {};

            return (
              <Card 
                key={featured.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/business/${business.id}`)}
              >
                <div className="relative">
                  <img 
                    src={mainImage}
                    alt={business.name_tr}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant={isOpen ? "default" : "secondary"}
                      className={isOpen ? "bg-green-500" : "bg-gray-500"}
                    >
                      {isOpen ? "Açık" : "Kapalı"}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    {business.categories && (
                      <Badge variant="outline" className="bg-white">
                        {business.categories.name_tr}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-amber-600 transition-colors">
                        {business.name_tr}
                      </h3>
                      {business.name_en && (
                        <p className="text-sm text-gray-500">{business.name_en}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  
                  {business.locations && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{business.locations.name_tr}</span>
                    </div>
                  )}
                  
                  {business.description_tr && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {business.description_tr}
                    </p>
                  )}

                  {/* Çalışma Saatleri */}
                  {workingHoursText && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-xs">{workingHoursText}</span>
                    </div>
                  )}

                  {/* İletişim ve Sosyal Medya */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      {business.phone && (
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <Phone className="w-3 h-3" />
                        </Button>
                      )}
                      {business.website && (
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <Globe className="w-3 h-3" />
                        </Button>
                      )}
                      {socialMedia.instagram && (
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <Instagram className="w-3 h-3" />
                        </Button>
                      )}
                      {socialMedia.facebook && (
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <Facebook className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Galeri göstergesi */}
                    {business.business_images && business.business_images.length > 0 && (
                      <div className="flex items-center text-gray-500">
                        <Image className="w-3 h-3 mr-1" />
                        <span className="text-xs">+{business.business_images.length}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    size="sm"
                  >
                    Detayları Görüntüle
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
            onClick={() => navigate('/businesses')}
          >
            Tüm İşletmeleri Görüntüle
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
