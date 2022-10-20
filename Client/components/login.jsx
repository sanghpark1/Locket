import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [state, setState ] = useState({ username: '', log: false, content: '', incognito: false, showLast: false, lastSentence: '', sentenceCache: '', date: '', token: '' });
  const username = state.username;
  const loggedIn = state.log;
  const content = state.content
  const incognito = state.incognito;
  const lastSentence = state.lastSentence;
  const sentenceCache = state.sentenceCache;
  const showLast = state.showLast;
  const date = state.date;

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {

    fetch("/user/checkLog")
      .then((res) => res.json())
      .then((data) => {
        data === "success" ? checkLogSuccess() : null;
      })
      .catch((err) => console.log("Error in login.jsx get request", err));

    const date = new Date();
    setState((prevState) => {
      return {
        ...prevState,
        date: date.toLocaleDateString()
      }
    })
  }, []);

  const checkLogSuccess = () => {
    setState(prevState => {
      return {
      ...prevState, 
      log: true,
    }})
  }

  const loginUser = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    console.log("username: ", username);
    console.log("password: ", password);
    const body = {
      username,
      password,
    };

    const loginSuccess = (data) => {
      setState(prevState => {
        return {
        ...prevState, 
        log: true,
        username: data.username,
        token: data.accessToken
      }})
    }
    
    if (username !== '' && password !== '') {
      fetch("/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          data.logAttempt === 'success' ? loginSuccess(data) : null;
        })
        .catch((err) => console.log("Error in login.jsx form submission", err));
    }
    usernameRef.current.value = "";
    passwordRef.current.value = "";
  };

  const updateText = (e) => {
    const lastChar = e.target.value[e.target.value.length - 1];
    if (lastChar === '.' || lastChar === '!' || lastChar === '?') {
      let store = sentenceCache + lastChar;

      setState(prevState => {
        console.log('store:', store);
        return {
          ...prevState,
          content: e.target.value,
          lastSentence: store,
          sentenceCache: ''
        }
      })
    } else {
      setState(prevState => {
        console.log(prevState.content);
        return {
          ...prevState,
          content: e.target.value,
          sentenceCache: prevState.sentenceCache + e.target.value[e.target.value.length - 1]
        }
      })
    }

    
  }

  const submitEntry = (e) => {
    console.log(state.content);
    fetch("/entry/new/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          username,
          date
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.log("Error in login.jsx journal entry submission", err));
    clearText();
  }

  const incognitoToggle = () => {
    setState(prevState => {
      return {
        ...prevState,
        incognito: !incognito
      }
    })
  }

  const clearText = () => {
    document.getElementsByClassName('textbox')[0].value = '';

    setState(prevState => {
      return {
        ...prevState,
        content: '',
        lastSentence: '',
        sentenceCache: ''
      }
    })
  }

  const lastSentenceToggle = () => {
    setState(prevState => {
      return {
        ...prevState,
        showLast: !showLast
      }
    })
  }

  const logOut = () => {
    fetch("/user/logOut")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log("Error in login.jsx get request", err));

  const date = new Date();
  setState((prevState) => {
    return {
      ...prevState,
      log: false
    }
  })
  }

  return (
    <div>
      { loggedIn ?
      <div className="homepage">
        <div className="left-side">
          <button onClick={logOut}>Log Out</button>
        </div>

        <div className="main">
          <header>
            <h1>Write!</h1>
          </header>
          <span>Incognito Mode: </span><input className='checkbox' type='checkbox' onChange={incognitoToggle} />
          <br />
          <span>Show Last Sentence: </span><input className='checkbox' type='checkbox' onChange={lastSentenceToggle} />
          <br/>
          {
            state.showLast ?
            <input type='text' className='showLast' value={lastSentence} />
            :
            null
          }
          <br />
          { state.incognito ?
           <input className='textbox' type="password" onChange={updateText} />
           :
           <input className='textbox' type="text" onChange={updateText} />
           }
          <div>
            <button onClick={submitEntry}>Submit Today's Entry</button>
            <button onClick={clearText}>Clear Entry</button>
          </div>
          <br/>
          <Link to="/searchEntry">
          <button>Search Other Entries</button>
        </Link>
        </div>

        <div className="right-side"></div>
      </div>
      :

      /* -----------------------!!! LOGIN PAGE !!!----------------------------------------------- */
      <div className="login">
        <header>
          <h1>Log In</h1>
        </header>
        <div className="box">
        <form onSubmit={loginUser}>
          <span>Username: </span>
          <input ref={usernameRef} type="text" />
          <br />
          <span>Password: </span>
          <input ref={passwordRef} type="password" />
          <br />
          <button>Sign In</button>
        </form>
        <span>Don't have an account?</span>
        <Link to="/signup">
          <a>Sign Up</a>
        </Link>
        </div>
      </div>
      } 
    </div>
  );
}

export default Login;