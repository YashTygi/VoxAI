import { FC, useEffect, useState } from 'react'
import styles from "./navbar.module.css"
import { usePathname } from 'next/navigation'

interface NavbarProps {
  
}

const Navbar: FC<NavbarProps> = ({}) => {
   const [showHistory, setShowHistory] = useState<boolean>()
   const pathname = usePathname()
   const validPathname = "/conversation"

   useEffect(() => {
     if(pathname === validPathname) {
      setShowHistory(true)
     }
     else{
      setShowHistory(false)
     }
   }, [pathname])
  return (
     <div className={styles.nav}>
        <div className={styles.logo}>Vox AI</div>
       {showHistory && <button type='button' className={styles.conversation_btn}>Conversation History</button>}
     </div>
    )
}

export default Navbar