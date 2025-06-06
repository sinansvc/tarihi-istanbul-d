
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Store, User, LogOut, Plus, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();

  // Kullanıcının admin olup olmadığını kontrol et
  const { data: isAdmin } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      
      if (error) return false;
      return !!data;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-amber-600" />
              <span className="text-xl font-bold text-gray-900">İstanbul Çarşı</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/businesses">
              <Button variant="ghost">İşletmeler</Button>
            </Link>
            
            {user ? (
              <>
                <Link to="/add-business">
                  <Button variant="ghost" className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    İşletme Ekle
                  </Button>
                </Link>
                
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" className="flex items-center text-red-600 hover:text-red-700">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                
                <Link to="/profile">
                  <Button variant="ghost" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Çıkış
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>Giriş Yap</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
