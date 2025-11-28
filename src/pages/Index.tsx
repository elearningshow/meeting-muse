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
        description: 'Please record a longer session to generate an article.',
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
        title: title || 'Untitled Session',
        participants,
        date,
        duration,
        transcript: pendingTranscript || transcript,
        article,
      });
      
      toast({
        title: 'Article Generated!',
        description: 'Your session has been saved with the generated article.',
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
      toast({ title: 'Graphic Generated!', description: 'Your session graphic has been created.' });
    } catch (error) {
      toast({ title: 'Graphic Generation Failed', description: 'Failed to generate graphic. Please try again.', variant: 'destructive' });
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
    toast({ title: 'Session Deleted', description: 'The session has been removed.' });
  }, [deleteMeeting, toast]);

  const handleRenameMeeting = useCallback((id: string, newTitle: string) => {
    updateMeeting(id, { title: newTitle });
    if (selectedMeeting?.id === id) {
      setSelectedMeeting({ ...selectedMeeting, title: newTitle });
    }
    toast({ title: 'Session Renamed', description: 'The session title has been updated.' });
  }, [updateMeeting, selectedMeeting, toast]);

  const handleTranscriptChange = useCallback((newTranscript: string) => {
    if (selectedMeeting) {
      updateMeeting(selectedMeeting.id, { transcript: newTranscript });
      setSelectedMeeting({ ...selectedMeeting, transcript: newTranscript });
      toast({ title: 'Transcription Updated', description: 'Your changes have been saved.' });
    }
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
              onTranscriptChange={handleTranscriptChange}
            />
          ) : (
            <div className="h-full overflow-auto p-4 sm:p-6 md:p-8 space-y-6">
              {storageStatus.warning !== 'none' && <StorageWarning status={storageStatus} />}

              {/* Session Form - Full width container */}
              <div className="w-full max-w-6xl mx-auto">
                <MeetingForm
                  title={title}
                  participants={participants}
                  date={date}
                  onTitleChange={setTitle}
                  onParticipantsChange={setParticipants}
                  onDateChange={setDate}
                  disabled={isActive}
                />
              </div>

              {/* Recording Controls - Full width container matching form */}
              <div className="w-full max-w-6xl mx-auto">
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
              </div>

              {/* Transcript and Article - Responsive grid with full-width transcript on desktop */}
              <div className="w-full max-w-6xl mx-auto">
                <div className={`grid gap-6 ${generatedArticle ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                  {/* Live Transcript - Full width when no article */}
                  <div className="min-h-[400px]">
                    <TranscriptView
                      transcript={transcript}
                      interimTranscript={interimTranscript}
                      isRecording={isRecording}
                    />
                  </div>

                  {/* Generated Article */}
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
              </div>

              {/* Q&A Button */}
              {(transcript.length > 0 || pendingTranscript) && (
                <div className="w-full max-w-6xl mx-auto flex justify-center">
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
