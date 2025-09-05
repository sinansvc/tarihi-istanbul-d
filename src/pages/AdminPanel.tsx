
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Settings, BarChart3, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserManagement from '@/components/admin/UserManagement';
import BusinessApproval from '@/components/admin/BusinessApproval';
import AdminStats from '@/components/admin/AdminStats';
import AdminLogs from '@/components/admin/AdminLogs';
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="stats" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              İstatistikler
            </TabsTrigger>
            <TabsTrigger value="businesses" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              İşletme Onayları
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Kullanıcılar
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Loglar
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

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="logs">
            <AdminLogs />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Sistem Ayarları</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Sistem ayarları yakında eklenecek...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
