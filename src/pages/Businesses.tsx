
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Phone, Heart, Star, Grid3X3, List, Filter, SlidersHorizontal, Clock, Wifi, Car, CreditCard, MapIcon, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Businesses = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(searchParams.get('category') || undefined);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(searchParams.get('location') || undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'rating' | 'distance'>('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([1, 5]);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [hasWifi, setHasWifi] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [acceptsCards, setAcceptsCards] = useState(false);
  const [onlineOrders, setOnlineOrders] = useState(false);
  const [delivery, setDelivery] = useState(false);
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
    queryKey: ['businesses', searchTerm, selectedCategory, selectedLocation, sortBy, isOpenNow, hasWifi, hasParking, acceptsCards, onlineOrders, delivery],
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

      // Özellik filtreleri
      if (onlineOrders) {
        query = query.eq('accepts_online_orders', true);
      }

      if (delivery) {
        query = query.eq('delivery_available', true);
      }

      // Sıralama
      switch (sortBy) {
        case 'name':
          query = query.order('name_tr', { ascending: true });
          break;
        case 'rating':
          // Şimdilik random sıralama (gerçek rating sistemi eklendiğinde değişecek)
          query = query.order('created_at', { ascending: false });
          break;
        case 'distance':
          // Konum bazlı sıralama (harita entegrasyonu eklendiğinde)
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // URL parametrelerini güncelle
  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(undefined);
    setSelectedLocation(undefined);
    setIsOpenNow(false);
    setHasWifi(false);
    setHasParking(false);
    setAcceptsCards(false);
    setOnlineOrders(false);
    setDelivery(false);
    setPriceRange([1, 5]);
    setSearchParams({});
  };

  // İşletme detayına git
  const viewBusinessDetails = (businessId: string) => {
    navigate(`/business/${businessId}`);
  };

  // Filtrelenmiş işletmeler
  const filteredBusinesses = useMemo(() => {
    if (!businesses) return [];
    
    return businesses.filter(business => {
      // Açık/kapalı kontrolü (şimdilik örnek mantık)
      if (isOpenNow) {
        const currentHour = new Date().getHours();
        if (currentHour < 9 || currentHour > 18) return false;
      }
      
      return true;
    });
  }, [businesses, isOpenNow]);

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
        {/* Gelişmiş Arama ve Filtreler */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          {/* Ana Arama Satırı */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="İşletme, ürün veya hizmet arayın..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateSearchParams('search', e.target.value || null);
                }}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value);
              updateSearchParams('category', value || null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Kategoriler</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name_tr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={(value) => {
              setSelectedLocation(value);
              updateSearchParams('location', value || null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Lokasyon Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Lokasyonlar</SelectItem>
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
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Gelişmiş Filtre
            </Button>
          </div>

          {/* Gelişmiş Filtreler */}
          {showAdvancedFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sıralama */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Sıralama</Label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">En Yeni</SelectItem>
                      <SelectItem value="name">A-Z</SelectItem>
                      <SelectItem value="rating">En Popüler</SelectItem>
                      <SelectItem value="distance">En Yakın</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Açık/Kapalı */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="open-now"
                    checked={isOpenNow}
                    onCheckedChange={setIsOpenNow}
                  />
                  <Label htmlFor="open-now" className="text-sm">Şu anda açık</Label>
                </div>

                {/* Online Sipariş */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="online-orders"
                    checked={onlineOrders}
                    onCheckedChange={setOnlineOrders}
                  />
                  <Label htmlFor="online-orders" className="text-sm">Online sipariş</Label>
                </div>

                {/* Teslimat */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="delivery"
                    checked={delivery}
                    onCheckedChange={setDelivery}
                  />
                  <Label htmlFor="delivery" className="text-sm">Teslimat var</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={clearFilters}>
                  Filtreleri Temizle
                </Button>
                <Button onClick={() => setShowAdvancedFilters(false)}>
                  Filtreleri Uygula
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sonuçlar Başlığı ve Görünüm Kontrolü */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-gray-600">
              <span className="font-semibold">{filteredBusinesses?.length || 0}</span> işletme bulundu
              {searchTerm && <span className="ml-1">"{searchTerm}" için</span>}
            </p>
            {(selectedCategory || selectedLocation) && (
              <div className="flex gap-2 mt-2">
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {categories?.find(c => c.id === selectedCategory)?.icon}
                    {categories?.find(c => c.id === selectedCategory)?.name_tr}
                    <button 
                      onClick={() => {
                        setSelectedCategory(undefined);
                        updateSearchParams('category', null);
                      }}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedLocation && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {locations?.find(l => l.id === selectedLocation)?.name_tr}
                    <button 
                      onClick={() => {
                        setSelectedLocation(undefined);
                        updateSearchParams('location', null);
                      }}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600">Görünüm:</Label>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* İşletme Listesi */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'}`}
          >
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className={`${viewMode === 'grid' ? 'h-48' : 'h-32'} bg-gray-200 ${viewMode === 'grid' ? 'rounded-t-lg' : 'rounded-l-lg'}`} />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'}`}
          >
            {filteredBusinesses?.map((business) => (
              <Card 
                key={business.id} 
                className={`group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onClick={() => viewBusinessDetails(business.id)}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                  <div 
                    className={`bg-cover bg-center ${
                      viewMode === 'grid' 
                        ? 'h-48 rounded-t-lg' 
                        : 'h-32 rounded-l-lg'
                    }`}
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
                  {isOpenNow && (
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Açık
                    </Badge>
                  )}
                </div>
                
                <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'flex justify-between items-start' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'flex-1 mr-4' : ''}`}>
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

                      {business.description_tr && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {business.description_tr}
                        </p>
                      )}
                    </div>
                    
                    <div className={`${viewMode === 'list' ? 'text-right' : 'mt-3'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">4.5</span>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewBusinessDetails(business.id);
                          }}
                          className="ml-2"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {viewMode === 'list' ? 'Detay' : 'Görüntüle'}
                        </Button>
                      </div>
                      
                      <div className={`flex gap-1 ${viewMode === 'list' ? 'justify-end' : ''}`}>
                        {business.accepts_online_orders && (
                          <Badge variant="secondary" className="text-xs">
                            <CreditCard className="w-3 h-3 mr-1" />
                            Online
                          </Badge>
                        )}
                        {business.delivery_available && (
                          <Badge variant="secondary" className="text-xs">
                            <Car className="w-3 h-3 mr-1" />
                            Teslimat
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredBusinesses?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Sonuç bulunamadı</h3>
            <p className="text-gray-500 text-lg mb-4">
              Arama kriterlerinize uygun işletme bulunamadı.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={clearFilters}>
                Tüm Filtreleri Temizle
              </Button>
              <Button onClick={() => navigate('/add-business')}>
                İşletme Ekle
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Businesses;
