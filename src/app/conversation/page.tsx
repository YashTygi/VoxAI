'use client'
import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";
import Navbar from '@/components/Navbar/page';
import InformationBox from '@/components/InfoBoxes/InformationBox';
import { generateSlug } from '@/utils/generateSlug';
import { useNameStore } from "@/store/store";

const page: FC = () => {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    const { name } = useNameStore();

    const handleClick = () => {
        if (isNavigating) return; 
        setIsNavigating(true);
        
        const slug = generateSlug();
        router.push(`/conversation/${slug}`);
    }

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.hero_container}>
                <h1 className={styles.hero_container_header}>Hello, {name}</h1>
                <p className={styles.hero_container_text}>Let's start a conversation</p>
                <div className={styles.hero_box_container}>
                    <InformationBox text={"Our AI strives for accuracy, responses may contains error, verify information before use. We are not responsible for errors."} />
                    <InformationBox text={"Interact with our advanced AI assistant using voice commands or by uploading images for instant analysis and detailed insights."} />
                    <InformationBox text={"It might take some time to process your first request as it takes some time to active the deployed backend."} />
                </div>
            </div>
            <button 
                type='button' 
                onClick={handleClick} 
                className={styles.conversation_btn}
                disabled={isNavigating} 
            >
                Start Conversation
            </button>
        </div>
    )
}

export default page;