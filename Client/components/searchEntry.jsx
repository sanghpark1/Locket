import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const SearchEntry = () => {
  const [state, setState] = useState({
    click: false,
    username: "aa",
    content: "",
    incognito: false,
    showLast: false,
    lastSentence: "",
    sentenceCache: "",
    totalJournals: [<input type='text' value='hi'/>],
    date: ''
  });
  const click = state.click;
  const username = state.username;
  const content = state.content;
  const incognito = state.incognito;
  const lastSentence = state.lastSentence;
  const sentenceCache = state.sentenceCache;
  const showLast = state.showLast;
  const totalJournals = state.totalJournals;
  const date = state.date;

  useEffect(() => {
    fetch('/entry/getEntries', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username
      }),
    })
    .then(res => res.json())
    .then(data => {
      const cache = [];
      for (let i = 0; i < data.length; i++) {
        totalJournals.push(<option value={data[i].date}>{data[i].date}</option>)
      }
      setState((prevState) => {
        return {
          ...prevState,
          totalJournals: totalJournals.concat(cache)
        }
      });
    })
  }, [])

  const viewSingle = (e) => {
    const date = e.target.value;
    fetch('/entry/getSingle', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        date
      }),
    })
    .then(res => res.json())
    .then(data => {
      setState((prevState) => {
        return {
          ...prevState,
          content: data.content,
          date
        }
      });
    })
    clickToggle();
  }

  const clickToggle = () => {
    setState(prevState => {
      return {
        ...prevState,
        click: !click
      }
    })
  }

  const updateText = (e) => {
    const lastChar = e.target.value[e.target.value.length - 1];
    if (lastChar === "." || lastChar === "!" || lastChar === "?") {
      let store = sentenceCache + lastChar;

      setState((prevState) => {
        console.log("store:", store);
        return {
          ...prevState,
          content: e.target.value,
          lastSentence: store,
          sentenceCache: "",
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
    fetch("/entry/update/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        username,
        content
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) =>
        console.log("Error in login.jsx journal entry submission", err)
      );
    clickToggle();
  };

  const deleteEntry = (e) => {
    fetch("/entry/delete/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        username
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) =>
        console.log("Error in login.jsx journal entry submission", err)
      );
    clickToggle();
  }

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

  return (
    <div>
      {state.click ? (
        <div className="searchEntry">
          <div className="left-side"></div>

          <div className="main">
            <header>
              <h1>Write!</h1>
            </header>
            <span>Incognito Mode: </span>
            <input
              className="checkbox"
              type="checkbox"
              onChange={incognitoToggle}
            />
            <br />
            <span>Show Last Sentence: </span>
            <input
              className="checkbox"
              type="checkbox"
              onChange={lastSentenceToggle}
            />
            {state.showLast ? <input type="text" value={lastSentence} /> : null}
            <br />
            {state.incognito ? (
              <input
                className="textbox"
                type="password"
                onChange={updateText}
              />
            ) : (
              <input className="textbox" type="text" value={content} onChange={updateText} />
            )}
            <div>
              <button onClick={updateEntry}>Update This Entry</button>
              <button onClick={deleteEntry}>Delete Entry</button>
            </div>
          </div>

          <div className="right-side"></div>
        </div>
      ) : (
        <div className="searchEntry">
          <div className="left-side"></div>

          <div className="main">
            <header>
              <h1>Search For Journal Entry!</h1>
            </header>
            <div>
              <h1>Pick A Date!</h1>
              <select onChange={viewSingle} className="dropbox">
                <option value=''>Select</option>
                {totalJournals}
                </select>
            </div>
          </div>

          <div className="right-side"></div>
        </div>
      )}
    </div>
  );
};

export default SearchEntry;
