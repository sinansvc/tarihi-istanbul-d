
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Settings, BarChart3, FileText, Star, Tag, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserManagement from '@/components/admin/UserManagement';
import BusinessApproval from '@/components/admin/BusinessApproval';
import AdminStats from '@/components/admin/AdminStats';
import AdminLogs from '@/components/admin/AdminLogs';
import FeaturedBusinessManagement from '@/components/admin/FeaturedBusinessManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import LocationManagement from '@/components/admin/LocationManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import PageContentManagement from '@/components/admin/PageContentManagement';
import { SecurityDashboard } from '@/components/admin/SecurityDashboard';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Kullanıcının admin olup olmadığını kontrol et
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_roles' as any)
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      
      if (error) {
        console.log('Role check error:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user,
  });

  React.useEffect(() => {
    if (!isLoading) {
      setLoading(false);
      if (!user) {
        navigate('/auth');
      } else if (isAdmin === false) {
        navigate('/');
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Yetki kontrol ediliyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-amber-600" />
            Admin Paneli
          </h1>
          <p className="text-gray-600">Sistem yönetimi ve moderasyon araçları</p>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10 overflow-x-auto">
            <TabsTrigger value="stats" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              İstatistikler
            </TabsTrigger>
            <TabsTrigger value="businesses" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Kayıtlı İşletmeler
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Öne Çıkanlar
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Kategoriler
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Lokasyonlar
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Kullanıcılar
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Güvenlik
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Loglar
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Sayfalar
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Ayarlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>

          <TabsContent value="businesses">
            <BusinessApproval />
          </TabsContent>

          <TabsContent value="featured">
            <FeaturedBusinessManagement />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="locations">
            <LocationManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="logs">
            <AdminLogs />
          </TabsContent>

          <TabsContent value="pages">
            <PageContentManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
