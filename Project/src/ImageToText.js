import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import './styles/ImageTotext.css'

export default function ImageToText() {
    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles); //might want to make this only accept image files
    }, []);

    const {
    getRootProps,
    getInputProps
    } = useDropzone({
    onDrop
    });

    return (
    <div {...getRootProps()}>
        <p className='title'>Upload file</p>
        <input {...getInputProps()} />
        <button className='dropButton'>Drop your images here!</button>
    </div>
    )
}
