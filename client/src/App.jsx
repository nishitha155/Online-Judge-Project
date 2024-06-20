import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Signup } from './pages/Signup';
import Navbar from './Components/Navbar';
import { Home } from './pages/Home';
import { Main } from './pages/Main';
import { Login } from './pages/Login';
import { Assignments } from './pages/Assignments';
import { Contests } from './pages/Contests';
function App() {

  return (
    <>
      <Routes>
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user/login" element={<Login />} />
        
        <Route path="/" element={<Navbar />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ass" element={<Assignments />} />
        <Route path="/con" element={<Contests />} />
     
    </Routes>
    </>
  )
}

export default App