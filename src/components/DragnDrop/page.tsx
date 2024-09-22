'use client'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './dragndrop.module.css'
import DropPhoto from '@/assets/icons/DropPhoto'
import Image from 'next/image'
import { useAnswer } from '@/store/store'

/**
 * Renders a drag and drop component that allows users to upload images.
 *
 * @return {DragnDrop} The rendered drag and drop component.
 */

function DragnDrop() {
    const [path, setPath] = useState("");
    const [base64, setBase64] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const { answer } = useAnswer()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPath(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    // Function to remove the accepted file
    const removeFile = () => {
        setFile(null);
        setPath("");
        setBase64("");
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: 1024 * 1024 * 5,
        accept: {
            'image/jpeg': [],
            'image/png': [],
        }
    });

    return (
        <>

                <div className={styles.drop_small_container} {...getRootProps()}>
                    {file ? (
                        <div className={styles.drop_accepted_file}>
                            <Image src={path} width={85} height={85} alt="" />
                            <button type="button" className={styles.drop_remove_btn} onClick={removeFile}>Remove</button>
                        </div>
                    ) : (
                        <>
                            <DropPhoto className={styles.drop_photo} stopColor='#4F4F4F' width={85} height={85} />
                            <input {...getInputProps()} />
                            {isDragActive && <DropPhoto className={styles.drop_photo} stopColor='#4F4F4F' width={85} height={85} />}
                        </>
                    )}
                </div>
            
        </>
    )
}

export default DragnDrop
