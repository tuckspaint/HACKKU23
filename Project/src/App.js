import './styles/App.css'
import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import NavBar from './NavBar'
import ImageToText from './ImageToText'
import VidToText from './VidToText'

const App = () => {

  return(
      <div>
      <NavBar/>
      <Routes>
        <Route exact path = "/"/>
        <Route exact path = "/ImageToText" element = {<ImageToText/>}/>
        <Route exact path = "/VidToText" element = {<VidToText/>}/>
      </Routes>
      </div>
  )
}

export default App