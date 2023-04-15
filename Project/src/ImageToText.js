import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function ImageToText() {
    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles);
    }, []);

    const {
    getRootProps,
    getInputProps
    } = useDropzone({
    onDrop
    });

    return (
    <div {...getRootProps()}>
        <input {...getInputProps()} />
        <button className='dropButton'>Drop your images here!</button>
    </div>
    )
}
