import React from 'react'
import { useState } from 'react';
import './styles/Landing.css'

export default function Landing() {

    const search = (e) => {
        e.preventDefault();
        console.log(query);
    };

    const [query, setQuery] = React.useState("Differential equations");
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
            <button className='belowButtons'>5 years old</button>
            <button className='belowButtons'>In high school</button>
            <button className='belowButtons'>In college</button>
            <button className='belowButtons'>An expert</button>
        </div>
    </div>
    )
}
