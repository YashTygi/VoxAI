import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  record: boolean;
  name: string;
  transcriptText: string;
  base64: string;
  answer: string;
  links: any[];
  imageBase64: string;
  tenthAmplitudeValue: number;
}

interface Actions {
  setRecord: (value: boolean) => void;
  setName: (value: string) => void;
  setTranscriptText: (value: string) => void;
  setBase64: (value: string) => void;
  setAnswer: (value: string) => void;
  setLinks: (value: any[]) => void;
  setImageBase64: (value: string) => void;
  setTenthAmplitudeValue: (value: number) => void;
  reset: () => void;
}

const initialState: State = {
  record: false,
  name: '',
  transcriptText: '',
  base64: '',
  answer: '',
  links: [],
  imageBase64: '',
  tenthAmplitudeValue: 0,
};

export const useStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setRecord: (value) => set({ record: value }),
    setName: (value) => set({ name: value }),
    setTranscriptText: (value) => set({ transcriptText: value }),
    setBase64: (value) => set({ base64: value }),
    setAnswer: (value) => set({ answer: value }),
    setLinks: (value) => set({ links: value }),
    setImageBase64: (value) => set({ imageBase64: value }),
    setTenthAmplitudeValue: (value) => set({ tenthAmplitudeValue: value }),
    reset: () => set(initialState),
  }))
);