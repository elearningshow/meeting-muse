import { AlertTriangle, HardDrive, X } from 'lucide-react';
import { StorageStatus } from '@/types/meeting';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StorageWarningProps {
  status: StorageStatus;
}

export const StorageWarning = ({ status }: StorageWarningProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (status.warning === 'none' || dismissed) return null;

  const freeMB = Math.round(status.free / (1024 * 1024));

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg animate-fade-in",
        status.warning === 'critical' 
          ? "bg-destructive/10 border border-destructive/30" 
          : "bg-accent/10 border border-accent/30"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full",
        status.warning === 'critical' ? "bg-destructive/20" : "bg-accent/20"
      )}>
        {status.warning === 'critical' ? (
          <AlertTriangle className="h-4 w-4 text-destructive" />
        ) : (
          <HardDrive className="h-4 w-4 text-accent" />
        )}
      </div>
      <div className="flex-1">
        <p className={cn(
          "text-sm font-medium",
          status.warning === 'critical' ? "text-destructive" : "text-accent"
        )}>
          {status.warning === 'critical' 
            ? 'Critical: Very low storage!' 
            : 'Low storage warning'}
        </p>
        <p className="text-xs text-muted-foreground">
          Only {freeMB} MB remaining. {status.warning === 'critical' 
            ? 'Please free up space to continue recording.' 
            : 'Consider managing your storage.'}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-foreground/10 rounded transition-colors"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
};
