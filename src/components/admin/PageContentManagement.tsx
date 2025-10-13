import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { FileText, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PageContent {
  id: string;
  slug: string;
  title_tr: string;
  title_en: string | null;
  content_tr: string;
  content_en: string | null;
  meta_description_tr: string | null;
  meta_description_en: string | null;
  is_active: boolean;
}

const PageContentManagement = () => {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);

  const { data: pages, isLoading } = useQuery({
    queryKey: ['page-contents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .order('title_tr');
      
      if (error) throw error;
      return data as PageContent[];
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: async (page: PageContent) => {
      const { error } = await supabase
        .from('page_contents')
        .update({
          title_tr: page.title_tr,
          title_en: page.title_en,
          content_tr: page.content_tr,
          content_en: page.content_en,
          meta_description_tr: page.meta_description_tr,
          meta_description_en: page.meta_description_en,
          is_active: page.is_active,
        })
        .eq('id', page.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-contents'] });
      toast.success('Sayfa içeriği güncellendi');
    },
    onError: (error) => {
      console.error('Error updating page:', error);
      toast.error('Sayfa güncellenirken hata oluştu');
    }
  });

  const handleSave = () => {
    if (selectedPage) {
      updatePageMutation.mutate(selectedPage);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Sayfalar yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Sayfa İçerik Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Düzenlenecek Sayfayı Seçin</Label>
            <Select
              value={selectedPage?.id || ''}
              onValueChange={(value) => {
                const page = pages?.find(p => p.id === value);
                setSelectedPage(page || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Bir sayfa seçin" />
              </SelectTrigger>
              <SelectContent>
                {pages?.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.title_tr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPage && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Sayfa Durumu</p>
                  <p className="text-xs text-muted-foreground">
                    Slug: {selectedPage.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={selectedPage.is_active}
                    onCheckedChange={(checked) => 
                      setSelectedPage({ ...selectedPage, is_active: checked })
                    }
                  />
                  <Label>Aktif</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Başlık (Türkçe)</Label>
                  <Input
                    value={selectedPage.title_tr}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, title_tr: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Başlık (İngilizce)</Label>
                  <Input
                    value={selectedPage.title_en || ''}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, title_en: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Meta Açıklama (Türkçe)</Label>
                  <Input
                    value={selectedPage.meta_description_tr || ''}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, meta_description_tr: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Meta Açıklama (İngilizce)</Label>
                  <Input
                    value={selectedPage.meta_description_en || ''}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, meta_description_en: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>İçerik (Türkçe)</Label>
                <Textarea
                  rows={10}
                  value={selectedPage.content_tr}
                  onChange={(e) =>
                    setSelectedPage({ ...selectedPage, content_tr: e.target.value })
                  }
                  placeholder="Sayfa içeriğini buraya yazın..."
                />
              </div>

              <div>
                <Label>İçerik (İngilizce)</Label>
                <Textarea
                  rows={10}
                  value={selectedPage.content_en || ''}
                  onChange={(e) =>
                    setSelectedPage({ ...selectedPage, content_en: e.target.value })
                  }
                  placeholder="Page content here..."
                />
              </div>

              <Button 
                onClick={handleSave}
                disabled={updatePageMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updatePageMutation.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PageContentManagement;