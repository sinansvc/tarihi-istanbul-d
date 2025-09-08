import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Şifre sıfırlama token'ını kontrol et
  useEffect(() => {
    const handlePasswordReset = async () => {
      // URL fragment'inden (#) parametreleri al
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      
      // URL search parametrelerinden de kontrol et
      const searchAccessToken = searchParams.get('access_token');
      const searchRefreshToken = searchParams.get('refresh_token');
      const searchType = searchParams.get('type');
      
      console.log('Hash parametreleri:', { accessToken, refreshToken, type });
      console.log('Search parametreleri:', { searchAccessToken, searchRefreshToken, searchType });
      
      const finalAccessToken = accessToken || searchAccessToken;
      const finalRefreshToken = refreshToken || searchRefreshToken;
      const finalType = type || searchType;
      
      // Recovery link mi kontrol et
      if (finalType === 'recovery' && finalAccessToken && finalRefreshToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: finalAccessToken,
            refresh_token: finalRefreshToken
          });
          
          if (error) {
            console.error('Session set error:', error);
            toast.error('Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş');
            navigate('/auth');
          } else {
            console.log('Session başarıyla ayarlandı');
          }
        } catch (error) {
          console.error('Token set error:', error);
          toast.error('Bir hata oluştu');
          navigate('/auth');
        }
      } else if (!finalAccessToken && !finalRefreshToken && !finalType) {
        // URL parametresi yoksa auth sayfasına yönlendir
        toast.error('Geçersiz şifre sıfırlama bağlantısı');
        navigate('/auth');
      }
    };

    handlePasswordReset();
  }, [searchParams, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.');
      navigate('/auth');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-amber-700">
            İstanbul<span className="text-orange-600">Çarşı</span>
          </CardTitle>
          <CardDescription>
            Yeni şifrenizi belirleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Yeni Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Yeni Şifre (Tekrar)"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;