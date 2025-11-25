import { useCallback } from 'react';
import { Meeting, GeneratedArticle } from '@/types/meeting';
import { useLocalStorage } from './useLocalStorage';

export const useMeetings = () => {
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>('meetings', []);

  const addMeeting = useCallback((meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
    const newMeeting: Meeting = {
      ...meeting,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setMeetings(prev => [newMeeting, ...prev]);
    return newMeeting;
  }, [setMeetings]);

  const updateMeeting = useCallback((id: string, updates: Partial<Meeting>) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, [setMeetings]);

  const deleteMeeting = useCallback((id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
  }, [setMeetings]);

  const addArticleToMeeting = useCallback((meetingId: string, article: GeneratedArticle) => {
    setMeetings(prev => prev.map(m => 
      m.id === meetingId ? { ...m, article } : m
    ));
  }, [setMeetings]);

  return {
    meetings,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    addArticleToMeeting,
  };
};
