'use client';
import { useState } from 'react';
import { 
  Briefcase, BookOpen, MessageSquare, Code, Lightbulb, 
  AlertTriangle, Clock, TrendingUp, Play, CheckCircle 
} from 'lucide-react';
import { Accordion } from './Accordion';

export function InterviewPrep({ data, onStartMockInterview }) {
  if (!data) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Header Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-2 flex items-center">
              <Briefcase className="w-6 h-6 mr-3 text-slate-400" />
              Interview Prep for {data.targetRole}
            </h2>
            <div className="flex items-center gap-3 mt-3">
              {data.difficulty && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(data.difficulty)}`}>
                  {data.difficulty}
                </span>
              )}
              {data.timeEstimate && (
                <span className="flex items-center text-slate-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {data.timeEstimate} prep
                </span>
              )}
              {data.seniority && (
                <span className="text-slate-400 text-sm">
                  {data.seniority} Level
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onStartMockInterview}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-xl border border-blue-500/30 hover:border-blue-500/40 shadow-lg flex items-center"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Mock Interview
          </button>
        </div>
      </div>

      {/* Topics to Prepare */}
      {data.topicsToPrepare && data.topicsToPrepare.length > 0 && (
        <Accordion title="Topics to Prepare" icon={BookOpen} defaultOpen={true}>
          <div className="space-y-4">
            {data.topicsToPrepare.map((category, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-slate-200 font-semibold mb-3">{category.category}</h4>
                <ul className="space-y-2">
                  {category.topics.map((topic, topicIdx) => (
                    <li key={topicIdx} className="text-slate-300 text-sm flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Accordion>
      )}

      {/* HR Questions */}
      {data.hrQuestions && data.hrQuestions.length > 0 && (
        <Accordion title="HR Questions" icon={MessageSquare} defaultOpen={true}>
          <div className="space-y-4">
            {data.hrQuestions.map((item, idx) => (
              <QuestionAccordion key={idx} question={item.question} answer={item.answer} keyPoints={item.keyPoints} followUpQuestions={item.followUpQuestions} />
            ))}
          </div>
        </Accordion>
      )}

      {/* Technical Questions */}
      {data.technicalQuestions && data.technicalQuestions.length > 0 && (
        <Accordion title="Technical Questions" icon={Code}>
          <div className="space-y-4">
            {data.technicalQuestions.map((item, idx) => (
              <QuestionAccordion 
                key={idx} 
                question={item.question} 
                answer={item.answer} 
                keyPoints={item.keyPoints} 
                followUpQuestions={item.followUpQuestions}
                difficulty={item.difficulty}
              />
            ))}
          </div>
        </Accordion>
      )}

      {/* Project Questions */}
      {data.projectQuestions && data.projectQuestions.length > 0 && (
        <Accordion title="Project-Based Questions" icon={Briefcase}>
          <div className="space-y-4">
            {data.projectQuestions.map((item, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-slate-200 font-semibold mb-2 text-sm">{item.projectName}</h4>
                <QuestionAccordion 
                  question={item.question} 
                  answer={item.answer} 
                  keyPoints={item.keyPoints}
                />
              </div>
            ))}
          </div>
        </Accordion>
      )}

      {/* Quick Tips */}
      {data.quickTips && data.quickTips.length > 0 && (
        <Accordion title="Quick Tips" icon={Lightbulb}>
          <ul className="space-y-3">
            {data.quickTips.map((tip, idx) => (
              <li key={idx} className="text-slate-300 text-sm flex items-start">
                <Lightbulb className="w-4 h-4 mr-2 mt-0.5 text-amber-400 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Accordion>
      )}

      {/* Red Flags */}
      {data.redFlags && data.redFlags.length > 0 && (
        <Accordion title="Red Flags to Avoid" icon={AlertTriangle}>
          <ul className="space-y-3">
            {data.redFlags.map((flag, idx) => (
              <li key={idx} className="text-red-300 text-sm flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 text-red-400 flex-shrink-0" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </Accordion>
      )}
    </div>
  );
}

// Question Accordion Component
function QuestionAccordion({ question, answer, keyPoints, followUpQuestions, difficulty }) {
  const [isOpen, setIsOpen] = useState(false);

  const getDifficultyBadge = (diff) => {
    if (!diff) return null;
    const diffLower = diff.toLowerCase();
    let className = 'px-2 py-0.5 rounded text-xs font-semibold border';
    
    if (diffLower === 'beginner') {
      className += ' bg-green-500/20 text-green-300 border-green-500/30';
    } else if (diffLower === 'intermediate') {
      className += ' bg-amber-500/20 text-amber-300 border-amber-500/30';
    } else {
      className += ' bg-red-500/20 text-red-300 border-red-500/30';
    }
    
    return (
      <span className={className}>
        {diff}
      </span>
    );
  };

  return (
    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-slate-200 font-medium text-sm">{question}</span>
            {getDifficultyBadge(difficulty)}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-3">
          <div>
            <h5 className="text-slate-300 font-semibold text-xs mb-2">Suggested Answer:</h5>
            <p className="text-slate-300 text-sm leading-relaxed">{answer}</p>
          </div>
          {keyPoints && keyPoints.length > 0 && (
            <div>
              <h5 className="text-slate-300 font-semibold text-xs mb-2">Key Points:</h5>
              <ul className="space-y-1">
                {keyPoints.map((point, idx) => (
                  <li key={idx} className="text-slate-400 text-sm flex items-start">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {followUpQuestions && followUpQuestions.length > 0 && (
            <div>
              <h5 className="text-slate-300 font-semibold text-xs mb-2">Potential Follow-ups:</h5>
              <ul className="space-y-1">
                {followUpQuestions.map((fq, idx) => (
                  <li key={idx} className="text-slate-400 text-sm italic">
                    • {fq}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
