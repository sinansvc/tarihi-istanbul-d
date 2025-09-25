
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // First get all profiles with their user roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      // Then get user roles separately
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles = profiles.map(profile => ({
        ...profile,
        user_roles: userRoles.filter(role => role.user_id === profile.id)
      }));

      return usersWithRoles;
    },
  });

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdatingRole(userId);
    try {
      // Önce mevcut rolü sil
      await supabase
        .from('user_roles' as any)
        .delete()
        .eq('user_id', userId);

      // Yeni rolü ekle (eğer user değilse)
      if (newRole !== 'user') {
        const { error } = await supabase
          .from('user_roles' as any)
          .insert({ user_id: userId, role: newRole });

        if (error) throw error;
      }

      toast.success('Kullanıcı rolü güncellendi!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Rol güncellenirken bir hata oluştu');
    } finally {
      setUpdatingRole(null);
    }
  };

  const getUserRole = (user: any) => {
    if (!user.user_roles || user.user_roles.length === 0) return 'user';
    return user.user_roles[0].role;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Kullanıcı Yönetimi
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
            <Users className="w-5 h-5 mr-2" />
            Kullanıcı Yönetimi
          </div>
          <Badge variant="secondary">
            {users?.length || 0} kullanıcı
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!users || users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Kullanıcı bulunmuyor</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı Adı</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const currentRole = getUserRole(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || 'Belirtilmemiş'}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {user.id.substring(0, 8)}...
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(currentRole)}>
                        {currentRole === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                        {currentRole === 'moderator' && <UserCheck className="w-3 h-3 mr-1" />}
                        {currentRole === 'admin' ? 'Admin' : 
                         currentRole === 'moderator' ? 'Moderatör' : 'Kullanıcı'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={currentRole}
                        onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                        disabled={updatingRole === user.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Kullanıcı</SelectItem>
                          <SelectItem value="moderator">Moderatör</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
