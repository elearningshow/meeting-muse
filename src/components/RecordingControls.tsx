import { Play, Pause, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RecordingState } from '@/types/meeting';
import logoImg from '@/assets/logo.jpg';

interface RecordingControlsProps {
  recordingState: RecordingState;
  duration: number;
  isSupported: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const RecordingControls = ({
  recordingState,
  duration,
  isSupported,
  onStart,
  onPause,
  onResume,
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

  const isRecording = recordingState === 'recording';
  const isPaused = recordingState === 'paused';
  const isIdle = recordingState === 'idle';

  if (!isSupported) {
    return (
      <div className="text-center p-6 px-6 bg-destructive/10 rounded-xl border border-destructive/30">
        <img src={logoImg} alt="Record & Post" className="h-16 w-16 mx-auto mb-3 rounded-xl opacity-50" />
        <p className="text-destructive font-medium">Speech Recognition Not Supported</p>
        <p className="text-sm text-muted-foreground mt-1">Please use Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-6 sm:px-8">
      {/* Logo Icon */}
      <div className={cn(
        "w-20 h-20 rounded-2xl overflow-hidden shadow-elevated transition-all duration-300",
        isRecording && "animate-recording shadow-glow"
      )}>
        <img src={logoImg} alt="Record & Post" className="w-full h-full object-cover" />
      </div>

      {/* Recording Indicator */}
      <div className={cn(
        "flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300",
        isRecording ? "bg-accent/10 border border-accent/30" 
          : isPaused ? "bg-primary/10 border border-primary/30" 
          : "bg-secondary"
      )}>
        <div className={cn(
          "w-3 h-3 rounded-full transition-all",
          isRecording ? "bg-accent animate-pulse" : isPaused ? "bg-primary" : "bg-muted-foreground"
        )} />
        <Clock className="h-5 w-5 text-muted-foreground" />
        <span className={cn(
          "font-mono text-2xl font-semibold tabular-nums",
          isRecording ? "text-accent" : isPaused ? "text-primary" : "text-foreground"
        )}>
          {formatTime(duration)}
        </span>
        {isPaused && <span className="text-sm text-primary font-medium">PAUSED</span>}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4">
        {isIdle ? (
          <Button
            onClick={onStart}
            size="lg"
            className="gap-3 gradient-hero text-primary-foreground hover:opacity-90"
          >
            <Play className="h-5 w-5" />
            Start Session
          </Button>
        ) : (
          <>
            <Button
              onClick={isRecording ? onPause : onResume}
              size="lg"
              variant={isRecording ? "outline" : "default"}
              className={cn(
                "gap-3",
                isRecording 
                  ? "border-accent text-accent hover:bg-accent/10" 
                  : "gradient-hero text-primary-foreground"
              )}
            >
              {isRecording ? (
                <><Pause className="h-5 w-5" />Pause</>
              ) : (
                <><Play className="h-5 w-5" />Resume</>
              )}
            </Button>
            <Button
              onClick={onStop}
              size="lg"
              variant="destructive"
              className="gap-3"
            >
              <Square className="h-4 w-4" />
              Stop Session
            </Button>
          </>
        )}
      </div>

      {/* Status Text */}
      <p className={cn(
        "text-sm text-center px-6 sm:px-8 transition-all duration-300 max-w-md",
        isRecording ? "text-accent" : isPaused ? "text-primary" : "text-muted-foreground"
      )}>
        {isRecording 
          ? "Recording in progress... Recording continues in background until stopped." 
          : isPaused 
          ? "Recording paused. Press Resume to continue or Stop to finish."
          : "Click 'Start Session' to begin recording and transcription"}
      </p>
    </div>
  );
};
