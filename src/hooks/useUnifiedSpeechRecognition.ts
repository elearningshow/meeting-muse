import { useMemo } from 'react';
import { isNativePlatform, getPlatform } from '@/utils/platform';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useNativeSpeechRecognition } from './useNativeSpeechRecognition';

interface UnifiedSpeechRecognitionHook {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: (addLog?: (msg: string) => void) => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
  isNative: boolean;
  platform: string;
}

export const useUnifiedSpeechRecognition = (): UnifiedSpeechRecognitionHook => {
  const isNative = useMemo(() => isNativePlatform(), []);
  const platform = useMemo(() => getPlatform(), []);
  
  // Always call both hooks (React rules), but only use the appropriate one
  const webHook = useSpeechRecognition();
  const nativeHook = useNativeSpeechRecognition();
  
  // Select the appropriate hook based on platform
  const activeHook = isNative ? nativeHook : webHook;

  return {
    ...activeHook,
    isNative,
    platform,
  };
};
