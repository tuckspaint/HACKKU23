import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function VidToText() {
  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles); //might want to make this only accept video files (e.g. mp4)
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
      <button className='dropButton'>Drop your video here!</button>
    </div>
  )
}
