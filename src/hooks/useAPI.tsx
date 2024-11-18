import { useMutation } from '@tanstack/react-query';
import { useStore } from '@/store/store';

let worker: Worker | null = null;

if (typeof window !== 'undefined') {
  worker = new Worker(new URL('../utils/apiWorker.ts', import.meta.url));
}

interface PostDataParams {
  question: string;
  user_id: string;
  conversation_id: string;
  image: string;
}

export const useAPI = () => {
  const { setAnswer, setLinks } = useStore();

  return useMutation({
    mutationFn: async (data: PostDataParams) => {
      return new Promise((resolve, reject) => {
        if (!worker) {
          reject(new Error('Web Worker not available'));
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          reject(new Error('NEXT_PUBLIC_API_URL environment variable is not set'));
          return;
        }

        worker.onmessage = (event) => {
          if (event.data.type === 'API_SUCCESS') {
            resolve(event.data.payload);
          } else if (event.data.type === 'API_ERROR') {
            reject(new Error(event.data.payload));
          }
        };

        worker.postMessage({
          type: 'API_REQUEST',
          payload: data,
          apiUrl,
        });
      });
    },
    onSuccess: (data: any) => {
      setAnswer(data.answer ?? '');
      setLinks(data.links ?? []);
      return data;
    },
    onError: (error) => {
      console.error('API Error:', error);
    },
  });
};