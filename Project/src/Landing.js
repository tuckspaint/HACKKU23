import React from 'react'
import { useState } from 'react';
import './styles/Landing.css'

export default function Landing() {

    const search = (e) => {
        e.preventDefault();
        console.log(level)
        fetch('http://localhost:3000/chat?q=' + query + "&l=" + level)
            .then(response => response.text())
            .then(data => console.log(data));
    };

    const [query, setQuery] = React.useState("Differential Equations");
    const [level, setLevel] = React.useState(0);
    return (
    <div>
        <h1 className='headers'>Explain</h1>
        <form onSubmit={search}>
            <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            <button>Search</button>
        </form>
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
