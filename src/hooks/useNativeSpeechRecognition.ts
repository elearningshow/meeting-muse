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

  // Native speech recognition is always "supported" on native platforms
  const isSupported = true;

  const startListening = useCallback(async (addLog?: (msg: string) => void) => {
    const log = addLog || console.log;
    setError(null);

    try {
      log('[NATIVE] Checking speech recognition availability...');
      
      // Check if speech recognition is available
      const available = await SpeechRecognition.available();
      log(`[NATIVE] Available: ${available.available}`);
      
      if (!available.available) {
        setError('Speech recognition not available on this device');
        return;
      }

      // Request permissions
      log('[NATIVE] Requesting permissions...');
      const permissionStatus = await SpeechRecognition.requestPermissions();
      log(`[NATIVE] Permission status: ${permissionStatus.speechRecognition}`);
      
      if (permissionStatus.speechRecognition !== 'granted') {
        setError('Microphone permission denied');
        return;
      }

      // Set up listener for partial results
      log('[NATIVE] Setting up listener...');
      await SpeechRecognition.addListener('partialResults', (data) => {
        if (data.matches && data.matches.length > 0) {
          const text = data.matches[0];
          log(`[NATIVE] Partial result: ${text.substring(0, 50)}...`);
          setInterimTranscript(text);
        }
      });

      // Start listening
      log('[NATIVE] Starting speech recognition...');
      setIsListening(true);
      isListeningRef.current = true;

      await SpeechRecognition.start({
        language: 'en-US',
        maxResults: 5,
        prompt: 'Speak now...',
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
    try {
      await SpeechRecognition.stop();
      
      // Get the final results
      const results = await SpeechRecognition.getSupportedLanguages();
      console.log('[NATIVE] Stopped listening');
      
      // Move interim to final transcript
      if (interimTranscript) {
        setTranscript(prev => prev + (prev ? ' ' : '') + interimTranscript);
        setInterimTranscript('');
      }
      
      // Remove listeners
      await SpeechRecognition.removeAllListeners();
      
    } catch (err) {
      console.error('[NATIVE] Error stopping:', err);
    } finally {
      setIsListening(false);
      isListeningRef.current = false;
    }
  }, [interimTranscript]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
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
