import { FC } from 'react'
import styles from './info.module.css'

interface ConditionInfoProps {
  text:  string
}

const InformationBox: FC<ConditionInfoProps> = ({text}) => {
  return (
  <div className={styles.info_box}>
   {text}
  </div>
)
}

export default InformationBox