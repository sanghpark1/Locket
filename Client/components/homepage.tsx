import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import months from './months';

const Homepage = () => {
  const [state, setState] = useState({
    loggedIn: false,
    incognito: false,
    showLast: false,
    date: new Date().toLocaleDateString(),
    monthCheck: [],
  });
  const { loggedIn, incognito, showLast, date, monthCheck } = state;
  const navigate = useNavigate();
  const currentEntry = useRef(null);
  const lastSentence = useRef(null);

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
        };
      } catch (err) {
        console.log(err);
      }
    }
    checkLogStatus();
  }, []);

  useEffect(() => {
    const retrieveRecord = async () => {
      try {
          const currMonth = new Date().getMonth();
          const cacheMonth: JSX.Element[] = [];
          for (let i = 1; i <= months.numDays[currMonth]; i++) {
            const checkDate = await fetch('/entry/getSingle', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                date: `${currMonth + 1}/${i}/${new Date().getFullYear()}`,
              }),
            });
            const parsedCheckDate = await checkDate.json();

            cacheMonth.push(
              parsedCheckDate !== null ? (
                <div key={`${currMonth}/${i}`} className='yes'>{i}</div>
              ) : (
                <div key={`${currMonth}/${i}`} className='no'>{i}</div>
              )
            );
          }
          setState((prevState) => {
            return {
              ...prevState,
              monthCheck: cacheMonth,
            };
          });
      } catch (err) {
        console.log(err);
      }
    };
    retrieveRecord();
  }, [loggedIn]);

  const submitEntry = async (e) => {
    try {
      const createEntry = await fetch('/entry/new/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: currentEntry.current.value,
          date,
        }),
      })
      const parsedCreateEntry = await createEntry.json();
      alert(parsedCreateEntry);
    } catch (err) {
      console.log(err);
    }
  }

  const incognitoToggle = () => {
    setState(prevState => {
      return {
        ...prevState,
        incognito: !incognito
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

  const logOut = async () => {
    const logOutAttempt = await fetch("/user/logOut");
    const parsedLogOutAttempt = await logOutAttempt.json();
    console.log('parsedLogOutAttempt: ', parsedLogOutAttempt);
    if (parsedLogOutAttempt !== 'Logged Out Successfully') return;
    setState((prevState) => {
        return {
        ...prevState,
        loggedIn: false
        }
    })
    navigate('/');
  }

  const currentSentence = (currValue) => {
    if (!currValue) return '';
    const entryValue = currValue.split('').reverse();
    let count = 0;
    for (let i = 0; i < entryValue.length; i++) {
      while (entryValue[i+1] && entryValue[i] === entryValue[i+1]) i++;
      if (
        entryValue[i] === '.' ||
        entryValue[i] === '!' ||
        entryValue[i] === '?' ||
        entryValue[i] === ';' ||
        i === entryValue.length - 1
      ) {
        if (i === entryValue.length - 1) {
          lastSentence.current.value = entryValue
            .slice(0, i + 1)
            .reverse()
            .join('');
          return;
        }
        count++;
        if (count > 1 || i === entryValue.length - 1) {
          lastSentence.current.value = entryValue
            .slice(0, i)
            .reverse()
            .join('');
          return;
        }
      }
    }
  }

  return (
    <>
        {loggedIn ? (<div className="homepage">
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
                <input type="text" className="showLast" ref={lastSentence} />
              ) : (
                <input type="text" style={{display: 'none'}} className="showLast" ref={lastSentence} />
              )}
              <br />
              {state.incognito ? (
                <input
                  className="textbox"
                  ref={currentEntry}
                  onKeyDown={(e) => {
                    if (e.key === '.' ||
                     e.key === '!' ||
                     e.key === '?' ||
                     e.key === ';') currentSentence(currentEntry.current.value + e.key);
                  }}
                  type="password"
                />
              ) : (
                <input 
                  className="textbox" 
                  ref={currentEntry} 
                  onKeyDown={(e) => {
                    if (e.key === '.' ||
                     e.key === '!' ||
                     e.key === '?' ||
                     e.key === ';') currentSentence(currentEntry.current.value + e.key);

                  }}
                  type="text" 
                 />
              )}
            </div>
            <div>
              <button onClick={submitEntry}>Submit Today's Entry</button>
              <button onClick={() => currentEntry.current.value = ''}>Clear Entry</button>
            </div>
              <button onClick={() => navigate('/searchEntry')}>Search Other Entries</button>
          </div>

          <div className="right-side">
            <span className='tracker'>{months.getMonth[new Date().getMonth()]}<br/> Tracker</span>
            {monthCheck}
          </div>
        </div>) 
        : 
        (<h1>You must be logged in to view this page.</h1>)}
    </>
  );
}

export default Homepage;