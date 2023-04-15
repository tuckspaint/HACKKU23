import React from 'react'
import { useState, useEffect, CSSProperties } from 'react';
import ClipLoader from "react-spinners/ClipLoader"
import './styles/Landing.css'
import { blue } from '@mui/material/colors';

export default function Landing() {

    const [query, setQuery] = React.useState("");
    const [resp, setResp] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const search = async (e) => {
        e.preventDefault()
        /*setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 3000)*/
        fetch('http://localhost:3000/chat?q=' + query)
            .then(response => response.text())
            .then(response => setResp(response))
    };

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
            <button onClick = {search} className='belowButtons'>5 years old</button>
            <button onClick = {search} className='belowButtons'>In high school</button>
            <button onClick = {search} className='belowButtons'>In college</button>
            <button onClick = {search} className='belowButtons'>An expert</button>
        </div>
        <div className='output'>
        {loading ? <ClipLoader
               color={blue}
               loading={loading}
               size={100}
           /> : resp  
            }
        </div>
    </div>
    )
}
