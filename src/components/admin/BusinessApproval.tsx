
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Eye, Store, CheckCircle2, Filter, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const BusinessApproval = () => {
  const queryClient = useQueryClient();
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'inactive'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses-for-approval', filterStatus],
    queryFn: async () => {
      let query = supabase
        .from('businesses')
        .select(`
          *,
          categories (name_tr),
          locations (name_tr)
        `)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Toplu işlemler
  const bulkUpdateStatus = async (status: 'active' | 'inactive') => {
    if (selectedBusinesses.length === 0) {
      toast.error('Lütfen en az bir işletme seçin');
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ status })
        .in('id', selectedBusinesses);

      if (error) throw error;

      const action = status === 'active' ? 'onaylandı' : 'reddedildi';
      toast.success(`${selectedBusinesses.length} işletme ${action}!`);
      
      setSelectedBusinesses([]);
      queryClient.invalidateQueries({ queryKey: ['businesses-for-approval'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    } catch (error) {
      console.error('Error bulk updating:', error);
      toast.error('Toplu işlem sırasında hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  // Tek işletme durumu güncelleme
  const updateBusinessStatus = async (businessId: string, status: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ status })
        .eq('id', businessId);

      if (error) throw error;

      toast.success(status === 'active' ? 'İşletme onaylandı!' : 'İşletme reddedildi!');
      queryClient.invalidateQueries({ queryKey: ['businesses-for-approval'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    } catch (error) {
      console.error('Error updating business status:', error);
      toast.error('İşlem sırasında bir hata oluştu');
    }
  };

  // İşletme detaylarını görüntüle
  const viewBusinessDetails = (business: any) => {
    // İşletme detaylarını modal veya alert ile göster
    alert(`İşletme Detayları:
İsim: ${business.name_tr}
Kategori: ${business.categories?.name_tr || 'Belirtilmemiş'}
Konum: ${business.locations?.name_tr || 'Belirtilmemiş'}
Durum: ${business.status === 'active' ? 'Aktif' : business.status === 'pending' ? 'Bekliyor' : 'Reddedildi'}
Oluşturulma: ${new Date(business.created_at).toLocaleDateString('tr-TR')}
Email: ${business.email || 'Belirtilmemiş'}
Telefon: ${business.phone || 'Belirtilmemiş'}
Adres: ${business.address || 'Belirtilmemiş'}`);
  };

  // Seçim fonksiyonları
  const toggleBusinessSelection = (businessId: string) => {
    setSelectedBusinesses(prev => 
      prev.includes(businessId) 
        ? prev.filter(id => id !== businessId)
        : [...prev, businessId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBusinesses.length === businesses?.length) {
      setSelectedBusinesses([]);
    } else {
      setSelectedBusinesses(businesses?.map(b => b.id) || []);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="w-5 h-5 mr-2" />
            İşletme Onayları
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
      {/* Filtre ve Toplu İşlemler */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Store className="w-5 h-5 mr-2" />
              İşletme Yönetimi
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="pending">Onay Bekleyen</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Reddedilen</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary">
                {businesses?.length || 0} işletme
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        {selectedBusinesses.length > 0 && (
          <CardContent className="border-t">
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
              <span className="text-sm font-medium">
                {selectedBusinesses.length} işletme seçildi
              </span>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => bulkUpdateStatus('active')}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isProcessing}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Toplu Onayla
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => bulkUpdateStatus('inactive')}
                  disabled={isProcessing}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Toplu Reddet
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedBusinesses([])}
                >
                  Seçimi Temizle
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* İşletme Listesi */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full"></div>
            </div>
          ) : !businesses || businesses.length === 0 ? (
            <div className="text-center py-8">
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {filterStatus === 'pending' 
                  ? 'Onay bekleyen işletme bulunmuyor' 
                  : 'Bu filtrde işletme bulunmuyor'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedBusinesses.length === businesses.length && businesses.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>İşletme Bilgileri</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Sahip</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBusinesses.includes(business.id)}
                        onCheckedChange={() => toggleBusinessSelection(business.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{business.name_tr}</div>
                        <div className="text-sm text-muted-foreground">
                          {business.phone || 'Telefon belirtilmemiş'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {business.categories?.name_tr || 'Belirtilmemiş'}
                    </TableCell>
                    <TableCell>
                      {business.locations?.name_tr || 'Belirtilmemiş'}
                    </TableCell>
                    <TableCell>
                      {'Bilinmiyor'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          business.status === 'active' ? 'default' : 
                          business.status === 'pending' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {business.status === 'active' ? 'Aktif' : 
                         business.status === 'pending' ? 'Bekliyor' : 
                         'Reddedildi'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(business.created_at).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {business.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateBusinessStatus(business.id, 'active')}
                              className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateBusinessStatus(business.id, 'inactive')}
                              className="h-8 w-8 p-0"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => viewBusinessDetails(business)}
                        >
                          <Eye className="w-4 h-4" />
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

export default BusinessApproval;
