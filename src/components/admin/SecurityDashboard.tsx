import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, AlertTriangle, Eye, UserX, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const SecurityDashboard = () => {
  // Fetch security audit logs
  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['security-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Error fetching audit logs:', error);
        toast.error('Güvenlik logları yüklenirken hata oluştu');
        throw error;
      }
      
      return data;
    },
  });

  // Security stats
  const { data: securityStats, isLoading: statsLoading } = useQuery({
    queryKey: ['security-stats'],
    queryFn: async () => {
      // Get recent login attempts, role changes, and suspicious activities
      const [roleChanges, recentBusinessUpdates] = await Promise.all([
        supabase
          .from('security_audit_logs')
          .select('*')
          .eq('table_name', 'user_roles')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        
        supabase
          .from('security_audit_logs')
          .select('*')
          .eq('table_name', 'businesses')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        roleChanges: roleChanges.data?.length || 0,
        businessUpdates: recentBusinessUpdates.data?.length || 0,
        totalEvents: auditLogs?.length || 0,
      };
    },
    enabled: !!auditLogs,
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'INSERT':
        return <UserX className="w-4 h-4 text-green-500" />;
      case 'UPDATE':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'DELETE':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'INSERT':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (logsLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Son 24 Saat - Rol Değişiklikleri</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats?.roleChanges || 0}</div>
            <p className="text-xs text-muted-foreground">
              Kullanıcı rol değişiklikleri
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Son 24 Saat - İşletme Güncellemeleri</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats?.businessUpdates || 0}</div>
            <p className="text-xs text-muted-foreground">
              İşletme bilgisi değişiklikleri
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Güvenlik Olayları</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats?.totalEvents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Sistem geneli aktiviteler
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Güvenlik Audit Logları
          </CardTitle>
          <CardDescription>
            Son sistemsel değişiklikler ve güvenlik olayları
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auditLogs && auditLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zaman</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>İşlem</TableHead>
                  <TableHead>Tablo</TableHead>
                  <TableHead>Kayıt ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.slice(0, 50).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {new Date(log.created_at).toLocaleString('tr-TR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.user_id ? log.user_id.slice(-8) : 'System'}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <Badge className={getActionBadgeColor(log.action)}>
                          {log.action}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{log.table_name}</code>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.record_id ? log.record_id.slice(-8) : 'N/A'}
                      </code>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Henüz güvenlik logu bulunmuyor</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};