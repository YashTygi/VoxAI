export interface WorkerMessage {
    type: 'API_REQUEST';
    payload: {
      question: string;
      user_id: string;
      conversation_id: string;
      image: string;
    };
    apiUrl: string;
  }
  
  export interface WorkerResponse {
    type: 'API_SUCCESS' | 'API_ERROR';
    payload: any;
  }
  
  self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
    if (event.data.type === 'API_REQUEST') {
      try {
        const response = await fetch(event.data.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event.data.payload),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        self.postMessage({
          type: 'API_SUCCESS',
          payload: data,
        } as WorkerResponse);
      } catch (error) {
        self.postMessage({
          type: 'API_ERROR',
          payload: error instanceof Error ? error.message : 'Unknown error occurred',
        } as WorkerResponse);
      }
    }
  });