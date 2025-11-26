import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { LLMModel } from '@/types/meeting';

const DEFAULT_MODELS: LLMModel[] = [
  {
    id: 'gemini-flash',
    name: 'Gemini Flash',
    description: 'Fast and efficient for quick article generation',
    size: '~2GB',
    downloaded: true,
    isDefault: true,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Advanced reasoning for detailed articles',
    size: '~4GB',
    downloaded: false,
  },
  {
    id: 'llama-3',
    name: 'Llama 3',
    description: 'Open source model with excellent performance',
    size: '~8GB',
    downloaded: false,
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    description: 'Lightweight but capable local model',
    size: '~4GB',
    downloaded: false,
  },
];

export const useModelSettings = () => {
  const [models, setModels] = useLocalStorage<LLMModel[]>('llm_models', DEFAULT_MODELS);
  const [selectedModelId, setSelectedModelId] = useLocalStorage<string>('selected_model', 'gemini-flash');
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];

  const downloadModel = useCallback(async (modelId: string) => {
    // Simulate download progress
    setDownloadProgress(prev => ({ ...prev, [modelId]: 0 }));
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setDownloadProgress(prev => ({ ...prev, [modelId]: i }));
    }

    setModels(prev => prev.map(m => 
      m.id === modelId ? { ...m, downloaded: true } : m
    ));
    setDownloadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[modelId];
      return newProgress;
    });
  }, [setModels]);

  const selectModel = useCallback((modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model?.downloaded) {
      setSelectedModelId(modelId);
    }
  }, [models, setSelectedModelId]);

  const deleteModel = useCallback((modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model && !model.isDefault) {
      setModels(prev => prev.map(m => 
        m.id === modelId ? { ...m, downloaded: false } : m
      ));
      if (selectedModelId === modelId) {
        setSelectedModelId('gemini-flash');
      }
    }
  }, [models, selectedModelId, setModels, setSelectedModelId]);

  return {
    models,
    selectedModel,
    selectedModelId,
    downloadProgress,
    downloadModel,
    selectModel,
    deleteModel,
  };
};
