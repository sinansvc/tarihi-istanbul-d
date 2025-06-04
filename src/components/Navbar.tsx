
import React, { useState } from 'react';
import { Search, MapPin, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('TR');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/businesses?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="text-2xl font-bold text-amber-700">
              <span className="text-amber-600">İstanbul</span>
              <span className="text-orange-600">Çarşı</span>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="İşletme, ürün veya kategori arayın..."
                className="pl-10 pr-4 py-2 w-full border-amber-200 focus:border-amber-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-amber-600"
              onClick={() => navigate('/businesses')}
            >
              İşletmeler
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-amber-600">
              Çarşılar
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-amber-600">
              Hakkımızda
            </Button>
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Hesabım</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profilim
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Giriş Yap
              </Button>
            )}
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Button 
                variant={language === 'TR' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('TR')}
                className="w-8 h-8 p-0"
              >
                TR
              </Button>
              <Button 
                variant={language === 'EN' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('EN')}
                className="w-8 h-8 p-0"
              >
                EN
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Arama yapın..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/businesses')}>
                İşletmeler
              </Button>
              <Button variant="ghost" className="w-full justify-start">Çarşılar</Button>
              <Button variant="ghost" className="w-full justify-start">Hakkımızda</Button>
              {user ? (
                <>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/profile')}>
                    Profilim
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                    Çıkış Yap
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={() => navigate('/auth')}
                >
                  Giriş Yap
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
