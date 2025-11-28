import { FileText, Copy, Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import logoImg from '@/assets/logo.jpg';

interface TranscriptViewProps {
  transcript: string;
  interimTranscript?: string;
  isRecording: boolean;
  sessionTitle?: string;
  attendees?: string;
  date?: string;
  onTranscriptChange?: (newTranscript: string) => void;
}

export const TranscriptView = ({
  transcript,
  interimTranscript,
  isRecording,
  sessionTitle,
  attendees,
  date,
  onTranscriptChange,
}: TranscriptViewProps) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState(transcript);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (onTranscriptChange) {
          onTranscriptChange(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveEdit = () => {
    if (onTranscriptChange && editedTranscript !== transcript) {
      onTranscriptChange(editedTranscript);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTranscript(transcript);
    setIsEditing(false);
  };

  const hasContent = transcript.length > 0 || (interimTranscript && interimTranscript.length > 0);

  return (
    <div className="flex flex-col h-full bg-card rounded-xl shadow-card border border-border overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Session Transcription</h3>
          {isRecording && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isRecording && onTranscriptChange && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </>
          )}
          {transcript.length > 0 && !isEditing && (
            <>
              {onTranscriptChange && !isRecording && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
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
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveEdit}
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Transcript Content */}
      <ScrollArea className="flex-1 p-4 sm:p-6">
        {hasContent ? (
          isEditing ? (
            <Textarea
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Edit your transcription..."
            />
          ) : (
            <div className="prose prose-sm max-w-none space-y-4">
              {(sessionTitle || attendees || date) && (
                <div className="border-b border-border pb-4 mb-4">
                  {sessionTitle && (
                    <h2 className="text-xl font-semibold text-foreground mb-2">{sessionTitle}</h2>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {attendees && (
                      <div>
                        <span className="font-medium">Attendees:</span> {attendees}
                      </div>
                    )}
                    {date && (
                      <div>
                        <span className="font-medium">Date:</span> {date}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                {transcript.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
                {interimTranscript && (
                  <span className="text-muted-foreground opacity-70">
                    {interimTranscript}
                  </span>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6 sm:px-8">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden",
              isRecording ? "animate-recording shadow-glow" : ""
            )}>
              <img src={logoImg} alt="Record & Post" className="w-full h-full object-cover" />
            </div>
            <p className="text-muted-foreground px-4">
              {isRecording 
                ? "Listening... Start speaking to see the transcript" 
                : "Click 'Start Session' to begin recording. Your transcript will appear here."}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
