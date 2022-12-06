import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import months from './months';

const EditEntry = (props) => {
  const [state, setState] = useState({
    loggedIn: false,
    click: false,
    incognito: false,
    showLast: false,
    totalJournals: [],
    monthCheck: [],
    content: '',
  });
  const {
    loggedIn,
    incognito,
    showLast,
    monthCheck,
    content,
  } = state;
  const { date, setDate } = props;
  const navigate = useNavigate();
  const editContent = useRef(null);
  const lastSentence = useRef(null);

  useEffect(() => {
    const checkLogStatus = async () => {
      try {
        const checkLogStatus = await fetch('/user/checkLogStatus');
        const parsedCheckLogStatus = await checkLogStatus.json();
        if (parsedCheckLogStatus === 'success') {
          setState((prevState) => {
            return {
              ...prevState,
              loggedIn: true,
            };
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkLogStatus();

    setState(prevState => ({
        ...prevState,
        content: fetchSingle(),
      }))
  }, []);

  useEffect(() => {
    try {
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
  }, [loggedIn]);

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

  const updateEntry = async () => {
    try {
      const updateEntryPost = await fetch('/entry/update/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          content: editContent.current.value,
        }),
      });
      navigate('/searchEntry');
    } catch (err) {
      console.log('Update Entry was not successful; ', err);
    }
  };

  const deleteEntry = async () => {
    try {
      const deleteEntryPost = await fetch('/entry/delete/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
        }),
      });
      navigate('/searchEntry');
    } catch (err) {
      console.log('Delete Entry was not successful; ', err);
    }
  };

  const logOut = async () => {
    const logOutAttempt = await fetch('/user/logOut');
    const parsedLogOutAttempt = await logOutAttempt.json();
    console.log('parsedLogOutAttempt: ', parsedLogOutAttempt);
    if (parsedLogOutAttempt !== 'Logged Out Successfully') return;
    setState((prevState) => {
      return {
        ...prevState,
        loggedIn: false,
      };
    });
    navigate('/');
  };

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

  function fetchSingle() {
    try {
      fetch('/entry/getSingle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
        }),
      })
      .then(data => data.json())
      .then(data => editContent.current.value = data.content);
    } catch (err) {
      console.log('Show Single Based On Date was unsuccessful; ', err);
    }
  };

  return (
    <>
      {loggedIn ? (
        <div className='searchEntry'>
          <div className='left-side'>
            <button onClick={() => navigate('/homepage')}>Home</button>
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
              {showLast ? (
                <input type="text" className="showLast" ref={lastSentence} />
              ) : (
                <input type="text" style={{display: 'none'}} className="showLast" ref={lastSentence} />
              )}
              <br />
              {!incognito ? (
                <input
                  className="textbox"
                  ref={editContent}
                  onKeyDown={(e) => {
                    if (e.key === '.' ||
                     e.key === '!' ||
                     e.key === '?' ||
                     e.key === ';') currentSentence(editContent.current.value + e.key);
                  }}
                  onChange={() => {
                    setState(prevState => ({
                      ...prevState,
                      content: editContent.current.value,
                    }))
                  }}
                  defaultValue={content}
                  type="text"
                />
              ) : (
                <input 
                  className="textbox" 
                  ref={editContent} 
                  onKeyDown={(e) => {
                    if (e.key === '.' ||
                     e.key === '!' ||
                     e.key === '?' ||
                     e.key === ';') currentSentence(editContent.current.value + e.key);
                  }}
                  onChange={() => {
                    setState(prevState => ({
                      ...prevState,
                      content: editContent.current.value,
                    }))
                  }}
                  defaultValue={content}
                  type="password" 
                 />
              )}
            </div>
            <div>
              <button onClick={updateEntry}>Update This Entry</button>
              <button
                onClick={() => {
                  deleteEntry();
                  navigate('/searchEntry');
                }}
              >
                Delete Entry
              </button>
            </div>
            <br />
              <button onClick={() => navigate('/searchEntry')}>Search Other Entries</button>
          </div>

          <div className='right-side'>
            <span className='tracker'>Tracker</span>
            {monthCheck}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default EditEntry;