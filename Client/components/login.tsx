import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState({
    loggedIn: false,
  });
  // @ts-ignore
  const { loggedIn } = state;
  const navigate = useNavigate();
  const usernameRef = useRef(null), passwordRef = useRef(null);
  
  useEffect(() => {
    const checkLogStatus = async () => {
      try {
        const checkLogStatus = await fetch("/user/checkLogStatus");
        const parsedCheckLogStatus = await checkLogStatus.json();
        if (parsedCheckLogStatus === 'success') {
          setState((prevState) => {
            return {
              ...prevState,
              loggedIn: true,
            };
          });
          navigate('/homepage');
        };
      } catch (err) {
        console.log(err);
      }
    }
    checkLogStatus();
  }, []);

  const loginUser = async (e) => {
    try {
      e.preventDefault();
      const username = usernameRef.current.value,
        password = passwordRef.current.value;
      if (username === '' || password === '')
        return alert('Incorrect Username or Password.');

      // check inputted credentials
      const checkCredentials = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const parsedCheckCredentials = await checkCredentials.json();

      // if credentials are incorrect, alert user and clear password field for reattempt
      if (parsedCheckCredentials === false) {
        alert('Incorrect Username or Password.')
        passwordRef.current.value = '';
      };

      // if credentials are correct, set loggedIn to true
      if (parsedCheckCredentials.logAttempt === 'success') {
        setState((prevState) => {
          return {
            ...prevState,
            loggedIn: true,
          };
        });
        navigate('/homepage');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='login'>
      <header>
        <h1>Sign In</h1>
      </header>
      <div className='box'>
        <form onSubmit={loginUser}>
          <span>Username: </span>
          <input ref={usernameRef} type='text' /><br />
          <span>Password: </span>
          <input ref={passwordRef} type='password' /><br />
          <button>Sign In</button>
        </form>
        <span className='noAccount'>Don't have an account?</span>
        <a onClick={() => navigate('signup')} className='signup-redirect'>
          Sign Up
        </a>
      </div>
    </div>
  );
}

export default Login;