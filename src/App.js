import './App.css';
import { useState, useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import Navbar from './Components/navbar.js';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import React from "react";
import { render } from "react-dom";
import CreatePassword from "./Components/create.js"
import RecordPatterns from "./Components/record.js"

function App() {

  const [ userPassword, setUserPassword ] = useState("");

  function updateUserPassword(password) {
    setUserPassword(password);
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/typingfor2fa' exact element={<CreatePassword userPassword={userPassword} updateUserPassword={updateUserPassword} />} />
        <Route path='/typingfor2fa/create' element={<CreatePassword userPassword={userPassword} updateUserPassword={updateUserPassword} />} />
        <Route path='/typingfor2fa/record' element={<RecordPatterns userPassword={userPassword} />} />
      </Routes>
      <div className="footer">
        <p className="bText">Created by Colette Do for CS109</p>
      </div>
    </Router>
  );
}

export default App;
