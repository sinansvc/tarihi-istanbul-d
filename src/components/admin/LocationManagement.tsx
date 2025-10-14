import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';

const LocationManagement = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [formData, setFormData] = useState({
    name_tr: '',
    name_en: '',
    description_tr: '',
    description_en: '',
    image_url: ''
  });

  const { data: locations, isLoading } = useQuery({
    queryKey: ['admin-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name_tr');
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('locations')
        .insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      toast.success('Lokasyon başarıyla eklendi');
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Lokasyon eklenirken hata oluştu');
      console.error('Error adding location:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('locations')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      toast.success('Lokasyon başarıyla güncellendi');
      setEditingLocation(null);
      resetForm();
    },
    onError: (error) => {
      toast.error('Lokasyon güncellenirken hata oluştu');
      console.error('Error updating location:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      toast.success('Lokasyon başarıyla silindi');
    },
    onError: (error) => {
      toast.error('Lokasyon silinirken hata oluştu');
      console.error('Error deleting location:', error);
    },
  });

  const resetForm = () => {
    setFormData({
      name_tr: '',
      name_en: '',
      description_tr: '',
      description_en: '',
      image_url: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_tr) {
      toast.error('Türkçe lokasyon adı gereklidir');
      return;
    }

    if (editingLocation) {
      updateMutation.mutate({ id: editingLocation.id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setFormData({
      name_tr: location.name_tr || '',
      name_en: location.name_en || '',
      description_tr: location.description_tr || '',
      description_en: location.description_en || '',
      image_url: location.image_url || ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu lokasyonu silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Lokasyon Yönetimi
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Lokasyon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yeni Lokasyon Ekle</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name_tr">Lokasyon Adı (Türkçe) *</Label>
                  <Input
                    id="name_tr"
                    value={formData.name_tr}
                    onChange={(e) => setFormData({ ...formData, name_tr: e.target.value })}
                    placeholder="Örn: Kapalıçarşı"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_en">Lokasyon Adı (İngilizce)</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="e.g: Grand Bazaar"
                  />
                </div>
                <div>
                  <Label htmlFor="description_tr">Açıklama (Türkçe)</Label>
                  <Textarea
                    id="description_tr"
                    value={formData.description_tr}
                    onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                    placeholder="Lokasyon açıklaması..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="description_en">Açıklama (İngilizce)</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    placeholder="Location description..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Görsel URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit">Ekle</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Türkçe Ad</TableHead>
                <TableHead>İngilizce Ad</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations?.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.name_tr}</TableCell>
                  <TableCell>{location.name_en || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{location.description_tr || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={editingLocation?.id === location.id} onOpenChange={(open) => !open && setEditingLocation(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(location)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Lokasyon Düzenle</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="edit_name_tr">Lokasyon Adı (Türkçe) *</Label>
                              <Input
                                id="edit_name_tr"
                                value={formData.name_tr}
                                onChange={(e) => setFormData({ ...formData, name_tr: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_name_en">Lokasyon Adı (İngilizce)</Label>
                              <Input
                                id="edit_name_en"
                                value={formData.name_en}
                                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_description_tr">Açıklama (Türkçe)</Label>
                              <Textarea
                                id="edit_description_tr"
                                value={formData.description_tr}
                                onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_description_en">Açıklama (İngilizce)</Label>
                              <Textarea
                                id="edit_description_en"
                                value={formData.description_en}
                                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_image_url">Görsel URL</Label>
                              <Input
                                id="edit_image_url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                              <Button type="button" variant="outline" onClick={() => setEditingLocation(null)}>
                                İptal
                              </Button>
                              <Button type="submit">Güncelle</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(location.id)}
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
  );
};

export default LocationManagement;
