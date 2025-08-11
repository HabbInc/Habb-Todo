import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import TaskList from './components/taskList';
import AddTask from './components/addTask';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<PrivateRoute><TaskList /></PrivateRoute>} />
        <Route path="/add-task" element={<PrivateRoute><AddTask /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;