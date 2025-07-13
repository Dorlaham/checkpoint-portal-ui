import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Downloads',
      value: '1,247',
      change: '+12%',
      icon: FileText,
      color: 'text-primary'
    },
    {
      title: 'Blocked Files',
      value: '42',
      change: '+3%',
      icon: Shield,
      color: 'text-destructive'
    },
    {
      title: 'Allowed Files',
      value: '1,205',
      change: '+11%',
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      title: 'Warnings',
      value: '8',
      change: '-2%',
      icon: AlertTriangle,
      color: 'text-warning'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Download Security Portal</h1>
        <p className="text-muted-foreground">Monitor and manage file download security</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}>
                  {stat.change}
                </span>
                {' '}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Blocked Files</CardTitle>
            <CardDescription>Latest security blocks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { file: 'malware.exe', user: 'john.doe@company.com', time: '2 minutes ago' },
                { file: 'script.bat', user: 'jane.smith@company.com', time: '15 minutes ago' },
                { file: 'installer.msi', user: 'bob.wilson@company.com', time: '1 hour ago' }
              ].map((block, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-muted rounded-md">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{block.file}</p>
                    <p className="text-xs text-muted-foreground">{block.user}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{block.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Security monitoring status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: 'File Scanner', status: 'Active', color: 'text-success' },
                { service: 'Real-time Protection', status: 'Active', color: 'text-success' },
                { service: 'Policy Engine', status: 'Active', color: 'text-success' },
                { service: 'Audit Logging', status: 'Active', color: 'text-success' }
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="text-sm font-medium text-foreground">{service.service}</span>
                  <span className={`text-sm font-medium ${service.color}`}>{service.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;