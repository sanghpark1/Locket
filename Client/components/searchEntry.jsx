import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import months from './months';

const SearchEntry = () => {
  const [state, setState] = useState({
    click: false,
    incognito: false,
    showLast: false,
    totalJournals: [],
    monthCheck: [],
    date: '',
  });
  const { click, incognito, showLast, totalJournals, monthCheck, date } = state;

  useEffect(() => {
    try {
      fetch('/entry/getEntries')
        .then((res) => res.json())
        .then((data) => {
          const cache = [];
          for (let i = data.length - 1; i >= 0; i--) {
            totalJournals.push(
              <option value={data[i].date}>{data[i].date}</option>
            );
          }
          setState((prevState) => {
            return {
              ...prevState,
              totalJournals: totalJournals.concat(cache),
            };
          });
        });

      const retrieveRecord = async () => {
        try {
          const currMonth = new Date().getMonth();
          const cacheMonth = [];
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
                <div key={`${currMonth}/${i}`} className='yes'>
                  {i}
                </div>
              ) : (
                <div key={`${currMonth}/${i}`} className='no'>
                  {i}
                </div>
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
    } catch (err) {
      console.log(err);
    }

  }, []);

  const viewSingle = (e) => {
    const date = e.target.value;
    fetch('/entry/getSingle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setState((prevState) => {
          return {
            ...prevState,
            content: data.content, // need to use useRef instead
            date,
          };
        });
      });
    clickToggle();
  };

  const clickToggle = () => {
    setState((prevState) => {
      return {
        ...prevState,
        click: !click,
      };
    });
  };

  const updateText = (e) => {
    const lastChar = e.target.value[e.target.value.length - 1];
    if (lastChar === '.' || lastChar === '!' || lastChar === '?') {
      let store = sentenceCache + lastChar;

      setState((prevState) => {
        console.log('store:', store);
        return {
          ...prevState,
          content: e.target.value,
          lastSentence: store,
          sentenceCache: '',
        };
      });
    } else {
      setState((prevState) => {
        console.log(prevState.content);
        return {
          ...prevState,
          content: e.target.value,
          sentenceCache:
            prevState.sentenceCache + e.target.value[e.target.value.length - 1],
        };
      });
    }
  };

  const updateEntry = (e) => {
    fetch('/entry/update/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        username,
        content,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) =>
        console.log('Error in login.jsx journal entry submission', err)
      );
    clickToggle();
  };

  const deleteEntry = (e) => {
    fetch('/entry/delete/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        username,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) =>
        console.log('Error in login.jsx journal entry submission', err)
      );
    clickToggle();
  };

  const incognitoToggle = () => {
    setState((prevState) => {
      return {
        ...prevState,
        incognito: !incognito,
      };
    });
  };

  const lastSentenceToggle = () => {
    setState((prevState) => {
      return {
        ...prevState,
        showLast: !showLast,
      };
    });
  };

  const logOut = () => {
    fetch('/user/logOut')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log('Error in login.jsx get request', err));

    const date = new Date();
    setState((prevState) => {
      return {
        ...prevState,
        log: false,
      };
    });
  };

  return (
    <div>
      {state.click ? (
        <div className='searchEntry'>
          <div className='left-side'>
            <Link to='/' reloadDocument>
              <button>Home</button>
            </Link>
            <button onClick={logOut}>Log Out</button>
          </div>

          <div className='main'>
            <header>
              <h1>Edit!</h1>
            </header>
            <div className='main-box'>
              <span className='font-light-gray'>Incognito Mode: </span>
              <input
                className='checkbox'
                type='checkbox'
                onChange={incognitoToggle}
              />
              <br />
              <span className='font-light-gray'>Show Last Sentence: </span>
              <input
                className='checkbox'
                type='checkbox'
                onChange={lastSentenceToggle}
              />
              {state.showLast ? (
                <input type='text' value={lastSentence} />
              ) : null}
              <br />
              {state.incognito ? (
                <input
                  className='textbox'
                  type='password'
                  onChange={updateText}
                />
              ) : (
                <input
                  className='textbox'
                  type='text'
                  value={content}
                  onChange={updateText}
                />
              )}
            </div>
            <div>
              <button onClick={updateEntry}>Update This Entry</button>
              <Link to='/searchEntry' reloadDocument>
                <button onClick={deleteEntry}>Delete Entry</button>
              </Link>
            </div>
            <br />
            <Link to='/searchEntry' reloadDocument>
              <button>Search Other Entries</button>
            </Link>
          </div>

          <div className='right-side'>
            <span className='tracker'>Tracker</span>
            {monthCheck}
          </div>
        </div>
      ) : (
        <div className='searchEntry'>
          <div className='left-side'>
            <Link to='/' reloadDocument>
              <button>Home</button>
            </Link>
            <button onClick={logOut}>Log Out</button>
          </div>

          <div className='main'>
            <header>
              <h1>Search For Journal Entry!</h1>
            </header>
            <div>
              <h1>Pick A Date!</h1>
              <select onChange={viewSingle} className='dropbox'>
                <option value=''>Select</option>
                {totalJournals}
              </select>
            </div>
          </div>

          <div className='right-side'>
            <span className='tracker'>{months.getMonth[new Date().getMonth()]}<br/> Tracker</span>
            {monthCheck}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchEntry;
