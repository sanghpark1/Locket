import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
 
  return (
    <div className="login">
      <header>
      <h1>Log In</h1>
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("username: ", usernameRef.current.value);
          console.log("password: ", passwordRef.current.value);
        }}
      >
        <span>Username: </span>
        <input ref={usernameRef} type="text" />
        <br />
        <span>Password: </span>
        <input ref={passwordRef} type="password" />
        <br />
        <button>Sign In</button>
      </form>
      <Link to="/signup">
        <button>I Want To Sign Up!</button>
      </Link>
    </div>
  );
}

export default Login;