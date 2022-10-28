import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState({
    username: "",
    loggedIn: false,
    content: "",
    incognito: false,
    showLast: false,
    lastSentence: "",
    sentenceCache: "",
    date: "",
    token: "",
    october: [],
  });
  const { username, loggedIn, content, incognito, lastSentence, sentenceCache, showLast, date, october } = state;

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect( async () => {

    try {
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
  
    const cacheOctober = [];
    for (let i = 1; i <= 31; i++) {
      let dateInput = '';
      if (i < 10) {
        dateInput = `0${i}`
      } else {
        dateInput = i;
      }
      await fetch('/entry/getSingle', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          date: `10/${dateInput}/2022`
        }),
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data !== null) {
          cacheOctober.push(<div className='yes'>{i}</div>);
        } else {
          cacheOctober.push(<div className='no'>{i}</div>);
        }
        setState((prevState) => {
          return {
            ...prevState,
            october: october.concat(cacheOctober)
          }
        });
      })
    }
  
  } catch (err) {
      console.log(err);
    }
  }, []);

  const checkLogSuccess = () => {
    setState(prevState => {
      return {
      ...prevState, 
      loggedIn: true,
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
        loggedIn: true,
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
          const whichResponse = Math.random() * 2;
          if (data === false) {
            if (whichResponse >= 1) alert('Account deleted.');
            else alert('Incorrect Username or Password.')
          }
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
    alert('Submitted!');
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
      loggedIn: false
    }
  })
  }

  return (
    <div>
      {loggedIn ? (
        <div className="homepage">
          <div className="left-side">
            <button onClick={logOut}>Log Out</button>
          </div>

          <div className="main">
            <header>
              <h1>Write!</h1>
            </header>
            <div className="main-box">
              <span className='font-light-gray'>Incognito Mode: </span>
              <input
                className="checkbox"
                type="checkbox"
                onChange={incognitoToggle}
              />
              <br />
              <span className='font-light-gray'>Show Last Sentence: </span>
              <input
                className="checkbox"
                type="checkbox"
                onChange={lastSentenceToggle}
              />
              <br />
              {state.showLast ? (
                <input type="text" className="showLast" value={lastSentence} />
              ) : null}
              <br />
              {state.incognito ? (
                <input
                  className="textbox"
                  type="password"
                  onChange={updateText}
                />
              ) : (
                <input className="textbox" type="text" onChange={updateText} />
              )}
            </div>
            <div>
              <Link to="/" reloadDocument><button onClick={submitEntry}>Submit Today's Entry</button></Link>
              <button onClick={clearText}>Clear Entry</button>
            </div>
            <Link to="/searchEntry" reloadDocument>
              <button>Search Other Entries</button>
            </Link>
          </div>

          <div className="right-side">
            <span className='tracker'>Tracker</span>
            {october}
          </div>
        </div>
      ) : (
        /* -----------------------!!! LOGIN PAGE !!!----------------------------------------------- */
        <div className="login">
          <header>
            <h1>Sign In</h1>
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
            <span className="noAccount">Don't have an account?</span>
            <Link to="/signup">
              <a>Sign Up</a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;