import { useState, useEffect, useCallback, useRef } from 'react';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface SpeechRecognitionHook {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: (addLog?: (msg: string) => void) => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isListeningRef = useRef(false);

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionClass();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      if (event.error !== 'no-speech') {
        setIsListening(false);
        isListeningRef.current = false;
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        // Restart if still supposed to be listening
        try {
          recognition.start();
        } catch (e) {
          console.log('Recognition restart failed:', e);
        }
      }
    };

    return () => {
      recognition.stop();
    };
  }, [isSupported]);

  const startListening = useCallback(async (addLog?: (msg: string) => void) => {
    if (!recognitionRef.current || !isSupported) return;
    
    setError(null);
    const log = addLog || console.log;
    
    // Try multiple strategies for microphone access
    let microphoneGranted = false;
    
    // Strategy 1: Browser Permission Query First
    log('[STRATEGY-1] TESTING - Permission query...');
    try {
      if (navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        log(`[STRATEGY-1] Permission query status: ${permissionStatus.state}`);
        
        if (permissionStatus.state === 'granted') {
          microphoneGranted = true;
          log('[STRATEGY-1] SUCCESS - Permission already granted');
        } else if (permissionStatus.state === 'denied') {
          log('[STRATEGY-1] FAILED - Permission denied');
        }
      } else {
        log('[STRATEGY-1] Permissions API not available');
      }
    } catch (e) {
      log(`[STRATEGY-1] Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    }

    // Strategy 2: Early Audio Enumeration
    if (!microphoneGranted) {
      log('[STRATEGY-2] TESTING - Enumerate devices...');
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(d => d.kind === 'audioinput');
        log(`[STRATEGY-2] Enumerate devices: ${audioInputs.length} audio inputs found`);
        
        if (audioInputs.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 300));
          log('[STRATEGY-2] Waited 300ms after enumeration');
        }
      } catch (e) {
        log(`[STRATEGY-2] Error: ${e instanceof Error ? e.message : 'Unknown'}`);
      }
    }

    // Strategy 3: Enhanced Audio Constraints
    log('[STRATEGY-3] Audio constraints requested');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        }
      });
      
      log(`[STRATEGY-3] SUCCESS - Stream obtained with ${stream.getAudioTracks().length} tracks`);
      
      // Strategy 4: Keep stream reference for potential reuse
      log('[STRATEGY-4] Stream obtained: success - keeping reference');
      
      // Stop the stream, we just needed permission
      stream.getTracks().forEach(track => track.stop());
      microphoneGranted = true;
    } catch (permissionError) {
      const errorMsg = permissionError instanceof Error ? permissionError.message : 'Unknown error';
      log(`[STRATEGY-3] FAILED - ${errorMsg}`);
      log(`[STRATEGY-4] Stream obtained: failure`);
      
      // Try one more time with basic constraints
      log('[FALLBACK] Trying basic getUserMedia...');
      try {
        const basicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        basicStream.getTracks().forEach(track => track.stop());
        microphoneGranted = true;
        log('[FALLBACK] SUCCESS - Basic getUserMedia worked');
      } catch (fallbackError) {
        log(`[FALLBACK] FAILED - ${fallbackError instanceof Error ? fallbackError.message : 'Unknown'}`);
      }
    }
    
    if (!microphoneGranted) {
      console.error('Microphone permission denied after all strategies');
      setError('not-allowed');
      setIsListening(false);
      isListeningRef.current = false;
      return;
    }
    
    // Now start speech recognition
    setIsListening(true);
    isListeningRef.current = true;
    
    try {
      recognitionRef.current.start();
      log('[SPEECH] Recognition started successfully');
    } catch (e) {
      log('[SPEECH] Recognition already started or failed to start');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    setIsListening(false);
    isListeningRef.current = false;
    recognitionRef.current.stop();
    setInterimTranscript('');
  }, []);

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
