
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const slides = [
    {
      title: "Kapalıçarşı'nın Zarafeti",
      subtitle: "500 yıllık ticaret geleneğini keşfedin",
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Mısır Çarşısı'nın Renkleri", 
      subtitle: "Baharat kokularının dansı, lezzetin adresi",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Laleli'nin Modern Dokunuşu",
      subtitle: "Geleneksel ticaretin modern yüzü",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1920&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-amber-300">İstanbul</span>
            <br />
            <span className="text-orange-300">Tarihi Çarşıları</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            {slides[currentSlide].subtitle}
          </p>
          
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center animate-fade-in">
            <Button 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
              onClick={() => navigate('/businesses')}
            >
              Çarşıları Keşfedin
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-amber-700 px-8 py-3 text-lg"
              onClick={() => navigate('/auth')}
            >
              İşletmenizi Ekleyin
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-amber-400 scale-125' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8 z-20 animate-bounce">
        <ArrowDown className="text-white w-8 h-8" />
      </div>
    </section>
  );
};

export default Hero;
