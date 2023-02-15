import React, { useState } from 'react'; // need to import react on every component that we create
import { Route, Routes } from 'react-router-dom';
import "./App.scss";
import Signup from './components/signup';
import Login from './components/login';
import SearchEntry from './components/searchEntry';
import EditEntry from './components/editEntry';
import Homepage from './components/homepage';


const App = () => {
  const [date, setDate] = useState('');

  return (
    <div>
      <Routes>
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/searchEntry" element={<SearchEntry date={date} setDate={setDate} />} />
        <Route path="/editEntry" element={<EditEntry date={date} setDate={setDate} />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}


export default App;