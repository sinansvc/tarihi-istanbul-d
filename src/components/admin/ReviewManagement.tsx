import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Trash2, Eye, Star, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ReviewManagement = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [filterRating, setFilterRating] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin-reviews', filterRating],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          businesses (id, name_tr)
        `)
        .order('created_at', { ascending: false });

      if (filterRating !== 'all') {
        query = query.eq('rating', parseInt(filterRating));
      }

      const { data: reviewsData, error } = await query;
      if (error) throw error;

      // Kullanıcı bilgilerini ayrı çek
      const userIds = reviewsData?.map(r => r.user_id).filter(Boolean) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      // Yorumları kullanıcı bilgileriyle birleştir
      const reviewsWithUsers = reviewsData?.map(review => ({
        ...review,
        user_name: profiles?.find(p => p.id === review.user_id)?.full_name || 'Anonim'
      }));

      return reviewsWithUsers;
    },
  });

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast.success('Yorum silindi!');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Yorum silinirken hata oluştu');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Yorum Yönetimi
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
              <MessageSquare className="w-5 h-5 mr-2" />
              Yorum Yönetimi
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Select value={filterRating} onValueChange={(value: any) => setFilterRating(value)}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Puanlar</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                  <SelectItem value="2">⭐⭐ (2)</SelectItem>
                  <SelectItem value="1">⭐ (1)</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary">
                {reviews?.length || 0} yorum
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          {!reviews || reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz yorum bulunmuyor</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İşletme</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Puan</TableHead>
                  <TableHead>Yorum</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <button
                        onClick={() => navigate(`/business/${review.business_id}`)}
                        className="font-medium hover:underline text-left"
                      >
                        {review.businesses?.name_tr || 'Bilinmeyen'}
                      </button>
                    </TableCell>
                    <TableCell>
                      {review.user_name || 'Anonim'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-sm font-medium">({review.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {review.comment || 'Yorum yok'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(review.created_at).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/business/${review.business_id}`)}
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteReview(review.id)}
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

export default ReviewManagement;
