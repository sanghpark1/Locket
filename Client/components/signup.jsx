import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';


const Signup = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const nameRef = useRef(null);
  const confirmpwRef = useRef(null);
 
  const postUser = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const confirmpw = confirmpwRef.current.value;
    const name = nameRef.current.value;

    const body = {
      username,
      password,
      name
    };

    if (username !== '' && password !== '' && password === confirmpw) {
      fetch("/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          alert('Account created! Go back to Login');
        })
        .catch((err) => console.log("Error in signup.jsx form submission", err));
    }
    if (password !== confirmpw) console.log('Passwords do not match!');
    
    usernameRef.current.value = "";
    passwordRef.current.value = "";
    nameRef.current.value = "";
    confirmpwRef.current.value = "";
  };

  return (
    <div className='signup'>
      <header>
       <h1>Sign Up</h1>
      </header>
      <div className="box">
        <form onSubmit={postUser} >
            <span>Username: </span>
            <input ref={usernameRef} type='text' name='username' /><br/>
            <span>Name: </span>
            <input ref={nameRef} type='text' name='password' /><br/>
            <span>Password: </span>
            <input ref={passwordRef} type='password' name='password' /><br/>
            <span>Confirm Password: </span>
            <input ref={confirmpwRef} type='password' name='password' /><br/>
            <button>Create Account</button>
        </form>
        <Link to="/">
        <button className='backToLogin'>Take Me Back To Login!</button>
      </Link>
      </div>
    </div>
  )
}

export default Signup;