
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const QuickCategories = () => {
  const navigate = useNavigate();

  const { data: categories, isLoading } = useQuery({
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

  const { data: businessCounts } = useQuery({
    queryKey: ['business-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('category_id')
        .eq('status', 'active');
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data.forEach(business => {
        if (business.category_id) {
          counts[business.category_id] = (counts[business.category_id] || 0) + 1;
        }
      });
      return counts;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
          {categories?.map((category) => (
            <Card 
              key={category.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => navigate(`/businesses?category=${category.id}`)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color || 'from-amber-400 to-orange-500'} flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon || '🏪'}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                  {category.name_tr}
                </h3>
                <p className="text-sm text-gray-500">
                  {businessCounts?.[category.id] || 0} İşletme
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
