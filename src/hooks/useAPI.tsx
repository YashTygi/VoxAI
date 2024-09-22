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
  const response = await axios.post<PostDataResponse>("https://voiceai-v2.onrender.com/text-to-llm", data);
  return response.data;
};

export const useAPI = () => {
  const {base64, setBase64} = useBase64();
  const {setAnswer, setLinks} = useAnswer()

  const createMutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      console.log("Data:", data);
      setAnswer(data?.answer);
      setLinks(data?.links);
      return data;
    },
    onError: error => {
      console.log("Error:", error);
    }
  });

  return createMutation;
};
