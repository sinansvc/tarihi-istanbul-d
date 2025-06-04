
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Statistics = () => {
  const { data: stats } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      // Get business count
      const { count: businessCount } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get category count
      const { count: categoryCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      // Get location count
      const { count: locationCount } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true });

      return {
        businesses: businessCount || 0,
        categories: categoryCount || 0,
        locations: locationCount || 0,
      };
    },
  });

  const displayStats = [
    {
      number: `${stats?.businesses || 0}+`,
      label: "Kayıtlı İşletme",
      description: "Çarşılarımızda faaliyet gösteren işletme sayısı"
    },
    {
      number: `${stats?.categories || 0}+`,
      label: "Farklı Kategori",
      description: "Bijuteriden halıya, baharattan deri ürünlerine"
    },
    {
      number: "500+",
      label: "Yıllık Deneyim",
      description: "Yüzyıllar boyu süregelen ticaret geleneği"
    },
    {
      number: "50+",
      label: "Ülkeden Ziyaretçi",
      description: "Dünyadan gelen müşterilerimize hizmet"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-amber-600 to-orange-600">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Rakamlarla İstanbul Çarşıları
          </h2>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            Tarihi ticaret merkezlerimizin büyüklüğü ve çeşitliliği
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-20">
                <div className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-amber-100 mb-2">
                  {stat.label}
                </div>
                <div className="text-amber-200 text-sm leading-relaxed">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
