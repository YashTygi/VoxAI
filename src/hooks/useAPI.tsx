"use client"
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useBase64, useAnswer } from "@/store/store";

interface PostDataResponse {
  answer: string;
  audio_bytes: string;
  links: any;
}

const postData = async (data: { question: string, user_id: string, conversation_id: string, image: string }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
  }
  
  const response = await axios.post<PostDataResponse>(apiUrl, data);
  return response.data;
};

export const useAPI = () => {
  const {base64, setBase64} = useBase64();
  const {setAnswer, setLinks} = useAnswer();

  const createMutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      setAnswer(data?.answer);
      setLinks(data?.links);
      return data;
    },
    onError: (error) => {
      console.error("Error:", error);
    }
  });

  return createMutation;
};