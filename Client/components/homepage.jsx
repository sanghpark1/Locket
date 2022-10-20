import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    let text = '';
 
  const updateText = (e) => {
    text = e.target.value;
    console.log(text);
  };

  const submitEntry = (e) => {
    fetch("/entry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log("Error in login.jsx form submission", err));
  }

    return (
        <div className='homepage'>
            <div className='left-side'></div>

            <div className='main'>
                <header>
                    <h1>Write!</h1>
                </header>
                <input type="text" onChange={updateText} />
                <div>
                    <button onClick={submitEntry} >Submit Today's Entry</button>
                    <button>Clear Entry</button>
                </div>
            </div>

            <div className='right-side'></div>
        </div>
    )
}

export default Homepage;