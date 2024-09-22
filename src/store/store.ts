import { create } from 'zustand'

type RecordStore = {
    record: boolean,
    changeRecord: (record: boolean) => void
}

type NameStore = {
    name: string,
    setName: (name: string) => void
}



type TranscriptStore = {
    transcriptText: string,
    setTranscriptText: (transcriptText: string) => void
}

type Base64Store = {
    base64: string,
    setBase64: (base64: string) => void
}

type AnswerStore = {
    answer: string,
    setAnswer: (answer: string) => void,
    links: [], // Assuming links are strings, adjust type as needed
    setLinks: (links: []) => void
}

type ImageBase64Store = {
    imageBase64: string,
    setImageBase64: (imageBase64: string) => void
}

type AmplitudeStore = {
    tenthAmplitudeValue: number,
    setTenthAmplitudeValue: (amplitude: number) => void
}


export const useNameStore = create<NameStore>((set) => ({
    name: '',
    setName: (newName) => {
        set({ name: newName })
    }
}))

export const useAmplitudeStore = create<AmplitudeStore>((set) => ({
    tenthAmplitudeValue: 0,
    setTenthAmplitudeValue: (newAmplitude) => {
        set({ tenthAmplitudeValue: newAmplitude })
    }
}))

export const useRecordState = create<RecordStore>((set) => ({
    record: false,
    changeRecord: (newRecord) => {
        set({ record: newRecord })
    }
}))



export const useTranscriptText = create<TranscriptStore>((set) => ({
    transcriptText: '',
    setTranscriptText: (newTranscriptText) => {
        set({ transcriptText: newTranscriptText });
    }
}))

export const useBase64 = create<Base64Store>((set) => ({
    base64: '',
    setBase64: (newBase64: string) => {
        set({ base64: newBase64 });
    }
}))

export const useImageBase64 = create<ImageBase64Store>((set) => ({
    imageBase64: '',
    setImageBase64: (newImageBase64: string) => {
        set({ imageBase64: newImageBase64 });
    }
}))

export const useAnswer = create<AnswerStore>((set) => ({
    answer: '',
    setAnswer: (newAnswer: string) => {
        set({ answer: newAnswer });
    },
    links: [],
    setLinks: (links) => set({ links }),
}))
