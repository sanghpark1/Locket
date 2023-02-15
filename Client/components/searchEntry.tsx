import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import months from './months';

const SearchEntry = (props) => {
  const [state, setState] = useState({
    loggedIn: false,
    totalJournals: [],
    monthCheck: [],
  });
  const {
    loggedIn,
    totalJournals,
    monthCheck,
  } = state;
  const { setDate } = props;
  const navigate = useNavigate();

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
  }, []);

  useEffect(() => {
    try {
      const findEntries = async () => {
        const entryDates = await fetch('/entry/getEntries');
        const parsedEntryDates = await entryDates.json();
        console.log('parsedEntryDates: ', parsedEntryDates);
        const cache = [];
        for (let i = parsedEntryDates.length - 1; i >= 0; i--) {
          totalJournals.push(
            <option value={parsedEntryDates[i].date}>
              {parsedEntryDates[i].date}
            </option>
          );
        }
        setState((prevState) => {
          return {
            ...prevState,
            totalJournals: totalJournals.concat(cache),
          };
        });
      };

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
      findEntries();
      retrieveRecord();
    } catch (err) {
      console.log(err);
    }
  }, [loggedIn]);

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
              <h1>Search For Journal Entry!</h1>
            </header>
            <div>
              <h1>Pick A Date!</h1>
              <select onChange={(e) => {
                setDate(e.target.value)
                navigate('/editEntry');
                }} className='dropbox'>
                <option value=''>Select</option>
                {totalJournals}
              </select>
            </div>
          </div>

          <div className='right-side'>
            <span className='tracker'>
              {months.getMonth[new Date().getMonth()]}
              <br /> Tracker
            </span>
            {monthCheck}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SearchEntry;
