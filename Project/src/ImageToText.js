import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
//import PhotoCamera from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';
import './styles/ImageTotext.css'

export default function ImageToText() {

    const [ImgQuery, setImgQuery] = React.useState("Differential equations");
    const [imgLevel, setimgLevel] = React.useState(0);
    const [imgResp, setimgResp] = React.useState("")

    const returnExp = (level) => {
        setimgLevel(level)
        console.log(level)
        fetch('http://localhost:3000/chat?q=' + ImgQuery + "&l=" + level)
            .then(response => response.text())
            .then(response => setimgResp(response))
    };

    return (
        <div style={{
            display: 'flex',
            margin: 'auto',
            width: 400,
            flexWrap: 'wrap',
          }}>
            <div style={{ width: '100%', float: 'left' }}>
            </div>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="contained-button-file"
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" component="span">
                Upload
              </Button>
            </label>
            <input accept="image/*" id="icon-button-file"
              type="file" style={{ display: 'none' }} />
            <label htmlFor="icon-button-file">
              <IconButton aria-label="upload picture"
              component="span">
              </IconButton>
            </label>
            <div className='buttonDiv'>
                <button className='belowButtons' onClick={() => {returnExp(0)}}>5 years old</button>
                <button className='belowButtons' onClick={() => {returnExp(1)}}>In high school</button>
                <button className='belowButtons' onClick={() => {returnExp(2)}}>In college</button>
                <button className='belowButtons' onClick={() => {returnExp(3)}}>An expert</button>
            </div>
            <div className='output'>
                {imgResp}
            </div>
          </div>

    )
}
