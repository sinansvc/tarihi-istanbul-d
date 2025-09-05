
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Phone, Instagram, Facebook, Globe, Image } from 'lucide-react';

const FeaturedBusinesses = () => {
  const businesses = [
    {
      id: 1,
      name: "Altın Kuyumcu",
      nameEn: "Golden Jewelry",
      category: "Bijuteri & Takı",
      location: "Kapalıçarşı - 125. Dükkân",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80"
      ],
      isOpen: true,
      workingHours: "Pazartesi-Cumartesi 09:00-19:00",
      phone: "+90 212 555 0123",
      instagram: "@altinkuyumcu",
      facebook: "altinkuyumcu",
      website: "https://altinkuyumcu.com",
      description: "Geleneksel el işçiliği ile modern tasarımı buluşturan bijuteri uzmanı"
    },
    {
      id: 2,
      name: "Baharat Dünyası",
      nameEn: "Spice World",
      category: "Mutfak Ürünleri",
      location: "Mısır Çarşısı - 45. Dükkân",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80"
      ],
      isOpen: true,
      workingHours: "Her gün 08:00-20:00",
      phone: "+90 212 555 0456",
      instagram: "@baharatdunyasi",
      website: "https://baharatdunyasi.com",
      description: "150 yıllık deneyim ile en kaliteli baharatlar ve çaylar"
    },
    {
      id: 3,
      name: "Seramik Sanatı",
      nameEn: "Ceramic Art",
      category: "Bakır Ürünleri",
      location: "Mahmutpaşa - 78. Dükkân",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80",
      isOpen: false,
      description: "Geleneksel Türk seramik sanatının ustası"
    },
    {
      id: 4,
      name: "Moda Tekstil",
      nameEn: "Fashion Textile",
      category: "Giyim",
      location: "Laleli - 234. Dükkân",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80",
      isOpen: true,
      description: "Kaliteli kumaş ve modern tasarım anlayışı"
    },
    {
      id: 5,
      name: "Deri Ustası",
      nameEn: "Leather Master",
      category: "Deri Ürünleri",
      location: "Eminönü - 156. Dükkân",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
      isOpen: true,
      description: "El yapımı deri ürünlerinde 80 yıllık tecrübe"
    },
    {
      id: 6,
      name: "Halı Sarayı",
      nameEn: "Carpet Palace",
      category: "Halı & Kilim",
      location: "Kapalıçarşı - 67. Dükkân",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
      isOpen: true,
      description: "Anadolu'nun en değerli halı ve kilim koleksiyonu"
    }
  ];

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
          {businesses.map((business) => (
            <Card 
              key={business.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="relative">
                <img 
                  src={business.image}
                  alt={business.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={business.isOpen ? "default" : "secondary"}
                    className={business.isOpen ? "bg-green-500" : "bg-gray-500"}
                  >
                    {business.isOpen ? "Açık" : "Kapalı"}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="bg-white">
                    {business.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-amber-600 transition-colors">
                      {business.name}
                    </h3>
                    <p className="text-sm text-gray-500">{business.nameEn}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{business.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{business.location}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {business.description}
                </p>

                {/* Çalışma Saatleri */}
                {business.workingHours && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-xs">{business.workingHours}</span>
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
                    {business.instagram && (
                      <Button variant="ghost" size="icon" className="w-6 h-6">
                        <Instagram className="w-3 h-3" />
                      </Button>
                    )}
                    {business.facebook && (
                      <Button variant="ghost" size="icon" className="w-6 h-6">
                        <Facebook className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Galeri göstergesi */}
                  {business.gallery && business.gallery.length > 1 && (
                    <div className="flex items-center text-gray-500">
                      <Image className="w-3 h-3 mr-1" />
                      <span className="text-xs">+{business.gallery.length - 1}</span>
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
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
            Tüm İşletmeleri Görüntüle
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
