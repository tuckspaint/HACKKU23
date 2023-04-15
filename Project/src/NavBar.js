
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

    return(
        <div className='navbar'>
            <div className='links'>
                <Button onClick={onClickImage}>ImageToText</Button>
                <Button onClick={onClickVid}>VidToText</Button>
            </div>
        </div>
    )
}
export default NavBar