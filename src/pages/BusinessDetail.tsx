import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin, Phone, Globe, Star, Heart, Share2, Clock, 
  Instagram, Facebook, Twitter, Linkedin, ArrowLeft,
  Calendar, CreditCard, Car, Wifi, MapIcon, Image as ImageIcon,
  Mail, MessageCircle, Navigation, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: business, isLoading, error } = useQuery({
    queryKey: ['business-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('Business ID is required');
      
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          categories(name_tr, name_en, icon, color),
          locations(name_tr, name_en)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Favorileri kontrol et
  const { data: favoriteData } = useQuery({
    queryKey: ['favorite-check', id, user?.id],
    queryFn: async () => {
      if (!user || !id) return false;
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('business_id', id)
        .single();
      
      return !!data;
    },
    enabled: !!user && !!id,
  });

  React.useEffect(() => {
    setIsFavorite(!!favoriteData);
  }, [favoriteData]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Favorilere eklemek için giriş yapmalısınız');
      return;
    }

    if (!id) return;

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('business_id', id);
        
        if (error) throw error;
        setIsFavorite(false);
        toast.success('Favorilerden çıkarıldı');
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, business_id: id });
        
        if (error) throw error;
        setIsFavorite(true);
        toast.success('Favorilere eklendi');
      }
    } catch (error) {
      toast.error('İşlem sırasında hata oluştu');
    }
  };

  const shareBusinesss = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business?.name_tr,
          text: business?.description_tr,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link kopyalandı!');
    }
  };

  const openMap = () => {
    if (business?.address) {
      const query = encodeURIComponent(`${business.name_tr} ${business.address}`);
      window.open(`https://www.google.com/maps/search/${query}`, '_blank');
    }
  };

  const callBusiness = () => {
    if (business?.phone) {
      window.location.href = `tel:${business.phone}`;
    }
  };

  const sendWhatsApp = () => {
    if (business?.phone) {
      const message = encodeURIComponent(`Merhaba, ${business.name_tr} hakkında bilgi almak istiyorum.`);
      const phoneNumber = business.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  // Galeri resimleri (şimdilik sadece cover image)
  const allImages = [business?.cover_image_url].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">İşletme bulunamadı</h1>
          <Button onClick={() => navigate('/businesses')}>
            İşletmeler Sayfasına Dön
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Geri Dön Butonu */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </Button>

        {/* Ana Görsel/Galeri */}
        <Card className="mb-6 overflow-hidden">
          <div className="relative h-96">
            {allImages.length > 0 ? (
              <>
                <img
                  src={allImages[currentImageIndex]}
                  alt={business.name_tr}
                  className="w-full h-full object-cover"
                />
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/80 hover:bg-white"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/80 hover:bg-white"
                    onClick={shareBusinesss}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ana İçerik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Başlık ve Temel Bilgiler */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-3xl">{business.name_tr}</CardTitle>
                      {business.categories && (
                        <Badge className="bg-amber-600">
                          {business.categories.icon} {business.categories.name_tr}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      {business.locations && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {business.locations.name_tr}
                          {business.shop_number && ` - ${business.shop_number}`}
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>4.5 (127 değerlendirme)</span>
                      </div>
                    </div>

                    {business.description_tr && (
                      <p className="text-gray-700 leading-relaxed">
                        {business.description_tr}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Detaylı Bilgiler - Tabs */}
            <Tabs defaultValue="info" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">Bilgiler</TabsTrigger>
                <TabsTrigger value="hours">Saatler</TabsTrigger>
                <TabsTrigger value="gallery">Galeri</TabsTrigger>
                <TabsTrigger value="reviews">Yorumlar</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>İşletme Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {business.address && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Adres</p>
                          <p className="text-gray-600">{business.address}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {business.accepts_online_orders && (
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Online sipariş kabul ediyor</span>
                        </div>
                      )}
                      
                      {business.delivery_available && (
                        <div className="flex items-center space-x-2">
                          <Car className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Teslimat hizmeti var</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hours" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Çalışma Saatleri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {business.working_hours ? (
                      <p className="text-gray-700">{String(business.working_hours)}</p>
                    ) : (
                      <p className="text-gray-500">Çalışma saatleri belirtilmemiş</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Fotoğraf Galerisi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {allImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {allImages.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${business.name_tr} - ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Henüz fotoğraf eklenmemiş</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Müşteri Yorumları</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Yorum sistemi yakında eklenecek...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Yan Panel - İletişim ve Hızlı İşlemler */}
          <div className="space-y-6">
            {/* İletişim Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle>İletişim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.phone && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={callBusiness}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {business.phone}
                  </Button>
                )}

                {business.phone && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-green-600 border-green-600 hover:bg-green-50"
                    onClick={sendWhatsApp}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Mesajı
                  </Button>
                )}

                {business.email && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.location.href = `mailto:${business.email}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    E-posta Gönder
                  </Button>
                )}

                {business.website && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(business.website, '_blank')}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={openMap}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Haritada Göster
                </Button>
              </CardContent>
            </Card>

            {/* Sosyal Medya */}
            {business.website && (
              <Card>
                <CardHeader>
                  <CardTitle>Web & Sosyal Medya</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-500 text-sm">
                    Sosyal medya linkleri yakında eklenecek...
                  </p>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BusinessDetail;