import { useState } from 'react';
import { Settings, Sparkles, Bug, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SettingsDialogProps {
  debugEnabled?: boolean;
  onDebugToggle?: (enabled: boolean) => void;
}

export const SettingsDialog = ({ debugEnabled = false, onDebugToggle }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  
  // Check if Gemini API key is configured
  const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Settings
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-4 pb-4">
            {/* AI Status */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">AI Integration Status</h4>
              <div className={`p-4 rounded-lg border ${hasApiKey ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                <div className="flex items-center gap-3">
                  {hasApiKey ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">
                      {hasApiKey ? 'Gemini Flash Connected' : 'API Key Required'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {hasApiKey 
                        ? 'Real AI article generation and Q&A are enabled'
                        : 'Add your Gemini API key in project secrets to enable AI features'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Info */}
            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">Google Gemini 2.0 Flash</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Fast and efficient AI model for article generation and session Q&A. Provides high-quality, contextually relevant content from your transcripts.
              </p>
            </div>

            <Separator />

            {/* Debug Settings */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Developer Options
              </h4>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="debug-mode" className="text-sm font-medium">
                    Microphone Debug Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Show debug panel to test microphone access strategies
                  </p>
                </div>
                <Switch
                  id="debug-mode"
                  checked={debugEnabled}
                  onCheckedChange={onDebugToggle}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> AI features require a valid Google Gemini API key. Get your free key from{' '}
                <a 
                  href="https://aistudio.google.com/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>.
              </p>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4 pt-4 border-t">
          <Button onClick={() => setOpen(false)} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
