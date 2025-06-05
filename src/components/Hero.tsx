
import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            İstanbul'un <span className="text-yellow-300">Kalbi</span>
            <br />
            <span className="text-3xl md:text-5xl">Çarşılar ve İşletmeler</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-100">
            Kapalıçarşı'dan Eminönü'ne, tüm çarşıları keşfedin
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="İşletme, ürün veya kategori arayın..."
                className="pl-12 pr-4 py-3 text-lg bg-white text-gray-900 border-0 rounded-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-3 text-lg font-semibold rounded-full"
              onClick={() => navigate('/businesses')}
            >
              <MapPin className="w-5 h-5 mr-2" />
              İşletmeleri Keşfet
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 text-lg font-semibold rounded-full"
              onClick={() => navigate('/add-business')}
            >
              İşletmenizi Ekleyin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
