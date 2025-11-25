import { useState, useEffect, useCallback } from 'react';
import { StorageStatus } from '@/types/meeting';

export const useStorageStatus = (): StorageStatus => {
  const [status, setStatus] = useState<StorageStatus>({
    used: 0,
    total: 0,
    free: 0,
    warning: 'none',
  });

  const checkStorage = useCallback(async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const total = estimate.quota || 0;
        const free = total - used;
        const freeMB = free / (1024 * 1024);

        let warning: StorageStatus['warning'] = 'none';
        if (freeMB < 50) {
          warning = 'critical';
        } else if (freeMB < 100) {
          warning = 'low';
        }

        setStatus({ used, total, free, warning });
      }
    } catch (error) {
      console.error('Error checking storage:', error);
    }
  }, []);

  useEffect(() => {
    checkStorage();
    const interval = setInterval(checkStorage, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [checkStorage]);

  return status;
};
