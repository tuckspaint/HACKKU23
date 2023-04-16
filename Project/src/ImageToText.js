import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
//import PhotoCamera from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';
// import './styles/ImageTotext.css'

export default function ImageToText() {

    const [imgPath, setImgPath] = React.useState();
    const [imgLevel, setImgLevel] = React.useState(0);
    const [imgResp, setImgResp] = React.useState("")

    function postImage(level) {
      setImgLevel(level)

      const d = new FormData();
      d.append('file', imgPath.target.files[0])
      console.log(d)

      fetch('http://localhost:3000/image?l=' + imgLevel, {
        method: "POST",  
        body: d
      }).then(res => res.text())
        .then(res => {setImgResp(res)})     
    }

    return (
        <div style={{
            display: 'flex',
            margin: 'auto',
            width: 400,
            flexWrap: 'wrap',
          }}>
            <div style={{ width: '100%', float: 'left' }}></div>
            <input accept="image/*" id="icon-button-file" type="file" name="file" onChange={(e) => setImgPath(e)}/>
            <div className='buttonDiv'>
                <button className='belowButtons' onClick={() => {postImage(0)}}>5 years old</button>
                <button className='belowButtons' onClick={() => {postImage(1)}}>In high school</button>
                <button className='belowButtons' onClick={() => {postImage(2)}}>In college</button>
                <button className='belowButtons' onClick={() => {postImage(3)}}>An expert</button>
            </div>
            <div className='output'>
                {imgResp}
            </div>
          </div>

    )
}
