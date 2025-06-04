
import React from 'react';

const Statistics = () => {
  const stats = [
    {
      number: "4,500+",
      label: "Kayıtlı İşletme",
      description: "Çarşılarımızda faaliyet gösteren işletme sayısı"
    },
    {
      number: "25+",
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
          {stats.map((stat, index) => (
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
