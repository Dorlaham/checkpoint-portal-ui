import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getBlockedTypes, updateBlockedTypes } from '@/api';

const BlockedFiles: React.FC = () => {
  const auth = useAuth();
  const [blockedExtensions, setBlockedExtensions] = useState<string[]>([]);
  const [blockedMimes, setBlockedMimes] = useState<string[]>([]);
  const [newExt, setNewExt] = useState('');
  const [newMime, setNewMime] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (!auth.isAuthenticated || !auth.user?.id_token) return;
      try {
        const data = await getBlockedTypes(auth.user.id_token);
        
        setBlockedExtensions(data.blocked_extensions || []);
        setBlockedMimes(data.blocked_mime_types || []);
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.message || 'Failed to load blocked types.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auth.isAuthenticated, auth.user]);

  const addItem = (type: 'ext' | 'mime') => {
    if (type === 'ext' && newExt.trim()) {
      const ext = newExt.trim().startsWith('.') ? newExt.trim() : '.' + newExt.trim();
      if (!blockedExtensions.includes(ext)) {
        setBlockedExtensions([...blockedExtensions, ext]);
        setNewExt('');
        setIsEditing(true);
      }
    } else if (type === 'mime' && newMime.trim()) {
      const mime = newMime.trim();
      if (!blockedMimes.includes(mime)) {
        setBlockedMimes([...blockedMimes, mime]);
        setNewMime('');
        setIsEditing(true);
      }
    }
  };

  const removeItem = (type: 'ext' | 'mime', value: string) => {
    if (type === 'ext') {
      setBlockedExtensions(blockedExtensions.filter((v) => v !== value));
    } else {
      setBlockedMimes(blockedMimes.filter((v) => v !== value));
    }
    setIsEditing(true);
  };

  const save = async () => {
    if (!auth.user?.id_token) return;
    try {
      await updateBlockedTypes(auth.user.id_token, {
        blocked_extensions: blockedExtensions,
        blocked_mime_types: blockedMimes,
      });
      setIsEditing(false);
      toast({ title: 'Saved', description: 'Updated block list successfully.' });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (auth.isLoading || loading) return <p className="p-4">Loading blocked types...</p>;
  if (!auth.isAuthenticated)
    return <p className="p-4 text-red-600">You must be logged in to configure blocked types.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Blocked File Types</h1>
        <p className="text-muted-foreground">
          Manage file extensions and MIME types that are blocked automatically
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Extensions */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Blocked Extensions</h3>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder=".exe or exe"
                value={newExt}
                onChange={(e) => setNewExt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('ext')}
              />
              <Button onClick={() => addItem('ext')} disabled={!newExt.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {blockedExtensions.map((ext) => (
                <Badge key={ext} variant="secondary" className="relative pr-6">
                  {ext}
                  <button
                    onClick={() => removeItem('ext', ext)}
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* MIME types */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Blocked MIME Types</h3>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="application/x-msdownload"
                value={newMime}
                onChange={(e) => setNewMime(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('mime')}
              />
              <Button onClick={() => addItem('mime')} disabled={!newMime.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {blockedMimes.map((mime) => (
                <Badge key={mime} variant="secondary" className="relative pr-6">
                  {mime}
                  <button
                    onClick={() => removeItem('mime', mime)}
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-4 border-t border-border">
              <Button onClick={save}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockedFiles;
