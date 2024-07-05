import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
