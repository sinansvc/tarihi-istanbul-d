
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Clock, CheckCircle } from 'lucide-react';

const AdminStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersResult, businessesResult, pendingResult, activeResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('businesses').select('id', { count: 'exact' }),
        supabase.from('businesses').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('businesses').select('id', { count: 'exact' }).eq('status', 'active')
      ]);

      return {
        totalUsers: usersResult.count || 0,
        totalBusinesses: businessesResult.count || 0,
        pendingBusinesses: pendingResult.count || 0,
        activeBusinesses: activeResult.count || 0
      };
    },
  });

  const statCards = [
    {
      title: 'Toplam Kullanıcı',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Toplam İşletme',
      value: stats?.totalBusinesses || 0,
      icon: Store,
      color: 'text-green-600'
    },
    {
      title: 'Onay Bekleyen',
      value: stats?.pendingBusinesses || 0,
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Aktif İşletme',
      value: stats?.activeBusinesses || 0,
      icon: CheckCircle,
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <IconComponent className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;
