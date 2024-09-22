'use client'
import Image from "next/image";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import InformationBox from "@/components/InfoBoxes/InformationBox";
import Navbar from "@/components/Navbar/page";
import { useState } from "react";
import { generateSlug } from "@/utils/generateSlug";
import { useRouter } from "next/navigation";
import { useNameStore } from "@/store/store";

interface InputForm{
  userName:  string
}


export default function Home() {

  const {setName, name} = useNameStore()
  const router = useRouter()
  
  const handleSessionGenerator = () => {
    const uuid = generateSlug()
    // alert(username + uuid)
    router.push('/conversation')
  }
  return (
    <main className={styles.main}>
      <Navbar />
      <h1 className={styles.main_heading}>Landing Page is currently <span className={styles.main_heading_effect}>under construction 🏗️</span></h1>
      <form className={styles.main_form}>
        <input 
          className={styles.main_form_input} 
          type="text" 
          placeholder="Enter your Username" 
          value={name}
          onChange={(e) => {setName(e.target.value)}}
          required 
          />
        <button onClick={handleSessionGenerator} className={styles.main_form_btn}>Start Temporary Session</button>
      </form>
      <div className={styles.main_info_box_group}>
      <InformationBox text={"Welcome to Vox AI! Our full landing page is currently under construction and will be available soon. We're working hard for it."} />
      <InformationBox text={"You can still try out our voice assistant AI! Generate a temporary ID by clicking the button below. This will give you immediate access to our AI."} />
      <InformationBox text={"Your temporary ID is valid for one session only. For your privacy and security, we won't save any conversation history after your session ends."} />
      </div>
    </main>
  );
}
