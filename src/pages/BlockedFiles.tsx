import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BlockedFiles: React.FC = () => {
  const [blockedTypes, setBlockedTypes] = useState<string[]>([
    '.exe',
    '.msi',
    '.bat',
    '.cmd',
    '.scr',
    '.pif',
    '.com',
    '.zip',
    '.rar',
    '.7z',
    '.dmg',
    '.pkg'
  ]);
  const [newType, setNewType] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const addFileType = () => {
    if (newType.trim() && !blockedTypes.includes(newType.trim())) {
      const formattedType = newType.trim().startsWith('.') ? newType.trim() : `.${newType.trim()}`;
      setBlockedTypes([...blockedTypes, formattedType]);
      setNewType('');
      setIsEditing(true);
    }
  };

  const removeFileType = (typeToRemove: string) => {
    setBlockedTypes(blockedTypes.filter(type => type !== typeToRemove));
    setIsEditing(true);
  };

  const saveChanges = async () => {
    // Mock API call - replace with actual API endpoint
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      toast({
        title: "Changes saved",
        description: "Blocked file types configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addFileType();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Blocked File Types Configuration</h1>
        <p className="text-muted-foreground">Manage file extensions that are automatically blocked during downloads</p>
      </div>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Security Policy Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New File Type */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter file extension (e.g., .exe or exe)"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addFileType} disabled={!newType.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Current Blocked Types */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Currently Blocked File Types ({blockedTypes.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {blockedTypes.map((type) => (
                <div key={type} className="relative group">
                  <Badge
                    variant="secondary"
                    className="w-full justify-between pr-8 py-2 text-sm"
                  >
                    {type}
                    <button
                      onClick={() => removeFileType(type)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </button>
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end pt-4 border-t border-border">
              <Button onClick={saveChanges} className="min-w-32">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">How it works:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Files with blocked extensions are automatically prevented from being downloaded</li>
                <li>Users will see a security warning when attempting to download blocked file types</li>
                <li>All blocked attempts are logged for security monitoring</li>
                <li>Changes take effect immediately across all connected endpoints</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Common blocked extensions:</h4>
              <p>
                Executable files (.exe, .msi, .bat, .cmd), Script files (.scr, .pif, .com), 
                Archive files (.zip, .rar, .7z), and System installers (.dmg, .pkg)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockedFiles;