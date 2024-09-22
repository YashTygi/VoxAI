'use client'
import Image from "next/image";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import InformationBox from "@/components/InfoBoxes/InformationBox";
import Navbar from "@/components/Navbar/page";
import { useState, useEffect } from "react";
import { generateSlug } from "@/utils/generateSlug";
import { useRouter } from "next/navigation";
import { useNameStore } from "@/store/store";

export default function Home() {
  const { setName, name } = useNameStore()
  const router = useRouter()
  const [localName, setLocalName] = useState("")
  
  useEffect(() => {
    if (name) {
      setLocalName(name)

    }
  }, [name])

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleInputChange = (e: any) => {
    setLocalName(e.target.value)
  }

  const handleSessionGenerator = (e: any) => {
    e.preventDefault()
    if (localName.trim()) {
      const capitalizedName = capitalizeFirstLetter(localName.trim())
      setName(capitalizedName)
      router.push('/conversation')
    } else {
      alert("Please enter a name before starting the session.")
    }
  }

  return (
    <main className={styles.main}>
      <Navbar />
      <h1 className={styles.main_heading}>Landing Page is currently <span className={styles.main_heading_effect}>under construction 🏗️</span></h1>
      <form className={styles.main_form} onSubmit={handleSessionGenerator}>
        <input 
          className={styles.main_form_input} 
          type="text" 
          placeholder="Enter your Username" 
          value={localName}
          onChange={handleInputChange}
          required 
        />
        <button type="submit" className={styles.main_form_btn}>Start Temporary Session</button>
      </form>
      <div className={styles.main_info_box_group}>
        <InformationBox text={"Welcome to Vox AI! Our full landing page is currently under construction and will be available soon. We're working hard for it."} />
        <InformationBox text={"You can still try out our voice assistant AI! Generate a temporary ID by clicking the button below. This will give you immediate access to our AI."} />
        <InformationBox text={"Your temporary ID is valid for one session only. For your privacy and security, we won't save any conversation history after your session ends."} />
      </div>
    </main>
  );
}