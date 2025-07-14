import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const Login: React.FC = () => {
  const auth = useAuth();
  console.log(auth);
  
  useEffect(() => {
    // Optional: redirect after login if already authenticated
    if (auth.isAuthenticated) {
      window.location.href = '/logs';
    }
  }, [auth.isAuthenticated]);

  if (auth.isLoading) {
    return <p className="p-4">Loading authentication...</p>;
  }

  if (auth.error) {
    return <p className="p-4 text-red-600">Error: {auth.error.message}</p>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto">
          <Shield className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Checkpoint Demo</h1>
        <p className="text-muted-foreground">Download Security Portal</p>
        <Button onClick={() => auth.signinRedirect()} size="lg" className="w-full">
          Sign In with Check Point SSO
        </Button>
      </div>
    </div>
  );
};

export default Login;
