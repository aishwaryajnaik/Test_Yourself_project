import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container home">
      <div className="hero">
        <h2>Transform Your Learning with AI</h2>
        <p>Generate personalized tests and quizzes from any topic or document</p>
        <button className="btn btn-primary" onClick={() => navigate('/generate')}>
          Generate Test Now
        </button>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>🤖 AI-Powered</h3>
          <p>Advanced NLP generates contextual questions</p>
        </div>
        <div className="feature-card">
          <h3>📚 Any Topic</h3>
          <p>Create tests from topics or upload documents</p>
        </div>
        <div className="feature-card">
          <h3>⚡ Instant Results</h3>
          <p>Get your personalized test in seconds</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
