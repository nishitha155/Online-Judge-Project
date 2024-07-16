import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import image from './assets/image.png'; // Adjust the path if necessary

import { Signup } from './pages/Signup';
import { Home } from './pages/Home';
import { HomeBeforeLogin } from './pages/HomeBeforeLogin';
import { Login } from './pages/Login';
import { Contest } from './pages/Contest';
import { Dashboard } from './pages/Dashboard';
import { Verification } from './pages/Verification';
import { Update } from './pages/Update';
import ChangePassword from './pages/Password';
import { AddQuestion } from './pages/AddQuestion';
import AllProblems from './pages/AllProblems';
import AddTestCase from './pages/AddTestCase';
import UpdateProblem from './pages/UpdateProblem';
import { UserProblems } from './pages/UserProblems';
import ProblemSolve from './pages/Editor';
import CreateContest from './pages/CreateContest';
import ContestAttempt from './pages/ContestAttempt';
import ContestEditor from './pages/ContestEditor';
import { Assignments } from './pages/Assignments';
function App() {
  return (
    <>
      <Helmet>
        <link rel="icon" type="image/png" href={image} />
      </Helmet>
      <Routes>
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/" element={<HomeBeforeLogin />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contest" element={<Contest />} />
        <Route path="/contest/:contestId" element={<ContestAttempt />} />
        <Route path="/create" element={<CreateContest />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/update" element={<Update />} />
        <Route path="/password" element={<ChangePassword />} />
        <Route path="/add" element={<AddQuestion />} />
        <Route path="/problems" element={<AllProblems />} />
        <Route path="/problems/:id/solve" element={<ProblemSolve />} />
        <Route path="/userproblems" element={<UserProblems />} />
        <Route path="/problems/:problemId/add-testcase" element={<AddTestCase />} />
        <Route path="/problems/:problemId/update" element={<UpdateProblem />} />
        <Route path="/contest/:contestId/problem/:problemId" element={<ContestEditor />} />
      </Routes>
    </>
  );
}

export default App;
