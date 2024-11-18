'use client'
import { FC, useEffect } from 'react'
import styles from "./page.module.css"
import Navbar from '@/components/Navbar/page'
import dynamic from 'next/dynamic'
import Microphone from '@/components/Microphone/Microphone'
import { useStore } from '@/store/store'
import { useAPI } from '@/hooks/useAPI'
import DragnDrop from '@/components/DragnDrop/page'

interface PageProps {
  params: {
    slug: string;
  };
}

const ConversationSlugPage: FC<PageProps> = ({ params }) => {
  const ThreeScene = dynamic(() => import("@/components/model/page"), {
    ssr: false,
  })

  const record = useStore(state => state.record)
  const transcriptText = useStore(state => state.transcriptText)
  const answer = useStore(state => state.answer)
  
  const { isPending, isSuccess, data } = useAPI()

  useEffect(() => {
    if (isSuccess && (data as any)?.answer) {
      console.log("API Response:", (data as any)?.answer)
    }
  }, [isSuccess, data])

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.hero_container}>
        <p className={styles.hero_container_text}>
          {transcriptText}
        </p>
        <p className={styles.hero_container_response}>
          {answer || "What can I help you with ?"}
        </p>
        {!record && !isPending && (
          <div className={styles.hero_box_container}>
            <DragnDrop />
          </div>
        )}
      </div>
      <ThreeScene />
      <Microphone slug={params.slug} />
    </div>
  )
}

export default ConversationSlugPage