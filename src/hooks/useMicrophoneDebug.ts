import { useState, useCallback, useRef, useEffect } from 'react';

interface StrategyStatus {
  strategy1: { status: 'pending' | 'success' | 'failed' | 'testing'; message: string };
  strategy2: { status: 'pending' | 'success' | 'failed' | 'testing'; message: string };
  strategy3: { status: 'pending' | 'success' | 'failed' | 'testing'; message: string };
  strategy4: { status: 'pending' | 'success' | 'failed' | 'testing'; message: string };
}

export const useMicrophoneDebug = () => {
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<string | null>(null);
  const [strategyStatus, setStrategyStatus] = useState<StrategyStatus>({
    strategy1: { status: 'pending', message: '' },
    strategy2: { status: 'pending', message: '' },
    strategy3: { status: 'pending', message: '' },
    strategy4: { status: 'pending', message: '' },
  });
  const persistentStreamRef = useRef<MediaStream | null>(null);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    setLogs(prev => [...prev.slice(-50), logEntry]);
  }, []);

  const updateStrategyStatus = useCallback((
    strategy: keyof StrategyStatus,
    status: 'pending' | 'success' | 'failed' | 'testing',
    message: string
  ) => {
    setStrategyStatus(prev => ({
      ...prev,
      [strategy]: { status, message }
    }));
  }, []);

  // Strategy 1: Browser Permission Query First
  const testStrategy1 = useCallback(async (): Promise<boolean> => {
    addLog('[STRATEGY-1] TESTING - Permission query...');
    setActiveStrategy('Strategy 1: Permission Query');
    updateStrategyStatus('strategy1', 'testing', 'Querying permission...');

    try {
      // Check if permissions API is available
      if (!navigator.permissions) {
        addLog('[STRATEGY-1] FAILED - Permissions API not available');
        updateStrategyStatus('strategy1', 'failed', 'Permissions API not available');
        return false;
      }

      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      addLog(`[STRATEGY-1] Permission query status: ${permissionStatus.state}`);

      if (permissionStatus.state === 'denied') {
        addLog('[STRATEGY-1] FAILED - Permission denied');
        updateStrategyStatus('strategy1', 'failed', `Permission: ${permissionStatus.state}`);
        return false;
      }

      if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
        // Try to get stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        addLog('[STRATEGY-1] SUCCESS - Got microphone access');
        updateStrategyStatus('strategy1', 'success', `Permission: ${permissionStatus.state}`);
        return true;
      }

      addLog('[STRATEGY-1] FAILED - Unknown permission state');
      updateStrategyStatus('strategy1', 'failed', `Unknown state: ${permissionStatus.state}`);
      return false;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addLog(`[STRATEGY-1] FAILED - ${errorMsg}`);
      updateStrategyStatus('strategy1', 'failed', errorMsg);
      return false;
    } finally {
      setActiveStrategy(null);
    }
  }, [addLog, updateStrategyStatus]);

  // Strategy 2: Early Audio Enumeration
  const testStrategy2 = useCallback(async (): Promise<boolean> => {
    addLog('[STRATEGY-2] TESTING - Enumerate devices...');
    setActiveStrategy('Strategy 2: Early Enumeration');
    updateStrategyStatus('strategy2', 'testing', 'Enumerating devices...');

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(d => d.kind === 'audioinput');
      addLog(`[STRATEGY-2] Enumerate devices: ${audioInputs.length} audio inputs found`);

      if (audioInputs.length === 0) {
        addLog('[STRATEGY-2] FAILED - No audio inputs found');
        updateStrategyStatus('strategy2', 'failed', 'No audio inputs found');
        return false;
      }

      // Wait 300ms as per strategy
      await new Promise(resolve => setTimeout(resolve, 300));
      addLog('[STRATEGY-2] Waited 300ms, requesting getUserMedia...');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      addLog('[STRATEGY-2] SUCCESS - Got microphone access after enumeration');
      updateStrategyStatus('strategy2', 'success', `${audioInputs.length} devices found`);
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addLog(`[STRATEGY-2] FAILED - ${errorMsg}`);
      updateStrategyStatus('strategy2', 'failed', errorMsg);
      return false;
    } finally {
      setActiveStrategy(null);
    }
  }, [addLog, updateStrategyStatus]);

  // Strategy 3: Enhanced Audio Constraints
  const testStrategy3 = useCallback(async (): Promise<boolean> => {
    addLog('[STRATEGY-3] TESTING - Enhanced audio constraints...');
    setActiveStrategy('Strategy 3: Enhanced Constraints');
    updateStrategyStatus('strategy3', 'testing', 'Requesting with constraints...');

    try {
      addLog('[STRATEGY-3] Audio constraints requested');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        }
      });
      
      const track = stream.getAudioTracks()[0];
      const settings = track.getSettings();
      addLog(`[STRATEGY-3] Track settings: sampleRate=${settings.sampleRate}, echoCancellation=${settings.echoCancellation}`);
      
      stream.getTracks().forEach(t => t.stop());
      addLog('[STRATEGY-3] SUCCESS - Got microphone with enhanced constraints');
      updateStrategyStatus('strategy3', 'success', 'Enhanced constraints accepted');
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addLog(`[STRATEGY-3] FAILED - ${errorMsg}`);
      updateStrategyStatus('strategy3', 'failed', errorMsg);
      return false;
    } finally {
      setActiveStrategy(null);
    }
  }, [addLog, updateStrategyStatus]);

  // Strategy 4: Persistent getUserMedia Hold
  const testStrategy4 = useCallback(async (): Promise<boolean> => {
    addLog('[STRATEGY-4] TESTING - Persistent stream hold...');
    setActiveStrategy('Strategy 4: Persistent Stream');
    updateStrategyStatus('strategy4', 'testing', 'Requesting persistent stream...');

    try {
      // Close any existing stream first
      if (persistentStreamRef.current) {
        persistentStreamRef.current.getTracks().forEach(track => track.stop());
        persistentStreamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      persistentStreamRef.current = stream;
      
      addLog(`[STRATEGY-4] Stream obtained: success (${stream.getAudioTracks().length} tracks)`);
      addLog('[STRATEGY-4] SUCCESS - Persistent stream held open');
      updateStrategyStatus('strategy4', 'success', 'Stream held open');
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addLog(`[STRATEGY-4] Stream obtained: failure - ${errorMsg}`);
      updateStrategyStatus('strategy4', 'failed', errorMsg);
      return false;
    } finally {
      setActiveStrategy(null);
    }
  }, [addLog, updateStrategyStatus]);

  const testAllStrategies = useCallback(async () => {
    addLog('=== TESTING ALL STRATEGIES ===');
    
    // Reset all statuses
    setStrategyStatus({
      strategy1: { status: 'pending', message: '' },
      strategy2: { status: 'pending', message: '' },
      strategy3: { status: 'pending', message: '' },
      strategy4: { status: 'pending', message: '' },
    });

    const results = {
      strategy1: await testStrategy1(),
      strategy2: await testStrategy2(),
      strategy3: await testStrategy3(),
      strategy4: await testStrategy4(),
    };

    const successfulStrategies = Object.entries(results)
      .filter(([_, success]) => success)
      .map(([name]) => name);

    if (successfulStrategies.length > 0) {
      addLog(`=== WORKING STRATEGIES: ${successfulStrategies.join(', ')} ===`);
    } else {
      addLog('=== ALL STRATEGIES FAILED ===');
    }

    return results;
  }, [testStrategy1, testStrategy2, testStrategy3, testStrategy4, addLog]);

  const testStrategy = useCallback(async (strategyNumber: number) => {
    switch (strategyNumber) {
      case 1:
        return testStrategy1();
      case 2:
        return testStrategy2();
      case 3:
        return testStrategy3();
      case 4:
        return testStrategy4();
      default:
        return false;
    }
  }, [testStrategy1, testStrategy2, testStrategy3, testStrategy4]);

  // Get microphone using the best working strategy
  const getMicrophoneAccess = useCallback(async (): Promise<MediaStream | null> => {
    addLog('=== ATTEMPTING MICROPHONE ACCESS ===');

    // Try Strategy 4 first (persistent stream) if already held
    if (persistentStreamRef.current && persistentStreamRef.current.active) {
      addLog('Using existing persistent stream (Strategy 4)');
      return persistentStreamRef.current;
    }

    // Try each strategy in order until one works
    const strategies = [
      { name: 'Strategy 1', test: testStrategy1 },
      { name: 'Strategy 2', test: testStrategy2 },
      { name: 'Strategy 3', test: testStrategy3 },
      { name: 'Strategy 4', test: testStrategy4 },
    ];

    for (const strategy of strategies) {
      addLog(`Attempting ${strategy.name}...`);
      const success = await strategy.test();
      if (success) {
        // Now actually get the stream
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          addLog(`${strategy.name} succeeded - returning stream`);
          return stream;
        } catch (e) {
          addLog(`${strategy.name} test passed but failed to get stream`);
        }
      }
    }

    addLog('All strategies failed to get microphone access');
    return null;
  }, [testStrategy1, testStrategy2, testStrategy3, testStrategy4, addLog]);

  // Cleanup persistent stream on unmount
  useEffect(() => {
    return () => {
      if (persistentStreamRef.current) {
        persistentStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const allStrategiesFailed = 
    strategyStatus.strategy1.status === 'failed' &&
    strategyStatus.strategy2.status === 'failed' &&
    strategyStatus.strategy3.status === 'failed' &&
    strategyStatus.strategy4.status === 'failed';

  return {
    debugEnabled,
    setDebugEnabled,
    logs,
    activeStrategy,
    strategyStatus,
    testStrategy,
    testAllStrategies,
    getMicrophoneAccess,
    allStrategiesFailed,
    addLog,
  };
};
