import { FC, useEffect, useState, useRef, useCallback } from 'react'
import Mic from '@/assets/icons/Mic'
import styles from './mic.module.css'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/store'
import debounce from "lodash.debounce";
import { useAPI } from '@/hooks/useAPI'
import { JellyfishSpinner } from 'react-spinners-kit'

interface micProps {
  slug: string
}

interface APIResponse {
  audio_bytes: string;

}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
  }
}

const Microphone: FC<micProps> = ({slug}) => {

  const {record, setRecord} = useStore()
  const {tenthAmplitudeValue, setTenthAmplitudeValue} = useStore()
  const {transcriptText, setTranscriptText} = useStore()
  const {base64, setBase64} = useStore()
  const {mutate, isError, isSuccess, isPending, data, error} = useAPI()
  const {answer} = useStore()
  
  const router = useRouter();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const transcriptRef = useRef({ value: '' }); 
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [amplitudeData, setAmplitudeData] = useState<Float32Array | null>()
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // const base64Audio = data?.audio_bytes;

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
  const handleMic = ()  => {
    setRecord(true);
    
    console.log(record)
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
              // console.log("10th Amplitude Value:", newValue);
          }
            // console.log("amplitudeArray", typeof amplitudeArray, amplitudeArray);
            // console.log("amplitudeData", amplitudeData);
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
    }, [record, amplitudeData, setAmplitudeData])

    //speech recognition and transcript
    const handleResult = useCallback((e: any) => {
      console.log("e", e)
      let transcript = e.results[0][0].transcript;
      console.log("transcript", transcript);
      setTranscriptText(transcript);
      transcriptRef.current.value = transcript;
      console.log("transcriptText", transcriptText);
    }, [transcriptText, setTranscriptText]);



    
  
    const handleAudioEnd = useCallback(debounce(() => {
      setRecord(false);
      handlePost();

      
      // createMutation.mutate({
      //   text: transcriptText})
    }, 300), [transcriptText, setRecord, mutate, data]);


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

    //base64
    useEffect(() => {
      if (isSuccess){
        console.log("type", typeof data)
      }
    }, [data, isSuccess])

    //audio

    // useEffect(() => {
    //   // Function to convert base64 to a Blob
    //   const base64Audio = data?.audio_bytes;
    //   const base64ToBlob = (base64: string, mimeType: string) => {
    //     const byteCharacters = atob(base64);
    //     const byteArrays = [];
    //     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    //       const slice = byteCharacters.slice(offset, offset + 512);
    //       const byteNumbers = new Array(slice.length);
    //       for (let i = 0; i < slice.length; i++) {
    //         byteNumbers[i] = slice.charCodeAt(i);
    //       }
    //       const byteArray = new Uint8Array(byteNumbers);
    //       byteArrays.push(byteArray);
    //     }
    //     return new Blob(byteArrays, { type: mimeType });
    //   };
  
    //   if (base64Audio) {
    //     const mimeType = 'audio/mpeg'; 
    //     const audioBlob = base64ToBlob(base64Audio, mimeType);
    //     const audioUrl = URL.createObjectURL(audioBlob);
    //     setAudioSrc(audioUrl);
    //   }
  
    //   // Cleanup function to revoke the object URL
    //   return () => {
    //     if (audioSrc) {
    //       URL.revokeObjectURL(audioSrc);
    //     }
    //   };
    // }, [isSuccess,data, data?.audio_bytes]);

    
    // useEffect(() => {
    //   console.log("createMutation data:", data?.answer);
    // }, [isSuccess, data]);

    useEffect(() => {
      const base64Audio = (data as any)?.audio_bytes;
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
          
          // Create and set audio element src
          const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(blob);
          setAudioSrc(audioUrl);
    
          // Start playing
          source.start(0);
    
          // Function to update amplitude data
          const updateAmplitude = () => {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            // Get the 10th value (or adjust as needed)
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
    }, [isSuccess, data, (data as any)?.audio_bytes]);
  
    
  return (
    <>
      {!isPending && <Mic onClick={handleMic} className={styles.mic} width={100} height={105} />}
      <span className={styles.spinner}><JellyfishSpinner color="#8486F3" size={100} loading={isPending} /></span>

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