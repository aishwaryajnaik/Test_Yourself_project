import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TestGenerator.css';

const TestGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    content: '',
    questionCount: 10,
    difficulty: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/tests/generate', formData);
      navigate(`/test/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Generate Your Test</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Topic *</label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({...formData, topic: e.target.value})}
            placeholder="e.g., Java Programming, World History"
            required
          />
        </div>

        <div className="form-group">
          <label>Additional Content (Optional)</label>
          <textarea
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="Paste any text, notes, or document content here..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Number of Questions</label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.questionCount}
              onChange={(e) => setFormData({...formData, questionCount: parseInt(e.target.value)})}
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Test'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestGenerator;
