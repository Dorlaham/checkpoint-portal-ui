import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download } from 'lucide-react';

interface LogEntry {
  id: string;
  dateTime: string;
  fileName: string;
  fileType: string;
  user: string;
  status: 'Blocked' | 'Allowed';
}

const Logs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Blocked' | 'Allowed'>('all');

  const mockLogs: LogEntry[] = [
    {
      id: '1',
      dateTime: '2024-01-15 14:32:15',
      fileName: 'document.pdf',
      fileType: '.pdf',
      user: 'john.doe@company.com',
      status: 'Allowed'
    },
    {
      id: '2',
      dateTime: '2024-01-15 14:28:42',
      fileName: 'malware.exe',
      fileType: '.exe',
      user: 'jane.smith@company.com',
      status: 'Blocked'
    },
    {
      id: '3',
      dateTime: '2024-01-15 14:25:33',
      fileName: 'presentation.pptx',
      fileType: '.pptx',
      user: 'bob.wilson@company.com',
      status: 'Allowed'
    },
    {
      id: '4',
      dateTime: '2024-01-15 14:22:18',
      fileName: 'script.bat',
      fileType: '.bat',
      user: 'alice.brown@company.com',
      status: 'Blocked'
    },
    {
      id: '5',
      dateTime: '2024-01-15 14:19:07',
      fileName: 'report.xlsx',
      fileType: '.xlsx',
      user: 'charlie.davis@company.com',
      status: 'Allowed'
    },
    {
      id: '6',
      dateTime: '2024-01-15 14:15:44',
      fileName: 'installer.msi',
      fileType: '.msi',
      user: 'diana.white@company.com',
      status: 'Blocked'
    },
    {
      id: '7',
      dateTime: '2024-01-15 14:12:29',
      fileName: 'image.jpg',
      fileType: '.jpg',
      user: 'evan.green@company.com',
      status: 'Allowed'
    },
    {
      id: '8',
      dateTime: '2024-01-15 14:09:16',
      fileName: 'archive.zip',
      fileType: '.zip',
      user: 'fiona.black@company.com',
      status: 'Blocked'
    }
  ];

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = 
      log.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.fileType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    return status === 'Blocked' ? 'destructive' : 'success';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Download Logs</h1>
        <p className="text-muted-foreground">Monitor file download activity and security events</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by filename, user, or file type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'Allowed' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('Allowed')}
                size="sm"
              >
                Allowed
              </Button>
              <Button
                variant={filterStatus === 'Blocked' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('Blocked')}
                size="sm"
              >
                Blocked
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity ({filteredLogs.length} entries)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date / Time</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">File Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">File Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={`border-b border-border ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                    } hover:bg-muted/50 transition-colors`}
                  >
                    <td className="py-3 px-4 text-sm text-foreground">{log.dateTime}</td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{log.fileName}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{log.fileType}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{log.user}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusColor(log.status) as any}>
                        {log.status}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;