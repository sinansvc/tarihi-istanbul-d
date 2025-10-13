import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Plus, X, Star, Building2 } from 'lucide-react';

interface FeaturedBusiness {
  id: string;
  business_id: string;
  sort_order: number;
  is_active: boolean;
  featured_until: string | null;
  businesses: {
    id: string;
    name_tr: string;
    name_en: string | null;
    status: string;
    categories: {
      name_tr: string;
    } | null;
    locations: {
      name_tr: string;
    } | null;
  };
}

const FeaturedBusinessManagement = () => {
  const queryClient = useQueryClient();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');

  // Fetch featured businesses
  const { data: featuredBusinesses, isLoading } = useQuery({
    queryKey: ['featured-businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_businesses')
        .select(`
          *,
          businesses:business_id (
            id,
            name_tr,
            name_en,
            status,
            categories (name_tr),
            locations (name_tr)
          )
        `)
        .order('sort_order');
      
      if (error) throw error;
      return data as FeaturedBusiness[];
    },
  });

  // Fetch available businesses for selection
  const { data: availableBusinesses } = useQuery({
    queryKey: ['available-businesses'],
    queryFn: async () => {
      const featuredIds = featuredBusinesses?.map(fb => fb.business_id) || [];
      
      let query = supabase
        .from('businesses')
        .select(`
          id,
          name_tr,
          name_en,
          status,
          categories (name_tr),
          locations (name_tr)
        `)
        .eq('status', 'active');
        
      if (featuredIds.length > 0) {
        query = query.not('id', 'in', `(${featuredIds.join(',')})`);
      }
      
      const { data, error } = await query.order('name_tr');
      
      if (error) throw error;
      return data;
    },
    enabled: !!featuredBusinesses,
  });

  // Add featured business mutation
  const addFeaturedMutation = useMutation({
    mutationFn: async (businessId: string) => {
      const orders = featuredBusinesses?.map(fb => fb.sort_order) || [];
      const nextOrder = orders.length > 0 ? Math.max(...orders) + 1 : 0;
      
      const { error } = await supabase
        .from('featured_businesses')
        .insert({
          business_id: businessId,
          sort_order: nextOrder,
          is_active: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-businesses'] });
      queryClient.invalidateQueries({ queryKey: ['available-businesses'] });
      setSelectedBusinessId('');
      toast.success('İşletme öne çıkanlara eklendi');
    },
    onError: (error) => {
      console.error('Error adding featured business:', error);
      toast.error('İşletme eklenirken hata oluştu');
    }
  });

  // Remove featured business mutation
  const removeFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('featured_businesses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-businesses'] });
      queryClient.invalidateQueries({ queryKey: ['available-businesses'] });
      toast.success('İşletme öne çıkanlardan kaldırıldı');
    },
    onError: (error) => {
      console.error('Error removing featured business:', error);
      toast.error('İşletme kaldırılırken hata oluştu');
    }
  });

  // Update featured business mutation
  const updateFeaturedMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FeaturedBusiness> }) => {
      const { error } = await supabase
        .from('featured_businesses')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-businesses'] });
      toast.success('Güncelleme başarılı');
    },
    onError: (error) => {
      console.error('Error updating featured business:', error);
      toast.error('Güncellerken hata oluştu');
    }
  });

  // Reorder functions
  const moveUp = (index: number) => {
    if (index === 0 || !featuredBusinesses) return;
    
    const current = featuredBusinesses[index];
    const previous = featuredBusinesses[index - 1];
    
    updateFeaturedMutation.mutate({ 
      id: current.id, 
      updates: { sort_order: previous.sort_order } 
    });
    updateFeaturedMutation.mutate({ 
      id: previous.id, 
      updates: { sort_order: current.sort_order } 
    });
  };

  const moveDown = (index: number) => {
    if (!featuredBusinesses || index === featuredBusinesses.length - 1) return;
    
    const current = featuredBusinesses[index];
    const next = featuredBusinesses[index + 1];
    
    updateFeaturedMutation.mutate({ 
      id: current.id, 
      updates: { sort_order: next.sort_order } 
    });
    updateFeaturedMutation.mutate({ 
      id: next.id, 
      updates: { sort_order: current.sort_order } 
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Öne Çıkan İşletmeler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Veriler yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="w-5 h-5 mr-2" />
          Öne Çıkan İşletmeler Yönetimi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new featured business */}
        <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Label>İşletme Seç</Label>
            <Select value={selectedBusinessId} onValueChange={setSelectedBusinessId}>
              <SelectTrigger>
                <SelectValue placeholder="Öne çıkarmak istediğiniz işletmeyi seçin" />
              </SelectTrigger>
              <SelectContent>
                {availableBusinesses?.map((business) => (
                  <SelectItem key={business.id} value={business.id}>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      {business.name_tr}
                      {business.categories && (
                        <Badge variant="outline" className="ml-2">
                          {business.categories.name_tr}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button 
              onClick={() => selectedBusinessId && addFeaturedMutation.mutate(selectedBusinessId)}
              disabled={!selectedBusinessId || addFeaturedMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ekle
            </Button>
          </div>
        </div>

        {/* Featured businesses list */}
        <div className="space-y-3">
          {featuredBusinesses?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Henüz öne çıkan işletme yok</p>
            </div>
          ) : (
            featuredBusinesses?.map((featured, index) => (
              <div key={featured.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveDown(index)}
                    disabled={index === (featuredBusinesses?.length || 0) - 1}
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{featured.businesses.name_tr}</h4>
                    {featured.businesses.name_en && (
                      <span className="text-sm text-gray-500">({featured.businesses.name_en})</span>
                    )}
                    <Badge variant={featured.is_active ? "default" : "secondary"}>
                      {featured.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {featured.businesses.categories && (
                      <Badge variant="outline">{featured.businesses.categories.name_tr}</Badge>
                    )}
                    {featured.businesses.locations && (
                      <span>{featured.businesses.locations.name_tr}</span>
                    )}
                    <span className="text-xs">Sıra: {featured.sort_order}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={featured.is_active}
                      onCheckedChange={(checked) =>
                        updateFeaturedMutation.mutate({
                          id: featured.id,
                          updates: { is_active: checked }
                        })
                      }
                    />
                    <Label className="text-sm">Aktif</Label>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFeaturedMutation.mutate(featured.id)}
                  >
                    <X className="w-4 h-4" />
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

export default FeaturedBusinessManagement;