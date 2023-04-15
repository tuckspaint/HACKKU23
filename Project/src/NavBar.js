
import {Button} from '@mui/material'
import { useNavigate} from 'react-router-dom'
import './styles/NavBar.css'

const NavBar = () => {
    const history = useNavigate();

    function onClickImage(){
        history('/ImageToText')
    }

    function onClickVid(){
        history('/VidTotext')
    }

    function onClickText(){
        history('/')
    }

    return(
        <div className='navbar'>
            <h1 className='title'>Eli</h1>
            <div className='links'>
                <Button onClick={onClickImage}>Image To Text</Button>
                <Button onClick={onClickVid}>Video To Text</Button>
                <Button onClick={onClickText}>Text To Text</Button>
            </div>
        </div>
    )
}
export default NavBar