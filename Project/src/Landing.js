import React from 'react'
import { useState, useEffect, CSSProperties } from 'react';
import ClipLoader from "react-spinners/ClipLoader"
import './styles/Landing.css'
import { blue } from '@mui/material/colors';

export default function Landing() {

    const [query, setQuery] = React.useState("");
    const [level, setLevel] = React.useState(0);
    const [resp, setResp] = React.useState("")
    const [isPending, setIsPending] = React.useState(false)

    const search = (level) => {
        setIsPending(true)
        setLevel(level)
        console.log(level)
        fetch('http://localhost:3000/chat?q=' + query + "&l=" + level)
            .then(response => response.text())
            .then(response => {
                setResp(response)
                setIsPending(false)
            })
    };

    function likeFunc(likes) {
        console.log(likes)
        fetch('http://localhost:3000/like?q=' + query + "&l=" + level + "&v=" + likes)
            .then(response => console.log(response.text()))

        setResp("")
    }

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
                {resp&&<div className='like-dislike'>
                    <p>Did you like this answer?</p>
                    <button onClick={() => likeFunc(1)}>Yes</button>
                    <button onClick={() => likeFunc(-1)}>No</button>
                </div>}
            </form>
        </div>
        <h1 className='headers'>like I'm...</h1>
        <div className='buttonDiv'>
            <button className='belowButtons' onClick={() => {search(0)}}>5 years old</button>
            <button className='belowButtons' onClick={() => {search(1)}}>In high school</button>
            <button className='belowButtons' onClick={() => {search(2)}}>In college</button>
            <button className='belowButtons' onClick={() => {search(3)}}>An expert</button>
        </div>
        <div className='output'>
            {isPending && <ClipLoader color={blue} loading={isPending} size={50}/>}
            {resp}
        </div>
    </div>
    )
}
