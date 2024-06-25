import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Signup } from './pages/Signup';
import Navbar from './Components/Navbar';
import { Home } from './pages/Home';
import { HomeBeforeLogin } from './pages/HomeBeforeLogin';
import { Login } from './pages/Login';
import { Assignments } from './pages/Assignments';
import { Contests } from './pages/Contests';
import { Dashboard } from './pages/Dashboard';
import { Verification } from './pages/Verification';
import { Update } from './pages/Update';
import ChangePassword from './pages/Password';
import { AddQuestion } from './pages/AddQuestion';
import AllProblems from './pages/AllProblems';
import AddTestCase from './pages/AddTestCase';
import UpdateProblem from './pages/UpdateProblem';


function App() {

  return (
    <>
      <Routes>
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/user/login" element={<Login />} />
        
        <Route path="/" element={<HomeBeforeLogin />} />
        <Route path="/home" element={<Home />} />
       
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/contest" element={<Contests />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/update" element={<Update />} />
        <Route path="/password" element={<ChangePassword />} />
        <Route path="/add" element={<AddQuestion />} />
        <Route path="/problems" element={<AllProblems />} />
        <Route path="/problems/:problemId/add-testcase" element={<AddTestCase />} />
        <Route path="/problems/:problemId/update" element={<UpdateProblem />} />
     
    </Routes>
    </>
  )
}

export default App