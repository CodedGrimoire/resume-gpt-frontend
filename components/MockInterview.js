'use client';
import { useState, useEffect } from 'react';
import { 
  MessageSquare, Send, CheckCircle, X, RotateCcw, 
  TrendingUp, AlertCircle, Lightbulb
} from 'lucide-react';

export function MockInterview({ interviewData, onExit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Combine all questions
    const questions = [
      ...(interviewData.hrQuestions || []).map(q => ({ ...q, type: 'HR' })),
      ...(interviewData.technicalQuestions || []).map(q => ({ ...q, type: 'Technical' })),
      ...(interviewData.projectQuestions || []).map(q => ({ ...q, type: 'Project', projectName: q.projectName }))
    ];
    setAllQuestions(questions);
  }, [interviewData]);

  const currentQuestion = allQuestions[currentQuestionIndex];

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;

    try {
      // In a real app, you'd call the backend API here
      // For now, we'll simulate feedback
      const simulatedFeedback = {
        feedback: `Your answer covers the main points. Consider adding more specific examples from your experience.`,
        improvedAnswer: `${userAnswer}. Additionally, I would emphasize [specific improvement based on context].`,
        confidenceScore: Math.floor(Math.random() * 30) + 70, // 70-100
        strengths: ['Clear structure', 'Relevant experience mentioned'],
        improvements: ['Add more metrics', 'Include specific examples']
      };

      setFeedback(simulatedFeedback);
      setCompletedQuestions([...completedQuestions, {
        question: currentQuestion.question,
        userAnswer,
        feedback: simulatedFeedback
      }]);
    } catch (error) {
      console.error('Error getting feedback:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setFeedback(null);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setCompletedQuestions([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Mock Interview Complete!</h2>
          <p className="text-slate-400">You answered {completedQuestions.length} questions</p>
        </div>
        <div className="space-y-4 mb-6">
          {completedQuestions.map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-slate-200 font-medium text-sm mb-2">{item.question}</p>
              <p className="text-slate-300 text-xs mb-2">Your Answer: {item.userAnswer}</p>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">Confidence Score:</span>
                <span className="text-green-400 font-semibold">{item.feedback.confidenceScore}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-blue-500/30 hover:border-blue-500/40 flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Start Over
          </button>
          <button
            onClick={onExit}
            className="flex-1 bg-white/10 hover:bg-white/15 text-slate-200 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30"
          >
            Back to Prep
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
        <p className="text-slate-400">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-200 flex items-center">
          <MessageSquare className="w-6 h-6 mr-3 text-slate-400" />
          Mock Interview
        </h2>
        <button
          onClick={onExit}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">
            Question {currentQuestionIndex + 1} of {allQuestions.length}
          </span>
          <span className="text-slate-400 text-sm">
            {currentQuestion.type} Question
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        {currentQuestion.projectName && (
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
            {currentQuestion.projectName}
          </span>
        )}
        <h3 className="text-xl font-semibold text-slate-200 mb-4">
          {currentQuestion.question}
        </h3>
      </div>

      {/* Answer Input */}
      <div className="mb-6">
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors resize-none"
          rows={6}
        />
      </div>

      {/* Submit Button */}
      {!feedback && (
        <button
          onClick={handleSubmitAnswer}
          disabled={!userAnswer.trim()}
          className="w-full bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-blue-500/10 text-blue-300 font-semibold py-4 px-6 rounded-xl transition-all duration-300 border border-blue-500/30 hover:border-blue-500/40 disabled:cursor-not-allowed flex items-center justify-center mb-4"
        >
          <Send className="w-5 h-5 mr-2" />
          Submit Answer
        </button>
      )}

      {/* Feedback */}
      {feedback && (
        <div className="mb-6 space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-slate-200 font-semibold flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Confidence Score
              </h4>
              <span className="text-2xl font-bold text-green-400">{feedback.confidenceScore}%</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-slate-200 font-semibold mb-2 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Feedback
            </h4>
            <p className="text-slate-300 text-sm mb-3">{feedback.feedback}</p>
            {feedback.strengths && feedback.strengths.length > 0 && (
              <div className="mb-3">
                <p className="text-green-300 text-xs font-semibold mb-1">Strengths:</p>
                <ul className="space-y-1">
                  {feedback.strengths.map((s, idx) => (
                    <li key={idx} className="text-slate-300 text-xs">• {s}</li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.improvements && feedback.improvements.length > 0 && (
              <div>
                <p className="text-amber-300 text-xs font-semibold mb-1">Improvements:</p>
                <ul className="space-y-1">
                  {feedback.improvements.map((i, idx) => (
                    <li key={idx} className="text-slate-300 text-xs">• {i}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-slate-200 font-semibold mb-2 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-amber-400" />
              Improved Answer
            </h4>
            <p className="text-slate-300 text-sm">{feedback.improvedAnswer}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      {feedback && (
        <div className="flex gap-3">
          <button
            onClick={handleNext}
            className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-green-500/30 hover:border-green-500/40"
          >
            {currentQuestionIndex < allQuestions.length - 1 ? 'Next Question' : 'Finish Interview'}
          </button>
        </div>
      )}
    </div>
  );
}
