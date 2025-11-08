import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const BlogManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [formData, setFormData] = useState({
    title_tr: '',
    title_en: '',
    content_tr: '',
    content_en: '',
    meta_description_tr: '',
    meta_description_en: '',
    slug: '',
    is_active: true
  });

  const { data: pages, isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setFormData({
      title_tr: '',
      title_en: '',
      content_tr: '',
      content_en: '',
      meta_description_tr: '',
      meta_description_en: '',
      slug: '',
      is_active: true
    });
    setEditingPage(null);
  };

  const openEditDialog = (page: any) => {
    setEditingPage(page);
    setFormData({
      title_tr: page.title_tr,
      title_en: page.title_en || '',
      content_tr: page.content_tr,
      content_en: page.content_en || '',
      meta_description_tr: page.meta_description_tr || '',
      meta_description_en: page.meta_description_en || '',
      slug: page.slug,
      is_active: page.is_active
    });
    setIsDialogOpen(true);
  };

  const savePage = async () => {
    if (!formData.title_tr || !formData.content_tr || !formData.slug) {
      toast.error('Lütfen zorunlu alanları doldurun (Türkçe başlık, içerik ve slug)');
      return;
    }

    try {
      if (editingPage) {
        const { error } = await supabase
          .from('page_contents')
          .update(formData)
          .eq('id', editingPage.id);

        if (error) throw error;
        toast.success('Sayfa güncellendi!');
      } else {
        const { error } = await supabase
          .from('page_contents')
          .insert([formData]);

        if (error) throw error;
        toast.success('Sayfa oluşturuldu!');
      }

      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Sayfa kaydedilirken hata oluştu');
    }
  };

  const deletePage = async (pageId: string) => {
    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('page_contents')
        .delete()
        .eq('id', pageId);

      if (error) throw error;

      toast.success('Sayfa silindi!');
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Sayfa silinirken hata oluştu');
    }
  };

  const togglePageStatus = async (pageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('page_contents')
        .update({ is_active: !currentStatus })
        .eq('id', pageId);

      if (error) throw error;

      toast.success(!currentStatus ? 'Sayfa yayınlandı!' : 'Sayfa yayından kaldırıldı!');
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
    } catch (error) {
      console.error('Error toggling page status:', error);
      toast.error('İşlem sırasında hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Blog & SEO Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Blog & SEO Yönetimi
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Sayfa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPage ? 'Sayfa Düzenle' : 'Yeni Sayfa Oluştur'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title_tr">Başlık (Türkçe) *</Label>
                      <Input
                        id="title_tr"
                        value={formData.title_tr}
                        onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                        placeholder="Örn: Hakkımızda"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title_en">Başlık (İngilizce)</Label>
                      <Input
                        id="title_en"
                        value={formData.title_en}
                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                        placeholder="Ex: About Us"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="hakkimizda"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Sayfa URL'i: /page/{formData.slug || 'slug'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="content_tr">İçerik (Türkçe) *</Label>
                    <Textarea
                      id="content_tr"
                      value={formData.content_tr}
                      onChange={(e) => setFormData({ ...formData, content_tr: e.target.value })}
                      placeholder="Sayfa içeriği..."
                      rows={8}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content_en">İçerik (İngilizce)</Label>
                    <Textarea
                      id="content_en"
                      value={formData.content_en}
                      onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                      placeholder="Page content..."
                      rows={8}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="meta_tr">Meta Açıklama (TR)</Label>
                      <Textarea
                        id="meta_tr"
                        value={formData.meta_description_tr}
                        onChange={(e) => setFormData({ ...formData, meta_description_tr: e.target.value })}
                        placeholder="SEO için sayfa açıklaması (max 160 karakter)"
                        rows={3}
                        maxLength={160}
                      />
                    </div>
                    <div>
                      <Label htmlFor="meta_en">Meta Açıklama (EN)</Label>
                      <Textarea
                        id="meta_en"
                        value={formData.meta_description_en}
                        onChange={(e) => setFormData({ ...formData, meta_description_en: e.target.value })}
                        placeholder="SEO page description (max 160 chars)"
                        rows={3}
                        maxLength={160}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Sayfa aktif</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      İptal
                    </Button>
                    <Button onClick={savePage}>
                      {editingPage ? 'Güncelle' : 'Oluştur'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          {!pages || pages.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz sayfa bulunmuyor</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlık</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Oluşturulma</TableHead>
                  <TableHead>Görünürlük</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <div className="font-medium">{page.title_tr}</div>
                      {page.title_en && (
                        <div className="text-sm text-muted-foreground">{page.title_en}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        /page/{page.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={page.is_active ? 'default' : 'secondary'}>
                        {page.is_active ? 'Yayında' : 'Taslak'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(page.created_at).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={page.is_active}
                        onCheckedChange={() => togglePageStatus(page.id, page.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/page/${page.slug}`, '_blank')}
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(page)}
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deletePage(page.id)}
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;
