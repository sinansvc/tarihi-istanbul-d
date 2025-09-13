import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Eye, UserCheck, Database } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SecurityDashboard = () => {
  // Fetch security audit logs
  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['security-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    }
  });

  // Get security stats
  const { data: securityStats } = useQuery({
    queryKey: ['security-stats'],
    queryFn: async () => {
      const [
        businessesCount,
        usersCount,
        rolesCount,
        recentChanges
      ] = await Promise.all([
        supabase.from('businesses').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('user_roles').select('*', { count: 'exact' }),
        supabase
          .from('security_audit_logs')
          .select('*', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        businessesCount: businessesCount.count || 0,
        usersCount: usersCount.count || 0,
        rolesCount: rolesCount.count || 0,
        recentChanges: recentChanges.count || 0
      };
    }
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'INSERT':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTableIcon = (tableName: string) => {
    switch (tableName) {
      case 'businesses':
        return <Database className="w-4 h-4" />;
      case 'user_roles':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats?.businessesCount || 0}</div>
            <p className="text-xs text-muted-foreground">Registered businesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats?.usersCount || 0}</div>
            <p className="text-xs text-muted-foreground">User profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role Assignments</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats?.rolesCount || 0}</div>
            <p className="text-xs text-muted-foreground">Active role assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Changes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats?.recentChanges || 0}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Status:</strong> Enhanced RLS policies are active. Business contact information is now protected and only accessible to business owners and administrators.
        </AlertDescription>
      </Alert>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Security Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="text-center py-4">Loading audit logs...</div>
          ) : auditLogs && auditLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Record ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {new Date(log.created_at).toLocaleString('tr-TR')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.user_id ? log.user_id.substring(0, 8) + '...' : 'System'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionBadgeColor(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTableIcon(log.table_name)}
                        <span className="text-sm">{log.table_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {log.record_id ? log.record_id.substring(0, 8) + '...' : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found. Security monitoring is active and will record future changes.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};