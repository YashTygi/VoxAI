'use client'
import { FC, useState, useEffect } from 'react'
import styles from "./page.module.css"
import Navbar from '@/components/Navbar/page'
import dynamic from 'next/dynamic'
import Microphone from '@/components/Microphone/Microphone'
import { useAnswer, useRecordState, useTranscriptText } from '@/store/store'
import { useAPI } from '@/hooks/useAPI'
import DragnDrop from '@/components/DragnDrop/page'

interface PageProps {
  params: {
    slug: string;
  };
}

const Page: FC<PageProps> = ({ params }) => {
  const ThreeScene = dynamic(() => import("@/components/model/page"), {
    ssr: false,
  })

  const { record } = useRecordState()
  const { transcriptText } = useTranscriptText()
  const { isPending, isSuccess, data } = useAPI()
  const { answer } = useAnswer()
  const links = useAnswer((state) => state.links);

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.hero_container}>
        <p className={styles.hero_container_text}>{transcriptText}</p>
        <p className={styles.hero_container_response}>{answer || "What can I help you with ?"}</p>
        {!record && !isPending && <div className={styles.hero_box_container}> <DragnDrop /> </div>}
      </div>
      <ThreeScene />
      <Microphone slug={params.slug} />
    </div>
  )
}

export default Page