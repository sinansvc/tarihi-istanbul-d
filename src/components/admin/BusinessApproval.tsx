
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Eye, Store } from 'lucide-react';
import { toast } from 'sonner';

const BusinessApproval = () => {
  const queryClient = useQueryClient();

  const { data: pendingBusinesses, isLoading } = useQuery({
    queryKey: ['pending-businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          categories (name_tr),
          locations (name_tr)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateBusinessStatus = async (businessId: string, status: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ status })
        .eq('id', businessId);

      if (error) throw error;

      toast.success(status === 'active' ? 'İşletme onaylandı!' : 'İşletme reddedildi!');
      queryClient.invalidateQueries({ queryKey: ['pending-businesses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    } catch (error) {
      console.error('Error updating business status:', error);
      toast.error('İşlem sırasında bir hata oluştu');
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Store className="w-5 h-5 mr-2" />
            İşletme Onayları
          </div>
          <Badge variant="secondary">
            {pendingBusinesses?.length || 0} onay bekliyor
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!pendingBusinesses || pendingBusinesses.length === 0 ? (
          <div className="text-center py-8">
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Onay bekleyen işletme bulunmuyor</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İşletme Adı</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Lokasyon</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingBusinesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">
                    {business.name_tr}
                  </TableCell>
                  <TableCell>
                    {business.categories?.name_tr || 'Belirtilmemiş'}
                  </TableCell>
                  <TableCell>
                    {business.locations?.name_tr || 'Belirtilmemiş'}
                  </TableCell>
                  <TableCell>
                    {business.phone || 'Belirtilmemiş'}
                  </TableCell>
                  <TableCell>
                    {new Date(business.created_at).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateBusinessStatus(business.id, 'active')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateBusinessStatus(business.id, 'inactive')}
                      >
                        <XCircle className="w-4 h-4" />
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

export default BusinessApproval;
