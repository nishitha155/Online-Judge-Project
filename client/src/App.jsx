import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Signup from './Components/Signup';
import Navbar from './Components/Navbar';

function App() {

  return (
    <>
      <Routes>
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/" element={<Navbar />} />
     
    </Routes>
    </>
  )
}

export default App