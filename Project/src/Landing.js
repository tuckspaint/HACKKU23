import React from 'react'
import { useState, useEffect, CSSProperties } from 'react';
import ClipLoader from "react-spinners/ClipLoader"
import './styles/Landing.css'
import { blue } from '@mui/material/colors';

export default function Landing() {

    const search = (e) => {
        e.preventDefault();
        console.log(level)
        fetch('http://localhost:3000/chat?q=' + query + "&l=" + level)
            .then(response => response.text())
            .then(response => setResp(response))
    };

    const [query, setQuery] = React.useState("Differential equations");
    const [level, setLevel] = React.useState(0);
    return (
    <div>
        <h1 className='headers'>Explain</h1>
        <div className='searchBar'>
            <form>
                <input
                    autoFocus
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
            </form>
        </div>
        <h1 className='headers'>like I'm...</h1>
        <div className='buttonDiv'>
            <button className='belowButtons' onClick={() => setLevel(0)}>5 years old</button>
            <button className='belowButtons' onClick={() => setLevel(1)}>In high school</button>
            <button className='belowButtons' onClick={() => setLevel(2)}>In college</button>
            <button className='belowButtons' onClick={() => setLevel(3)}>An expert</button>
        </div>
    </div>
    )
}
