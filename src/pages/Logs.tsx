import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download } from 'lucide-react';
import { fetchLogs } from '@/api';
import { saveAs } from 'file-saver';

interface LogEntry {
  log_id: string;
  timestamp: string;
  filename: string;
  mime_type: string;
  allow: boolean;
  url: string;
}


function exportLogsAsCSV(logs: LogEntry[]) {
  if (!logs.length) return;

  const headers = ['Timestamp', 'Filename', 'Mime Type', 'URL', 'Status'];
  const rows = logs.map(log => [
    new Date(log.timestamp).toLocaleString(),
    log.filename || '',
    log.mime_type || '',
    log.url || '',
    log.allow ? 'Allowed' : 'Blocked',
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'download_logs.csv');
}

const Logs: React.FC = () => {
  const auth = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Blocked' | 'Allowed'>('all');

  const loadLogs = async (cursorParam?: string) => {
    if (!auth.isAuthenticated || !auth.user?.id_token) return;
    try {
      setLoading(true);
      const response = await fetchLogs(auth.user.id_token, cursorParam);
      setLogs((prev) => [...prev, ...response.logs]);
      setCursor(response.nextCursor || null);
      setHasNext(response.has_next);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLogs([]); // reset logs on auth change
    loadLogs();
  }, [auth.isAuthenticated, auth.user]);

  const filteredLogs = logs.filter((log) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (log.filename || '').toLowerCase().includes(search) ||
      (log.mime_type || '').toLowerCase().includes(search) ||
      (log.url || '').toLowerCase().includes(search);

    const status = log.allow ? 'Allowed' : 'Blocked';
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (auth.isLoading || loading) {
    return <p className="p-4">Loading logs...</p>;
  }

  if (!auth.isAuthenticated) {
    return <p className="p-4 text-red-600">You must be logged in to view logs.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Download Logs</h1>
        <p className="text-muted-foreground">Monitor file download activity and security events</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by file name, type, or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'Allowed', 'Blocked'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  onClick={() => setFilterStatus(status as any)}
                  size="sm"
                >
                  {status}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportLogsAsCSV(filteredLogs)}
              disabled={!filteredLogs.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity ({filteredLogs.length} entries)</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date / Time</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">File Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">File Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr
                      key={`${log.log_id}-${index}`}
                      className={`border-b border-border ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                      } hover:bg-muted/50 transition-colors`}
                    >
                      <td className="py-3 px-4 text-sm text-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {log.filename || 'unknown'}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {log.mime_type || 'unknown'}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {log.url ? new URL(log.url).hostname : 'unknown'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={log.allow ? 'success' : 'destructive'}>
                          {log.allow ? 'Allowed' : 'Blocked'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No logs found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {hasNext && (
                <div className="text-center mt-4">
                  <Button variant="secondary" onClick={() => loadLogs(cursor || undefined)}>
                    Load More
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;
