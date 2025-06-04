
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const QuickCategories = () => {
  const categories = [
    {
      name: "Bijuteri & Takı",
      icon: "💎",
      color: "from-amber-400 to-yellow-500",
      count: "1,245"
    },
    {
      name: "Kırtasiye",
      icon: "✏️",
      color: "from-blue-400 to-blue-600", 
      count: "892"
    },
    {
      name: "Bakır Ürünleri",
      icon: "🏺",
      color: "from-orange-400 to-red-500",
      count: "567"
    },
    {
      name: "Mutfak Ürünleri",
      icon: "🍳",
      color: "from-green-400 to-emerald-500",
      count: "1,123"
    },
    {
      name: "Giyim",
      icon: "👕",
      color: "from-purple-400 to-pink-500",
      count: "2,456"
    },
    {
      name: "Deri Ürünleri",
      icon: "👜",
      color: "from-amber-600 to-orange-600",
      count: "789"
    },
    {
      name: "Halı & Kilim",
      icon: "🎨",
      color: "from-red-400 to-rose-500",
      count: "434"
    },
    {
      name: "Antika & Hediyelik",
      icon: "🏛️",
      color: "from-indigo-400 to-purple-500",
      count: "612"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Kategorileri Keşfedin
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            İstanbul'un tarihi çarşılarında yüzyıllardır süregelen ticaret geleneğini yaşayın
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.count} İşletme
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickCategories;
