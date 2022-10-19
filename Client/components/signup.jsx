import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';


const Signup = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
 
  const postUser = e => {
      e.preventDefault();
      console.log('username: ', usernameRef.current.value);
      console.log('password: ', passwordRef.current.value);
      const body = {
        username: usernameRef.current.value,
        password: passwordRef.current.value
      };

      fetch('/userlist/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      })
      .then(res => res.json())
      .then(data => {
          console.log(data)
        })
        .catch(err => console.log('Error in signup.jsx form submission', err))
       }

  return (
    <div className='signup'>
      <header>
       <h1>Sign Up</h1>
      </header>
        <form onSubmit={postUser} >
            <span>Username: </span>
            <input ref={usernameRef} type='text' name='username' /><br/>
            <span>Password: </span>
            <input ref={passwordRef} type='password' name='password' /><br/>
            <button>Create Account</button>
        </form>
        <Link to="/">
        <button>Take Me Back To Login!</button>
      </Link>
    </div>
  )
}

export default Signup;