import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TakeTest.css';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Test {
  id: number;
  topic: string;
  questions: Question[];
  questionCount: number;
  difficulty: string;
}

const TakeTest: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTest();
  }, [id]);

  const fetchTest = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tests/${id}`);
      setTest(response.data);
    } catch (err) {
      console.error('Failed to fetch test', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers({...answers, [questionId]: answer});
  };

  const calculateScore = () => {
    if (!test) return 0;
    let correct = 0;
    test.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  if (loading) return <div className="loading">Loading test...</div>;
  if (!test) return <div className="error">Test not found</div>;

  const score = calculateScore();
  const percentage = Math.round((score / test.questions.length) * 100);

  return (
    <div className="container">
      <div className="test-header">
        <h2>{test.topic}</h2>
        <div className="test-meta">
          <span>Questions: {test.questionCount}</span>
          <span>Difficulty: {test.difficulty}</span>
        </div>
      </div>

      {!showResults ? (
        <>
          {test.questions.map((question, index) => (
            <div key={question.id} className="question-card">
              <h3>Question {index + 1}</h3>
              <p className="question-text">{question.questionText}</p>
              <div className="options">
                {question.options.map((option, i) => (
                  <label key={i} className="option">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={() => handleAnswerSelect(question.id, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="button-group">
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Back to Home
            </button>
            <button className="btn btn-primary" onClick={() => setShowResults(true)}>
              Submit Test
            </button>
          </div>
        </>
      ) : (
        <div className="results">
          <h2>Test Results</h2>
          <div className="score-card">
            <div className="score">{percentage}%</div>
            <p>You got {score} out of {test.questions.length} correct</p>
          </div>

          {test.questions.map((question, index) => (
            <div key={question.id} className={`result-card ${answers[question.id] === question.correctAnswer ? 'correct' : 'incorrect'}`}>
              <h3>Question {index + 1}</h3>
              <p className="question-text">{question.questionText}</p>
              <p><strong>Your answer:</strong> {answers[question.id] || 'Not answered'}</p>
              <p><strong>Correct answer:</strong> {question.correctAnswer}</p>
              <p className="explanation">{question.explanation}</p>
            </div>
          ))}

          <div className="button-group">
            <button className="btn btn-primary" onClick={() => navigate('/generate')}>
              Generate Another Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeTest;
