
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Phone, Heart, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Businesses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
  const { user } = useAuth();

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

  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses', searchTerm, selectedCategory, selectedLocation],
    queryFn: async () => {
      let query = supabase
        .from('businesses')
        .select(`
          *,
          categories(name_tr, name_en, icon, color),
          locations(name_tr, name_en)
        `)
        .eq('status', 'active');

      if (searchTerm) {
        query = query.or(`name_tr.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%,description_tr.ilike.%${searchTerm}%`);
      }

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      if (selectedLocation) {
        query = query.eq('location_id', selectedLocation);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addToFavorites = async (businessId: string) => {
    if (!user) {
      toast.error('Favorilere eklemek için giriş yapmalısınız');
      return;
    }

    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: user.id, business_id: businessId });

    if (error) {
      toast.error('Favorilere eklenirken hata oluştu');
    } else {
      toast.success('Favorilere eklendi!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="İşletme veya ürün arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori Seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name_tr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Lokasyon Seçin" />
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

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(undefined);
                setSelectedLocation(undefined);
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {businesses?.length || 0} işletme bulundu
          </p>
        </div>

        {/* Business Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businesses?.map((business) => (
              <Card key={business.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="relative">
                  <div 
                    className="h-48 bg-cover bg-center rounded-t-lg"
                    style={{ 
                      backgroundImage: business.cover_image_url 
                        ? `url(${business.cover_image_url})` 
                        : 'url(https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80)'
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToFavorites(business.id);
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  {business.categories && (
                    <Badge className="absolute bottom-2 left-2 bg-amber-600">
                      {business.categories.icon} {business.categories.name_tr}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-amber-600 transition-colors">
                    {business.name_tr}
                  </h3>
                  
                  {business.locations && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {business.locations.name_tr}
                      {business.shop_number && ` - ${business.shop_number}`}
                    </div>
                  )}
                  
                  {business.phone && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Phone className="w-4 h-4 mr-1" />
                      {business.phone}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">4.5</span>
                    </div>
                    
                    <div className="flex gap-1">
                      {business.accepts_online_orders && (
                        <Badge variant="secondary" className="text-xs">Online</Badge>
                      )}
                      {business.delivery_available && (
                        <Badge variant="secondary" className="text-xs">Teslimat</Badge>
                      )}
                    </div>
                  </div>
                  
                  {business.description_tr && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {business.description_tr}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {businesses?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Arama kriterlerinize uygun işletme bulunamadı.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(undefined);
                setSelectedLocation(undefined);
              }}
            >
              Tüm İşletmeleri Göster
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Businesses;
