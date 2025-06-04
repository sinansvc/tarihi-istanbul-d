
import React from 'react';
import { MapPin, Search } from 'lucide-react';

const Footer = () => {
  const bazaars = [
    "Kapalıçarşı",
    "Mısır Çarşısı", 
    "Laleli",
    "Mahmutpaşa",
    "Eminönü",
    "Tahtakale"
  ];

  const categories = [
    "Bijuteri & Takı",
    "Kırtasiye",
    "Bakır Ürünleri",
    "Mutfak Ürünleri",
    "Giyim",
    "Deri Ürünleri"
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-amber-400">İstanbul</span>
              <span className="text-orange-400">Çarşı</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              İstanbul'un tarihi ticaret merkezlerini dijital dünyaya taşıyarak, 
              geleneksel ticaretin modern yüzünü oluşturuyoruz.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-700 transition-colors">
                <span className="text-white font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-700 transition-colors">
                <span className="text-white font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-700 transition-colors">
                <span className="text-white font-bold">i</span>
              </div>
            </div>
          </div>

          {/* Bazaars */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Çarşılarımız</h3>
            <ul className="space-y-2">
              {bazaars.map((bazaar, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-amber-400 transition-colors flex items-center"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {bazaar}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Kategoriler</h3>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-amber-400 transition-colors flex items-center"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">İletişim & Destek</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  İşletme Kaydı
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Müşteri Hizmetleri
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Yardım Merkezi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Gizlilik Politikası
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Kullanım Koşulları
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 İstanbul Çarşı. Tüm hakları saklıdır.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Türkçe | English | العربية | Русский</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
