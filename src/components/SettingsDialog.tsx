import { useState } from 'react';
import { Settings, Download, Check, Trash2, Cpu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useModelSettings } from '@/hooks/useModelSettings';
import { cn } from '@/lib/utils';

export const SettingsDialog = () => {
  const [open, setOpen] = useState(false);
  const { 
    models, 
    selectedModel, 
    downloadProgress, 
    downloadModel, 
    selectModel, 
    deleteModel 
  } = useModelSettings();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Model Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Model Display */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Currently Selected</p>
            <p className="font-semibold text-foreground">{selectedModel.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{selectedModel.description}</p>
          </div>

          {/* Model List */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Available Models</h4>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {models.map((model) => {
                  const isDownloading = downloadProgress[model.id] !== undefined;
                  const isSelected = model.id === selectedModel.id;
                  
                  return (
                    <div
                      key={model.id}
                      className={cn(
                        "p-4 rounded-lg border transition-all",
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-foreground">{model.name}</h5>
                            {model.isDefault && (
                              <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full">
                                Default
                              </span>
                            )}
                            {isSelected && (
                              <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Size: {model.size}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {model.downloaded ? (
                            <>
                              {!isSelected && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => selectModel(model.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Select
                                </Button>
                              )}
                              {!model.isDefault && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteModel(model.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          ) : isDownloading ? (
                            <div className="w-24">
                              <Progress value={downloadProgress[model.id]} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1 text-center">
                                {downloadProgress[model.id]}%
                              </p>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadModel(model.id)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Instructions */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Models are stored locally on your device. Larger models provide better quality but require more storage and processing power.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
