
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Clock, CheckCircle, TrendingUp, Calendar, Eye, UserPlus, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersResult, businessesResult, pendingResult, activeResult] = await Promise.all([
        supabase.from('profiles').select('id, created_at', { count: 'exact' }),
        supabase.from('businesses').select('id, created_at', { count: 'exact' }),
        supabase.from('businesses').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('businesses').select('id', { count: 'exact' }).eq('status', 'active')
      ]);

      // Son 7 gün için günlük kayıt istatistikleri
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const dailyUserStats = last7Days.map(date => {
        const count = usersResult.data?.filter(user => 
          user.created_at?.startsWith(date)
        ).length || 0;
        return {
          date: new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
          users: count
        };
      });

      const dailyBusinessStats = last7Days.map(date => {
        const count = businessesResult.data?.filter(business => 
          business.created_at?.startsWith(date)
        ).length || 0;
        return {
          date: new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
          businesses: count
        };
      });

      // Kategori dağılımı - gerçek verilerden al
      const categoriesResult = await supabase
        .from('businesses')
        .select('category_id, categories(name_tr)')
        .eq('status', 'active');

      const categoryCount: Record<string, number> = {};
      categoriesResult.data?.forEach((business: any) => {
        const categoryName = business.categories?.name_tr || 'Diğer';
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      });

      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#a4de6c', '#ffa07a'];
      const categoryStats = Object.entries(categoryCount).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));

      // Yorum ve görüntülenme istatistikleri
      const reviewsResult = await supabase.from('reviews').select('id', { count: 'exact' });
      const totalReviews = reviewsResult.count || 0;

      return {
        totalUsers: usersResult.count || 0,
        totalBusinesses: businessesResult.count || 0,
        pendingBusinesses: pendingResult.count || 0,
        activeBusinesses: activeResult.count || 0,
        totalReviews,
        dailyUserStats,
        dailyBusinessStats,
        categoryStats,
        // Günlük artış hesaplaması
        userGrowth: dailyUserStats.slice(-2).reduce((acc, curr, index, arr) => 
          index === 0 ? 0 : curr.users - arr[index - 1].users, 0
        ),
        businessGrowth: dailyBusinessStats.slice(-2).reduce((acc, curr, index, arr) => 
          index === 0 ? 0 : curr.businesses - arr[index - 1].businesses, 0
        )
      };
    },
  });

  const statCards = [
    {
      title: 'Toplam Kullanıcı',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      growth: stats?.userGrowth || 0,
      description: 'Kayıtlı kullanıcılar'
    },
    {
      title: 'Toplam İşletme',
      value: stats?.totalBusinesses || 0,
      icon: Store,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      growth: stats?.businessGrowth || 0,
      description: 'Kayıtlı işletmeler'
    },
    {
      title: 'Toplam Yorum',
      value: stats?.totalReviews || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      growth: 0,
      description: 'Müşteri yorumları'
    },
    {
      title: 'Onay Bekleyen',
      value: stats?.pendingBusinesses || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      growth: 0,
      description: 'Onay gerekli'
    },
    {
      title: 'Aktif İşletme',
      value: stats?.activeBusinesses || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      growth: 0,
      description: 'Yayında olanlar'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ana İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {stat.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                      {stat.growth !== 0 && (
                        <div className={`flex items-center text-sm ${
                          stat.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className={`w-3 h-3 mr-1 ${stat.growth < 0 ? 'rotate-180' : ''}`} />
                          {Math.abs(stat.growth)}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kullanıcı Kayıt Trendi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Kullanıcı Kayıt Trendi (Son 7 Gün)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats?.dailyUserStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* İşletme Kayıt Trendi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="w-5 h-5 mr-2" />
              İşletme Kayıt Trendi (Son 7 Gün)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.dailyBusinessStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="businesses" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Kategori Dağılımı */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            İşletme Kategori Dağılımı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats?.categoryStats || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} %${(percent * 100).toFixed(0)}`}
                >
                  {stats?.categoryStats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              <h4 className="font-medium">Kategori Detayları</h4>
              {stats?.categoryStats?.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-lg font-bold">{category.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
