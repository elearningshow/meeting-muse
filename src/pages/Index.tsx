import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MeetingForm } from '@/components/MeetingForm';
import { RecordingControls } from '@/components/RecordingControls';
import { TranscriptView } from '@/components/TranscriptView';
import { ArticlePromptForm } from '@/components/ArticlePromptForm';
import { ArticleView } from '@/components/ArticleView';
import { MeetingDetail } from '@/components/MeetingDetail';
import { Onboarding } from '@/components/Onboarding';
import { StorageWarning } from '@/components/StorageWarning';
import { SessionQA } from '@/components/SessionQA';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useStorageStatus } from '@/hooks/useStorageStatus';
import { useMeetings } from '@/hooks/useMeetings';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Meeting, ArticlePrompt, GeneratedArticle, RecordingState } from '@/types/meeting';
import { generateArticle, generateImage } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('onboarding_complete', false);
  
  const [title, setTitle] = useState('');
  const [participants, setParticipants] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showQA, setShowQA] = useState(false);
  
  const [showArticlePrompt, setShowArticlePrompt] = useState(false);
  const [articlePrompt, setArticlePrompt] = useState<ArticlePrompt>({ style: 'professional', tone: 'informative', length: 'medium', audience: '' });
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [pendingTranscript, setPendingTranscript] = useState('');

  const { transcript, interimTranscript, isListening, isSupported, startListening, stopListening, resetTranscript, error: speechError } = useSpeechRecognition();
  const storageStatus = useStorageStatus();
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useMeetings();

  const isRecording = recordingState === 'recording';
  const isActive = recordingState !== 'idle';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingState === 'recording') {
      interval = setInterval(() => setDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [recordingState]);

  useEffect(() => {
    if (speechError && speechError !== 'no-speech') {
      toast({
        title: 'Speech Recognition Error',
        description: `Error: ${speechError}. Please check your microphone permissions.`,
        variant: 'destructive',
      });
    }
  }, [speechError, toast]);

  const handleStartRecording = useCallback(() => {
    if (storageStatus.warning === 'critical') {
      toast({
        title: 'Storage Critical',
        description: 'Not enough storage space to record. Please free up space.',
        variant: 'destructive',
      });
      return;
    }
    resetTranscript();
    setDuration(0);
    setRecordingState('recording');
    setGeneratedArticle(null);
    startListening();
  }, [storageStatus.warning, resetTranscript, startListening, toast]);

  const handlePauseRecording = useCallback(() => {
    setRecordingState('paused');
    stopListening();
  }, [stopListening]);

  const handleResumeRecording = useCallback(() => {
    setRecordingState('recording');
    startListening();
  }, [startListening]);

  const handleStopRecording = useCallback(() => {
    setRecordingState('idle');
    stopListening();
    
    if (transcript.length > 10) {
      setPendingTranscript(transcript);
      setShowArticlePrompt(true);
    } else {
      toast({
        title: 'Recording Too Short',
        description: 'Please record a longer meeting to generate an article.',
      });
    }
  }, [stopListening, transcript, toast]);

  const handleGenerateArticle = useCallback(async () => {
    setIsGeneratingArticle(true);
    try {
      const article = await generateArticle(pendingTranscript || transcript, articlePrompt);
      setGeneratedArticle(article);
      setShowArticlePrompt(false);
      
      addMeeting({
        title: title || 'Untitled Meeting',
        participants,
        date,
        duration,
        transcript: pendingTranscript || transcript,
        article,
      });
      
      toast({
        title: 'Article Generated!',
        description: 'Your meeting has been saved with the generated article.',
      });
      
      setTitle('');
      setParticipants('');
      setDate(new Date().toISOString().split('T')[0]);
      setPendingTranscript('');
      resetTranscript();
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingArticle(false);
    }
  }, [pendingTranscript, transcript, articlePrompt, title, participants, date, duration, addMeeting, toast, resetTranscript]);

  const handleGenerateImage = useCallback(async () => {
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateImage(generatedArticle?.title || '');
      if (generatedArticle) {
        setGeneratedArticle({ ...generatedArticle, generatedImage: imageUrl });
      }
      toast({ title: 'Image Generated!', description: 'Your article graphic has been created.' });
    } catch (error) {
      toast({ title: 'Image Generation Failed', description: 'Failed to generate image. Please try again.', variant: 'destructive' });
    } finally {
      setIsGeneratingImage(false);
    }
  }, [generatedArticle, toast]);

  const handleSelectMeeting = useCallback((meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setSidebarOpen(false);
  }, []);

  const handleNewMeeting = useCallback(() => {
    setSelectedMeeting(null);
    setGeneratedArticle(null);
    setTitle('');
    setParticipants('');
    setDate(new Date().toISOString().split('T')[0]);
    setDuration(0);
    resetTranscript();
    setSidebarOpen(false);
  }, [resetTranscript]);

  const handleDeleteMeeting = useCallback((id: string) => {
    deleteMeeting(id);
    setSelectedMeeting(null);
    toast({ title: 'Meeting Deleted', description: 'The meeting has been removed.' });
  }, [deleteMeeting, toast]);

  const handleRenameMeeting = useCallback((id: string, newTitle: string) => {
    updateMeeting(id, { title: newTitle });
    if (selectedMeeting?.id === id) {
      setSelectedMeeting({ ...selectedMeeting, title: newTitle });
    }
    toast({ title: 'Meeting Renamed', description: 'The meeting title has been updated.' });
  }, [updateMeeting, selectedMeeting, toast]);

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={() => setHasCompletedOnboarding(true)} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        meetings={meetings}
        selectedMeetingId={selectedMeeting?.id}
        onSelectMeeting={handleSelectMeeting}
        onNewMeeting={handleNewMeeting}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-hidden">
          {selectedMeeting ? (
            <MeetingDetail
              meeting={selectedMeeting}
              onBack={() => setSelectedMeeting(null)}
              onDelete={handleDeleteMeeting}
              onRename={handleRenameMeeting}
              onGenerateArticle={() => {
                setPendingTranscript(selectedMeeting.transcript);
                setShowArticlePrompt(true);
              }}
              onGenerateImage={handleGenerateImage}
              isGeneratingImage={isGeneratingImage}
            />
          ) : (
            <div className="h-full overflow-auto p-4 md:p-6 space-y-6">
              {storageStatus.warning !== 'none' && <StorageWarning status={storageStatus} />}

              <MeetingForm
                title={title}
                participants={participants}
                date={date}
                onTitleChange={setTitle}
                onParticipantsChange={setParticipants}
                onDateChange={setDate}
                disabled={isActive}
              />

              <div className="bg-card rounded-xl shadow-card border border-border">
                <RecordingControls
                  recordingState={recordingState}
                  duration={duration}
                  isSupported={isSupported}
                  onStart={handleStartRecording}
                  onPause={handlePauseRecording}
                  onResume={handleResumeRecording}
                  onStop={handleStopRecording}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="min-h-[400px]">
                  <TranscriptView
                    transcript={transcript}
                    interimTranscript={interimTranscript}
                    isRecording={isRecording}
                  />
                </div>

                {generatedArticle && (
                  <div className="min-h-[400px]">
                    <ArticleView
                      article={generatedArticle}
                      onGenerateImage={handleGenerateImage}
                      isGeneratingImage={isGeneratingImage}
                    />
                  </div>
                )}
              </div>

              {/* Q&A Button */}
              {(transcript.length > 0 || pendingTranscript) && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowQA(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Ask Questions About Session
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showArticlePrompt && (
        <ArticlePromptForm
          prompt={articlePrompt}
          onPromptChange={setArticlePrompt}
          onGenerate={handleGenerateArticle}
          onCancel={() => setShowArticlePrompt(false)}
          isGenerating={isGeneratingArticle}
        />
      )}

      <SessionQA
        transcript={pendingTranscript || transcript}
        isOpen={showQA}
        onClose={() => setShowQA(false)}
      />
    </div>
  );
};

export default Index;
