import { Route, Navigate, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/Login';
import DevicePage from './pages/DevicePage/Devices'

function App()
{
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path ="/devices" element={<DevicePage />} />
      </Routes>
  );
}
export default App;



/*//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

import { io } from "socket.io-client";
// Use port associated with backend
const socket = io("http://localhost:5000");

socket.on("update", (arg) => {
  console.log(arg);
});

function App() {
  function toggleTest() {
    console.log("Sending test message");
    socket.emit("Test Balls", "Hello from React");
  }

  return (
    <button onClick={toggleTest}>
      Test
    </button>

  );
}

export default App */
