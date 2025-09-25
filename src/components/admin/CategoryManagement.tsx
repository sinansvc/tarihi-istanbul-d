import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Tag, Palette, Hash } from 'lucide-react';

interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  icon: string;
  color: string;
  created_at: string;
}

const CategoryManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name_tr: '',
    name_en: '',
    icon: '',
    color: ''
  });

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_tr');
      
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch business counts per category
  const { data: businessCounts } = useQuery({
    queryKey: ['category-business-counts'],
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

  // Create/update category mutation
  const saveCategoryMutation = useMutation({
    mutationFn: async (categoryData: typeof formData) => {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(categoryData);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // For the public categories query
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingCategory ? 'Kategori güncellendi' : 'Kategori eklendi');
    },
    onError: (error) => {
      console.error('Error saving category:', error);
      toast.error('Kategori kaydedilirken hata oluştu');
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      // Check if category has businesses
      const count = businessCounts?.[categoryId] || 0;
      if (count > 0) {
        throw new Error(`Bu kategoride ${count} işletme bulunuyor. Önce işletmeleri başka kategorilere taşıyın.`);
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategori silindi');
    },
    onError: (error: any) => {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Kategori silinirken hata oluştu');
    }
  });

  const resetForm = () => {
    setFormData({
      name_tr: '',
      name_en: '',
      icon: '',
      color: ''
    });
    setEditingCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_tr: category.name_tr,
      name_en: category.name_en,
      icon: category.icon || '',
      color: category.color || ''
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_tr.trim() || !formData.name_en.trim()) {
      toast.error('Türkçe ve İngilizce kategori adları zorunludur');
      return;
    }
    saveCategoryMutation.mutate(formData);
  };

  // Predefined color options
  const colorOptions = [
    'from-amber-400 to-orange-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-red-400 to-red-600',
    'from-indigo-400 to-indigo-600',
    'from-pink-400 to-pink-600',
    'from-teal-400 to-teal-600',
    'from-yellow-400 to-yellow-600',
    'from-cyan-400 to-cyan-600'
  ];

  // Common icons
  const iconOptions = [
    '💎', '🍯', '🧿', '🏺', '🥿', '👗', '🎨', '📿', 
    '⚱️', '🕌', '🌟', '💍', '🎭', '🍃', '🌙', '⭐'
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Kategori Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Kategoriler yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Kategori Yönetimi
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Kategori
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name_tr">Kategori Adı (Türkçe) *</Label>
                  <Input
                    id="name_tr"
                    value={formData.name_tr}
                    onChange={(e) => setFormData({ ...formData, name_tr: e.target.value })}
                    placeholder="örn: Bijuteri & Takı"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="name_en">Kategori Adı (İngilizce) *</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="e.g: Jewelry & Accessories"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="icon">İkon</Label>
                  <div className="mb-2">
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="Emoji veya karakter seçin"
                    />
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {iconOptions.map(icon => (
                      <Button
                        key={icon}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setFormData({ ...formData, icon })}
                      >
                        {icon}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="color">Renk Gradyanı</Label>
                  <div className="mb-2">
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="örn: from-amber-400 to-orange-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {colorOptions.map(color => (
                      <Button
                        key={color}
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`h-8 bg-gradient-to-r ${color}`}
                        onClick={() => setFormData({ ...formData, color })}
                      >
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={saveCategoryMutation.isPending}
                    className="flex-1"
                  >
                    {editingCategory ? 'Güncelle' : 'Ekle'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    İptal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Henüz kategori yok</p>
            </div>
          ) : (
            categories?.map((category) => (
              <div key={category.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color || 'from-gray-400 to-gray-600'} flex items-center justify-center text-xl`}>
                  {category.icon || '📁'}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{category.name_tr}</h4>
                    <span className="text-sm text-gray-500">({category.name_en})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">
                      <Hash className="w-3 h-3 mr-1" />
                      {businessCounts?.[category.id] || 0} İşletme
                    </Badge>
                    {category.color && (
                      <Badge variant="outline">
                        <Palette className="w-3 h-3 mr-1" />
                        {category.color}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(category)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCategoryMutation.mutate(category.id)}
                    disabled={deleteCategoryMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;