import { useState, useCallback, useRef } from 'react';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

interface NativeSpeechRecognitionHook {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: (addLog?: (msg: string) => void) => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export const useNativeSpeechRecognition = (): NativeSpeechRecognitionHook => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isListeningRef = useRef(false);
  
  // Track the last finalized segment to prevent duplicates
  const lastFinalizedRef = useRef('');
  const pendingTextRef = useRef('');

  const isSupported = true;

  const startListening = useCallback(async (addLog?: (msg: string) => void) => {
    const log = addLog || console.log;
    setError(null);

    try {
      // Remove any existing listeners first to prevent duplicates
      await SpeechRecognition.removeAllListeners();
      
      log('[NATIVE] Checking speech recognition availability...');
      
      const available = await SpeechRecognition.available();
      log(`[NATIVE] Available: ${available.available}`);
      
      if (!available.available) {
        setError('Speech recognition not available on this device');
        return;
      }

      log('[NATIVE] Requesting permissions...');
      const permissionStatus = await SpeechRecognition.requestPermissions();
      log(`[NATIVE] Permission status: ${permissionStatus.speechRecognition}`);
      
      if (permissionStatus.speechRecognition !== 'granted') {
        setError('Microphone permission denied');
        return;
      }

      // Reset tracking refs
      lastFinalizedRef.current = '';
      pendingTextRef.current = '';

      log('[NATIVE] Setting up listener...');
      
      // Listen for partial results - these are interim and will be refined
      await SpeechRecognition.addListener('partialResults', (data) => {
        if (data.matches && data.matches.length > 0) {
          const text = data.matches[0].trim();
          
          if (!text) return;
          
          log(`[NATIVE] Partial: "${text.substring(0, 30)}..."`);
          
          // Store as pending and show as interim only
          pendingTextRef.current = text;
          setInterimTranscript(text);
        }
      });

      // Listen for when recognition stops (end of utterance on Android)
      await SpeechRecognition.addListener('listeningState', (state) => {
        log(`[NATIVE] Listening state: ${JSON.stringify(state)}`);
        
        // When listening stops, finalize the pending text if we have any
        if (state.status === 'stopped' && pendingTextRef.current) {
          const newText = pendingTextRef.current;
          
          // Only add if it's different from what we last finalized
          if (newText !== lastFinalizedRef.current) {
            log(`[NATIVE] Finalizing: "${newText.substring(0, 30)}..."`);
            lastFinalizedRef.current = newText;
            
            setTranscript(prev => {
              const separator = prev ? ' ' : '';
              return prev + separator + newText;
            });
            setInterimTranscript('');
            pendingTextRef.current = '';
          }
          
          // Auto-restart if we're still supposed to be listening
          if (isListeningRef.current) {
            log('[NATIVE] Auto-restarting recognition...');
            SpeechRecognition.start({
              language: 'en-US',
              maxResults: 1,
              partialResults: true,
              popup: false,
            }).catch(err => {
              log(`[NATIVE] Restart error: ${err.message}`);
            });
          }
        }
      });

      log('[NATIVE] Starting speech recognition...');
      setIsListening(true);
      isListeningRef.current = true;

      await SpeechRecognition.start({
        language: 'en-US',
        maxResults: 1,
        partialResults: true,
        popup: false,
      });

      log('[NATIVE] Speech recognition started successfully');

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      log(`[NATIVE] Error: ${errorMsg}`);
      setError(errorMsg);
      setIsListening(false);
      isListeningRef.current = false;
    }
  }, []);

  const stopListening = useCallback(async () => {
    isListeningRef.current = false;
    
    try {
      await SpeechRecognition.stop();
      console.log('[NATIVE] Stopped listening');
      
      // Finalize any pending text
      if (pendingTextRef.current && pendingTextRef.current !== lastFinalizedRef.current) {
        const finalText = pendingTextRef.current;
        setTranscript(prev => prev + (prev ? ' ' : '') + finalText);
      }
      
      setInterimTranscript('');
      pendingTextRef.current = '';
      
      await SpeechRecognition.removeAllListeners();
      
    } catch (err) {
      console.error('[NATIVE] Error stopping:', err);
    } finally {
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    lastFinalizedRef.current = '';
    pendingTextRef.current = '';
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
};
