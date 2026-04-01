import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TestGenerator from './pages/TestGenerator';
import TakeTest from './pages/TakeTest';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Test Yourself</h1>
          <p>AI-Powered Test Generation Platform</p>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<TestGenerator />} />
          <Route path="/test/:id" element={<TakeTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
