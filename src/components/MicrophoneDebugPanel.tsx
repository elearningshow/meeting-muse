import { useState, useEffect } from 'react';
import { Bug, Mic, MicOff, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface StrategyStatus {
  strategy1: { status: 'pending' | 'success' | 'failed' | 'testing'; message: string };
  strategy2: { status: 'pending' | 'success' | 'failed' | 'testing'; message: string };
  strategy3: { status: 'pending' | 'success' | 'failed' | 'testing'; message: string };
  strategy4: { status: 'pending' | 'success' | 'failed' | 'testing'; message: string };
}

interface MicrophoneDebugPanelProps {
  strategyStatus: StrategyStatus;
  activeStrategy: string | null;
  logs: string[];
  onTestStrategy: (strategy: number) => void;
  onTestAll: () => void;
  allStrategiesFailed: boolean;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'testing':
      return <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    success: 'bg-green-500/20 text-green-600 border-green-500/30',
    failed: 'bg-destructive/20 text-destructive border-destructive/30',
    testing: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
    pending: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <Badge variant="outline" className={cn('text-xs', variants[status] || variants.pending)}>
      {status.toUpperCase()}
    </Badge>
  );
};

export const MicrophoneDebugPanel = ({
  strategyStatus,
  activeStrategy,
  logs,
  onTestStrategy,
  onTestAll,
  allStrategiesFailed,
}: MicrophoneDebugPanelProps) => {
  const strategies = [
    { id: 1, name: 'Permission Query', description: 'Uses navigator.permissions.query() before getUserMedia' },
    { id: 2, name: 'Early Enumeration', description: 'Calls enumerateDevices() to trigger browser discovery' },
    { id: 3, name: 'Enhanced Constraints', description: 'Requests with specific audio constraints' },
    { id: 4, name: 'Persistent Stream', description: 'Keeps microphone stream open during session' },
  ];

  const getStrategyStatus = (id: number) => {
    const key = `strategy${id}` as keyof StrategyStatus;
    return strategyStatus[key];
  };

  return (
    <Card className="border-yellow-500/30 bg-yellow-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bug className="h-5 w-5 text-yellow-500" />
          Microphone Debug Panel
          {activeStrategy && (
            <Badge variant="secondary" className="ml-auto">
              Testing: {activeStrategy}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Strategy Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {strategies.map((strategy) => {
            const status = getStrategyStatus(strategy.id);
            return (
              <div
                key={strategy.id}
                className={cn(
                  'p-3 rounded-lg border transition-all',
                  status.status === 'testing' && 'border-yellow-500 bg-yellow-500/10',
                  status.status === 'success' && 'border-green-500 bg-green-500/10',
                  status.status === 'failed' && 'border-destructive bg-destructive/10',
                  status.status === 'pending' && 'border-border bg-card'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={status.status} />
                    <span className="font-medium text-sm">Strategy {strategy.id}</span>
                  </div>
                  <StatusBadge status={status.status} />
                </div>
                <p className="text-xs text-muted-foreground mb-2">{strategy.name}</p>
                <p className="text-xs text-muted-foreground/70">{strategy.description}</p>
                {status.message && (
                  <p className="text-xs mt-2 font-mono bg-background/50 p-1 rounded">
                    {status.message}
                  </p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2 text-xs h-7"
                  onClick={() => onTestStrategy(strategy.id)}
                  disabled={status.status === 'testing'}
                >
                  Test Strategy {strategy.id}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Test All Button */}
        <Button onClick={onTestAll} className="w-full gap-2">
          <Mic className="h-4 w-4" />
          Test All Strategies
        </Button>

        {/* Debug Logs */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Debug Logs</p>
          <ScrollArea className="h-32 rounded-lg border bg-background p-2">
            <div className="space-y-1 font-mono text-xs">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">No logs yet. Test a strategy to see results.</p>
              ) : (
                logs.map((log, i) => (
                  <p
                    key={i}
                    className={cn(
                      log.includes('SUCCESS') && 'text-green-500',
                      log.includes('FAILED') && 'text-destructive',
                      log.includes('TESTING') && 'text-yellow-500'
                    )}
                  >
                    {log}
                  </p>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* All Strategies Failed Message */}
        {allStrategiesFailed && (
          <div className="p-4 rounded-lg border border-destructive bg-destructive/10 space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <MicOff className="h-5 w-5" />
              <span className="font-medium">All strategies failed</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Please enable microphone access in your device settings:
            </p>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Open Android Settings</li>
              <li>Go to Apps → Chrome (or your browser)</li>
              <li>Tap Permissions → Microphone</li>
              <li>Select "Allow"</li>
              <li>Return to this app and try again</li>
            </ol>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                // Try to open Android settings (may not work on all devices)
                window.open('app-settings:', '_blank');
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Open Device Settings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
