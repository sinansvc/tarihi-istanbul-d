import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, User, Store, Shield, Filter, Search, Calendar, Activity } from 'lucide-react';

// Log tipini tanımla (gerçek implementasyonda database'de olacak)
interface AdminLog {
  id: string;
  action: string;
  target_type: 'user' | 'business' | 'system';
  target_id?: string;
  target_name?: string;
  admin_id: string;
  admin_name: string;
  details?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const AdminLogs = () => {
  const [filterType, setFilterType] = useState<'all' | 'user' | 'business' | 'system'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('week');

  // Örnek log verileri (gerçek implementasyonda Supabase'den gelecek)
  const generateSampleLogs = (): AdminLog[] => {
    const actions = [
      { action: 'İşletme onaylandı', target_type: 'business', severity: 'medium' },
      { action: 'İşletme reddedildi', target_type: 'business', severity: 'medium' },
      { action: 'Kullanıcı rolü değiştirildi', target_type: 'user', severity: 'high' },
      { action: 'Toplu işletme onayı', target_type: 'business', severity: 'high' },
      { action: 'Sistem yedekleme tamamlandı', target_type: 'system', severity: 'low' },
      { action: 'Güvenlik uyarısı', target_type: 'system', severity: 'critical' },
      { action: 'Admin panel erişimi', target_type: 'system', severity: 'low' },
      { action: 'Kullanıcı hesabı askıya alındı', target_type: 'user', severity: 'high' }
    ];

    return Array.from({ length: 50 }, (_, i) => {
      const actionData = actions[i % actions.length];
      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 168)); // Son 7 gün

      return {
        id: `log-${i}`,
        action: actionData.action,
        target_type: actionData.target_type as any,
        target_id: `target-${i}`,
        target_name: actionData.target_type === 'business' ? `İşletme ${i + 1}` : 
                    actionData.target_type === 'user' ? `Kullanıcı ${i + 1}` : 
                    'Sistem',
        admin_id: 'admin-1',
        admin_name: 'Admin User',
        details: `${actionData.action} işlemi gerçekleştirildi`,
        ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
        user_agent: 'Mozilla/5.0 Chrome/91.0',
        created_at: date.toISOString(),
        severity: actionData.severity as any
      };
    });
  };

  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin-logs', filterType, filterSeverity, dateFilter],
    queryFn: async () => {
      // Gerçek implementasyonda Supabase sorgusu olacak
      const allLogs = generateSampleLogs();
      
      return allLogs.filter(log => {
        const matchesType = filterType === 'all' || log.target_type === filterType;
        const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
        const matchesSearch = searchTerm === '' || 
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.target_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.admin_name.toLowerCase().includes(searchTerm.toLowerCase());

        const logDate = new Date(log.created_at);
        const now = new Date();
        let matchesDate = true;

        switch (dateFilter) {
          case 'today':
            matchesDate = logDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= monthAgo;
            break;
        }

        return matchesType && matchesSeverity && matchesSearch && matchesDate;
      }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-4 h-4" />;
      case 'business': return <Store className="w-4 h-4" />;
      case 'system': return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-600';
      case 'business': return 'text-green-600';
      case 'system': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Sistem Logları
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
      {/* Filtreler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Sistem Logları
            </div>
            <Badge variant="secondary">
              {logs?.length || 0} kayıt
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Aksiyon, kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Tip</label>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Tipler</SelectItem>
                  <SelectItem value="user">Kullanıcı</SelectItem>
                  <SelectItem value="business">İşletme</SelectItem>
                  <SelectItem value="system">Sistem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Önem</label>
              <Select value={filterSeverity} onValueChange={(value: any) => setFilterSeverity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Seviyeler</SelectItem>
                  <SelectItem value="low">Düşük</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                  <SelectItem value="critical">Kritik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tarih</label>
              <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Bugün</SelectItem>
                  <SelectItem value="week">Son 7 Gün</SelectItem>
                  <SelectItem value="month">Son 30 Gün</SelectItem>
                  <SelectItem value="all">Tümü</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">İşlemler</label>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterSeverity('all');
                  setDateFilter('week');
                }}
                className="w-full"
              >
                Filtreleri Temizle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Listesi */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {!logs || logs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Bu filtrelerde log kaydı bulunmuyor</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead>Tarih/Saat</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Aksiyon</TableHead>
                    <TableHead>Hedef</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Önem</TableHead>
                    <TableHead>IP Adresi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(log.created_at).toLocaleDateString('tr-TR')}
                          </div>
                          <div className="text-gray-500">
                            {new Date(log.created_at).toLocaleTimeString('tr-TR')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center ${getTypeColor(log.target_type)}`}>
                          {getTypeIcon(log.target_type)}
                          <span className="ml-2 text-sm font-medium capitalize">
                            {log.target_type === 'user' ? 'Kullanıcı' : 
                             log.target_type === 'business' ? 'İşletme' : 'Sistem'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium text-sm">{log.action}</div>
                          {log.details && (
                            <div className="text-xs text-gray-500 truncate">
                              {log.details}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{log.target_name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{log.admin_name}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity === 'low' ? 'Düşük' :
                           log.severity === 'medium' ? 'Orta' :
                           log.severity === 'high' ? 'Yüksek' : 'Kritik'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-500">{log.ip_address}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogs;