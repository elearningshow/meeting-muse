import { ArrowLeft, Calendar, Users, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Meeting } from '@/types/meeting';
import { ArticleView } from './ArticleView';
import { TranscriptView } from './TranscriptView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MeetingDetailProps {
  meeting: Meeting;
  onBack: () => void;
  onDelete: (id: string) => void;
  onGenerateArticle: () => void;
  onGenerateImage: () => void;
  isGeneratingImage?: boolean;
}

export const MeetingDetail = ({
  meeting,
  onBack,
  onDelete,
  onGenerateArticle,
  onGenerateImage,
  isGeneratingImage,
}: MeetingDetailProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="flex flex-col h-full animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-lg text-foreground">
              {meeting.title || 'Untitled Meeting'}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(meeting.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(meeting.duration)}
              </span>
              {meeting.participants && (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {meeting.participants}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(meeting.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="transcript" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="article" disabled={!meeting.article}>
              Article {meeting.article && '✓'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transcript" className="flex-1 p-4 overflow-hidden">
            <div className="h-full flex flex-col gap-4">
              <TranscriptView
                transcript={meeting.transcript}
                isRecording={false}
              />
              {!meeting.article && meeting.transcript.length > 50 && (
                <Button variant="default" onClick={onGenerateArticle} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  Generate Article from Transcript
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="article" className="flex-1 p-4 overflow-hidden">
            {meeting.article && (
              <ArticleView
                article={meeting.article}
                onGenerateImage={onGenerateImage}
                isGeneratingImage={isGeneratingImage}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
