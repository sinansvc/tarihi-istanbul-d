
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Heart, Store } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profilim</h1>
          <p className="text-gray-600">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kullanıcı Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Kullanıcı Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Kayıt Tarihi:</span>
                <span className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="w-full"
                >
                  Çıkış Yap
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hızlı İşlemler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="w-5 h-5 mr-2" />
                Hızlı İşlemler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={() => navigate('/add-business')}
              >
                <Store className="w-4 h-4 mr-2" />
                İşletme Ekle
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/favorites')}
              >
                <Heart className="w-4 h-4 mr-2" />
                Favorilerim
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/businesses')}
              >
                Tüm İşletmeleri Görüntüle
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* İstatistikler */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hesap İstatistikleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">0</div>
                <div className="text-sm text-gray-600">Favori İşletme</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600">Eklenen İşletme</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">0</div>
                <div className="text-sm text-gray-600">Görüntülenme</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
