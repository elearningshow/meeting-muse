import { FileText, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TranscriptViewProps {
  transcript: string;
  interimTranscript?: string;
  isRecording: boolean;
}

export const TranscriptView = ({
  transcript,
  interimTranscript,
  isRecording,
}: TranscriptViewProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasContent = transcript.length > 0 || (interimTranscript && interimTranscript.length > 0);

  return (
    <div className="flex flex-col h-full bg-card rounded-xl shadow-card border border-border overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Live Transcript</h3>
          {isRecording && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-destructive/10 text-destructive rounded-full">
              <span className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>
        {transcript.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        )}
      </div>

      {/* Transcript Content */}
      <ScrollArea className="flex-1 p-4">
        {hasContent ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {transcript}
              {interimTranscript && (
                <span className="text-muted-foreground opacity-70">
                  {interimTranscript}
                </span>
              )}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-4",
              isRecording ? "bg-destructive/10" : "bg-secondary"
            )}>
              <FileText className={cn(
                "h-8 w-8",
                isRecording ? "text-destructive animate-pulse" : "text-muted-foreground"
              )} />
            </div>
            <p className="text-muted-foreground">
              {isRecording 
                ? "Listening... Start speaking to see the transcript" 
                : "Your transcript will appear here"}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
