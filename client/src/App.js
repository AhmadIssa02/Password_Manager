import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Login from './login.js';
import Signup from './register.js';
import "./index.css";
import PasswordManager from './passwordManager.js';

function App() {
  return (
    <>
    <Router>
              {/* <Link to="/signup">Signup</Link> */}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/passwordManager" element={<PasswordManager />} />

        </Routes>
    </Router>
    </>
  );
}

export default App;
