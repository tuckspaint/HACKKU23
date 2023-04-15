import React from 'react'
import { useState } from 'react';
import './styles/Landing.css'

export default function Landing() {

    const search = (e) => {
        e.preventDefault();
        console.log()
        fetch('http://localhost:3000/chat?q=' + query)
            .then(response => response.text())
            .then(data => console.log(data));
    };

    const [query, setQuery] = React.useState("Differential equations");
    return (
    <div>
        <form onSubmit={search}>
        <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
        />
        <button>Search</button>
        </form>
    </div>
    )
}
