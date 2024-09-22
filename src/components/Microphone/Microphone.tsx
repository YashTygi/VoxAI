import { FC, useEffect, useState, useRef, useCallback } from 'react'
import Mic from '@/assets/icons/Mic'
import styles from './mic.module.css'
import { useRouter } from 'next/navigation'
import { useAmplitudeStore, useAnswer, useBase64, useRecordState, useTranscriptText } from '@/store/store'
import debounce from "lodash.debounce";
import { useAPI } from '@/hooks/useAPI'
import JellyfishSpinner from '@/components/Loader/JellyfishSpinner'

interface micProps {
  slug: string
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
  }
}

/**
 * Renders a microphone component that allows the user to record audio and transcribe it into text.
 *
 * @param {micProps} props - The properties for the microphone component.
 * @param {string} props.slug - The slug used for generating the audio URL.
 * @return {Microphone} The rendered microphone component.
 */

const Microphone: FC<micProps> = ({ slug }) => {

  const { record, changeRecord } = useRecordState()
  const { tenthAmplitudeValue, setTenthAmplitudeValue } = useAmplitudeStore()
  const { transcriptText, setTranscriptText } = useTranscriptText()
  const { base64, setBase64 } = useBase64()
  const { mutate, isError, isSuccess, isPending, data, error } = useAPI()
  const { answer } = useAnswer()

  const router = useRouter();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const transcriptRef = useRef({ value: '' });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [amplitudeData, setAmplitudeData] = useState<Float32Array | null>()
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const base64Audio = data?.audio_bytes;

  //handling Post
  const handlePost = () => {
    mutate({
      question: transcriptRef.current.value,
      user_id: "USER_ID",
      conversation_id: slug,
      image: ""
    });
  };

  //handling Mic and generating slug
  const handleMic = () => {
    changeRecord(true);
  }



  //audio recording and analyser
  useEffect(() => {
    if (record) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const audioContext = new (window.AudioContext)();
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const amplitudeArray = new Float32Array(bufferLength);
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          const updateAudioData = () => {
            analyser.getFloatTimeDomainData(amplitudeArray);
            setAmplitudeData(new Float32Array(amplitudeArray));
            const newValue = Math.abs(Math.round(amplitudeArray[9] * 1000));
            // setAmplitude(new Float32Array(amplitudeArray));
            if (newValue !== tenthAmplitudeValue) {
              setTenthAmplitudeValue(newValue);
            }
            requestAnimationFrame(updateAudioData);
          };

          updateAudioData();

          audioContextRef.current = audioContext;
          analyserRef.current = analyser;
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
        setAmplitudeData(new Float32Array([0]));
      }
    }
  }, [record, amplitudeData, setAmplitudeData, setTenthAmplitudeValue, tenthAmplitudeValue]);

  //speech recognition and transcript
  const handleResult = useCallback((e: any) => {
    let transcript = e.results[0][0].transcript;
    setTranscriptText(transcript);
    transcriptRef.current.value = transcript;
  }, [setTranscriptText]);

  const handleAudioEnd = useCallback(debounce(() => {
    changeRecord(false);
    handlePost();
  }, 300), [changeRecord, handlePost]);
  


  useEffect(() => {
    const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
    recognition.onresult = handleResult;
    recognition.onaudioend = handleAudioEnd;

    if (record) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.abort();
    };
  }, [record, handleResult, handleAudioEnd]);


  useEffect(() => {
    const base64Audio = data?.audio_bytes;
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
  
    const base64ToArrayBuffer = (base64: string) => {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    };
  
    if (base64Audio) {
      const audioBuffer = base64ToArrayBuffer(base64Audio);
      audioContext.decodeAudioData(audioBuffer, (buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
  
        const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);
        setAudioSrc(audioUrl);
  
        const updateAmplitude = () => {
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);
          const tenthValue = dataArray[9];
          setTenthAmplitudeValue(tenthValue);
          requestAnimationFrame(updateAmplitude);
        };
  
        updateAmplitude();
      }, (err) => {
        console.error("Error decoding audio data", err);
      });
    }
  
    return () => {
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
      audioContext.close();
    };
  }, [isSuccess, data, data?.audio_bytes, audioSrc, setTenthAmplitudeValue]);
  


  return (
    <>
      {!isPending && <Mic onClick={handleMic} className={styles.mic} width={100} height={105} />}
      <span className={styles.spinner}>
        <JellyfishSpinner color="#8486F3" size={100} loading={isPending} />
      </span>

      <div>
        {audioSrc && (
          <audio id="audio-player" className={styles.audio} autoPlay controls>
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </>
  )
}

export default Microphone