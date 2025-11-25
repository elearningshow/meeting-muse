import { Mic, MicOff, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecordingControlsProps {
  isRecording: boolean;
  duration: number;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const RecordingControls = ({
  isRecording,
  duration,
  isSupported,
  onStart,
  onStop,
}: RecordingControlsProps) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <div className="text-center p-6 bg-destructive/10 rounded-xl border border-destructive/30">
        <MicOff className="h-12 w-12 mx-auto mb-3 text-destructive" />
        <p className="text-destructive font-medium">Speech Recognition Not Supported</p>
        <p className="text-sm text-muted-foreground mt-1">
          Please use a modern browser like Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Recording Indicator */}
      <div className={cn(
        "flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300",
        isRecording 
          ? "bg-destructive/10 border border-destructive/30" 
          : "bg-secondary"
      )}>
        <div className={cn(
          "w-3 h-3 rounded-full transition-all",
          isRecording ? "bg-destructive animate-pulse" : "bg-muted-foreground"
        )} />
        <Clock className="h-5 w-5 text-muted-foreground" />
        <span className={cn(
          "font-mono text-2xl font-semibold tabular-nums",
          isRecording ? "text-destructive" : "text-foreground"
        )}>
          {formatTime(duration)}
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <Button
            onClick={onStart}
            size="lg"
            variant="default"
            className="gap-3 bg-gradient-to-r from-primary to-accent"
          >
            <Mic className="h-6 w-6" />
            Start Meeting
          </Button>
        ) : (
          <Button
            onClick={onStop}
            size="lg"
            variant="destructive"
            className="gap-3 animate-pulse"
          >
            <Square className="h-5 w-5" />
            Stop Meeting
          </Button>
        )}
      </div>

      {/* Status Text */}
      <p className={cn(
        "text-sm transition-all duration-300",
        isRecording ? "text-destructive" : "text-muted-foreground"
      )}>
        {isRecording 
          ? "Recording in progress... Speak clearly into your microphone" 
          : "Click 'Start Meeting' to begin recording and transcription"}
      </p>
    </div>
  );
};
