import { ArrowLeft, Calendar, Users, Clock, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Meeting } from '@/types/meeting';
import { ArticleView } from './ArticleView';
import { TranscriptView } from './TranscriptView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RenameMeetingDialog } from './RenameMeetingDialog';
import { SessionQA } from './SessionQA';
import { useState } from 'react';

interface MeetingDetailProps {
  meeting: Meeting;
  onBack: () => void;
  onDelete: (id: string) => void;
  onRename?: (id: string, newTitle: string) => void;
  onGenerateArticle: () => void;
  onGenerateImage: () => void;
  isGeneratingImage?: boolean;
  onTranscriptChange?: (newTranscript: string) => void;
}

export const MeetingDetail = ({
  meeting,
  onBack,
  onDelete,
  onRename,
  onGenerateArticle,
  onGenerateImage,
  isGeneratingImage,
  onTranscriptChange,
}: MeetingDetailProps) => {
  const [showQA, setShowQA] = useState(false);

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
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg text-foreground">
                {meeting.title || 'Untitled Session'}
              </h1>
              {onRename && (
                <RenameMeetingDialog
                  currentTitle={meeting.title || 'Untitled Session'}
                  onRename={(newTitle) => onRename(meeting.id, newTitle)}
                />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQA(true)}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Ask About Session</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(meeting.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="transcript" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="transcript">Transcription</TabsTrigger>
            <TabsTrigger value="article" disabled={!meeting.article}>
              Article {meeting.article && '✓'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transcript" className="flex-1 p-4 overflow-hidden">
            <div className="h-full flex flex-col gap-4">
              <TranscriptView
                transcript={meeting.transcript}
                isRecording={false}
                sessionTitle={meeting.title}
                attendees={meeting.participants}
                date={formatDate(meeting.createdAt)}
                onTranscriptChange={onTranscriptChange}
              />
              {!meeting.article && meeting.transcript.length > 50 && (
                <Button variant="default" onClick={onGenerateArticle} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  Generate Article from Transcription
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
                onRegenerate={onGenerateArticle}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Q&A Modal */}
      <SessionQA
        transcript={meeting.transcript}
        isOpen={showQA}
        onClose={() => setShowQA(false)}
      />
    </div>
  );
};
