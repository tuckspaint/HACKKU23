import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import './styles/ImageTotext.css'

export default function ImageToText() {
    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles)
        /*return(
            <>
            <li
                className="file-item"
                key={file.name}>
                <FontAwesomeIcon icon={faFileAlt} />
                <p>{file.name}</p>
                <div className="actions">
                    <div className="loading"></div>
                    {file.isUploading && <FontAwesomeIcon
                        icon={faSpinner} className="fa-spin"
                        onClick={() => deleteFile(file.name)} />
                    }
                    {!file.isUploading &&
                        <FontAwesomeIcon icon={faTrash}
                            onClick={() => deleteFile(file.name)} />
                    }
                </div>
            </li>
        </>
        )*/
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
