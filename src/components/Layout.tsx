import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Layout: React.FC = () => {
  const auth = useAuth();

  if (auth.isLoading) return <p className="p-4">Loading authentication...</p>;
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="flex justify-end p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => auth.removeUser()} // או: auth.signoutRedirect()
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        <div className="container mx-auto p-6 pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
