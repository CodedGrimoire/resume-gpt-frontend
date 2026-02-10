'use client';
import { useState, useRef } from 'react';
import { Upload, FileText, Target, TrendingUp, Lightbulb, Code, Users, Briefcase, Globe, BookOpen, AlertCircle, CheckCircle, X, RefreshCw } from 'lucide-react';
import { parseAnalysisResponse } from '../lib/parseAnalysisResponse';
import { Accordion } from '../components/Accordion';
import { InterviewPrep } from '../components/InterviewPrep';
import { MockInterview } from '../components/MockInterview';

// Header Component
function Header() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 backdrop-blur-xl rounded-2xl mb-6 shadow-2xl border border-white/10">
        <FileText className="w-10 h-10 text-slate-300" />
      </div>
      <h1 className="text-5xl font-bold text-slate-200 mb-4">
        ResumeGPT
      </h1>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto">
        AI-powered resume analysis for professional excellence
      </p>
    </div>
  );
}

// Upload Component
function UploadSection({ onUpload, onClear, onRefresh, loading, file, setFile, hasResults }) {
  const fileInputRef = useRef(null);

  const handleClear = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl">
      <div className="space-y-6">
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all duration-300 group backdrop-blur-sm"
          >
            <Upload className="w-10 h-10 text-slate-400 group-hover:text-slate-300 mb-3 transition-colors" />
            <span className="text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
              {file ? (
                <span className="text-slate-300">{file.name}</span>
              ) : (
                'Click to upload your resume (PDF)'
              )}
            </span>
          </label>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onUpload}
            disabled={!file || loading}
            className="flex-1 bg-white/10 hover:bg-white/15 disabled:bg-white/5 text-slate-200 font-semibold py-4 px-8 rounded-xl transition-all duration-300 backdrop-blur-xl border border-white/20 hover:border-white/30 shadow-lg disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-300 mr-3"></div>
                <span>Analyzing Resume...</span>
              </div>
            ) : (
              'Analyze Resume'
            )}
          </button>
          
          {(file || hasResults) && (
            <button
              onClick={handleClear}
              disabled={loading}
              className="bg-red-500/20 hover:bg-red-500/30 disabled:bg-red-500/10 text-red-300 font-semibold py-4 px-6 rounded-xl transition-all duration-300 backdrop-blur-xl border border-red-500/30 hover:border-red-500/40 shadow-lg disabled:cursor-not-allowed flex items-center justify-center"
              title="Clear uploaded file and results"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {hasResults && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-blue-500/10 text-blue-300 font-semibold py-4 px-6 rounded-xl transition-all duration-300 backdrop-blur-xl border border-blue-500/30 hover:border-blue-500/40 shadow-lg disabled:cursor-not-allowed flex items-center justify-center"
              title="Refresh page"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Score Component
function ScoreBoard({ scoreNumber, scoreText, breakdown }) {
  const scoreOutOf10 = scoreNumber || 0;
  
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return 'bg-emerald-400';
    if (score >= 6) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const getScoreText = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Needs Work';
  };

  const strokeDasharray = `${(scoreOutOf10 / 10) * 100}, 100`;

  // Parse breakdown items to extract category scores
  const parseBreakdown = (breakdown) => {
    if (!breakdown || !Array.isArray(breakdown)) return [];
    
    return breakdown.map(item => {
      // Match patterns like "Formatting (2.3/2.5): description"
      const match = item.match(/([^:]+?)\s*\(([\d.]+)\/([\d.]+)\):?\s*(.*)/);
      if (match) {
        return {
          category: match[1].trim(),
          score: parseFloat(match[2]),
          max: parseFloat(match[3]),
          description: match[4].trim()
        };
      }
      return null;
    }).filter(Boolean);
  };

  const breakdownItems = parseBreakdown(breakdown);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-200 mb-8 flex items-center justify-center">
          <TrendingUp className="w-7 h-7 mr-3 text-slate-400" />
          Resume Score
        </h3>
        
        <div className="relative w-40 h-40 mx-auto mb-6">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"></div>
          
          {/* Progress ring */}
          <svg className="w-40 h-40 transform -rotate-90 absolute inset-0" viewBox="0 0 36 36">
            <path
              className="text-white/10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={getScoreColor(scoreOutOf10)}
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white/5 backdrop-blur-xl rounded-full w-24 h-24 flex items-center justify-center border border-white/10">
              <div>
                <div className="text-3xl font-bold text-slate-200">{scoreOutOf10.toFixed(1)}</div>
                <div className="text-xs text-slate-400">/ 10</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`inline-block px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 ${getScoreColor(scoreOutOf10)} font-semibold`}>
          {getScoreText(scoreOutOf10)}
        </div>
      </div>
      
      {/* Breakdown Dashboard */}
      {breakdownItems.length > 0 && (
        <div className="mt-8 pt-8 border-t border-white/10">
          <h4 className="text-lg font-semibold text-slate-300 mb-6 text-center">Score Breakdown</h4>
          <div className="space-y-5">
            {breakdownItems.map((item, idx) => {
              const percentage = (item.score / item.max) * 100;
              const getCategoryColor = (percentage) => {
                if (percentage >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-400' };
                if (percentage >= 60) return { text: 'text-amber-400', bg: 'bg-amber-400' };
                return { text: 'text-red-400', bg: 'bg-red-400' };
              };
              const colors = getCategoryColor(percentage);
              
              return (
                <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200 font-medium text-sm">{item.category}</span>
                    <span className={`${colors.text} font-semibold text-sm`}>
                      {item.score.toFixed(1)}/{item.max}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div
                      className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  {item.description && (
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">{item.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Feedback Card Component
function FeedbackCard({ title, content, icon: Icon, isList = false, isNumbered = false }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl hover:bg-white/10 transition-all duration-300 hover:border-white/20">
      <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center">
        {Icon && <Icon className="w-6 h-6 mr-3 text-slate-400" />}
        {title}
      </h3>
      
      {isList ? (
        isNumbered ? (
          <ol className="space-y-3 list-decimal list-inside">
            {content?.map((item, idx) => (
              <li key={idx} className="text-slate-300 text-sm leading-relaxed pl-2">
                {item}
              </li>
            ))}
          </ol>
        ) : (
          <ul className="space-y-3">
            {content?.map((item, idx) => (
              <li key={idx} className="text-slate-300 flex items-start">
                <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-sm leading-relaxed flex-1">{item}</span>
              </li>
            ))}
          </ul>
        )
      ) : (
        <div className="text-slate-300 text-sm leading-relaxed max-w-4xl" style={{ lineHeight: '1.75' }}>
          {content}
        </div>
      )}
    </div>
  );
}

// Main Component
export default function Home() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [loadingInterviewPrep, setLoadingInterviewPrep] = useState(false);
  const [showMockInterview, setShowMockInterview] = useState(false);
  
  const handleClear = () => {
    setFile(null);
    setFeedback(null);
    setParsedData(null);
    setInterviewPrep(null);
    setShowMockInterview(false);
  };
  
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGenerateInterviewPrep = async () => {
    if (!parsedData?.targetRole) {
      alert('Please analyze a resume first to get the target role');
      return;
    }

    try {
      setLoadingInterviewPrep(true);
      
      // Extract skills and projects from parsed data
      // Handle both array and string formats
      const technicalSkills = Array.isArray(parsedData.technicalSkills) 
        ? parsedData.technicalSkills 
        : (parsedData.technicalSkills ? parsedData.technicalSkills.split('\n').filter(Boolean) : []);
      
      const softSkills = Array.isArray(parsedData.softSkills)
        ? parsedData.softSkills
        : (parsedData.softSkills ? parsedData.softSkills.split('\n').filter(Boolean) : []);
      
      const skills = [...technicalSkills, ...softSkills];
      
      const projects = Array.isArray(parsedData.projects)
        ? parsedData.projects
        : (parsedData.projects ? parsedData.projects.split('\n').filter(Boolean) : []);

      // Use local API route for Next.js (works on localhost)
      const apiUrl = '/api/interview-prep';
      console.log(`[Frontend] Requesting interview prep from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetRole: parsedData.targetRole,
          skills: skills,
          projects: projects,
          seniority: parsedData.scoreNumber >= 8 ? 'Senior' : parsedData.scoreNumber >= 6 ? 'Mid-level' : 'Junior'
        }),
      });

      // Check if response is OK and content-type is JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API returned ${response.status}: ${errorText.substring(0, 100)}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response. Please check the backend URL.');
      }

      const data = await response.json();
      if (data.data) {
        setInterviewPrep(data.data);
      } else if (data.error) {
        alert(`Error: ${data.error}. ${data.message || ''}`);
      } else {
        alert('Failed to generate interview prep. Please try again.');
      }
    } catch (err) {
      console.error('Failed to generate interview prep:', err);
      alert(`Failed to generate interview prep: ${err.message || 'Please check your connection and try again.'}`);
    } finally {
      setLoadingInterviewPrep(false);
    }
  };

  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setLoading(true);
      // Use local API route for Next.js (works on localhost)
      // This will proxy to the backend server
      const apiUrl = '/api/upload';
      console.log(`[Frontend] Uploading to: ${apiUrl}`);
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      // Check if response is OK
      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        let errorMessage = `Upload failed (${res.status})`;
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } else {
          const errorText = await res.text();
          if (errorText.includes('<!DOCTYPE')) {
            errorMessage = `Upload endpoint not found (404). Check if backend server is running.`;
          } else {
            errorMessage = errorText.substring(0, 100);
          }
        }
        
        console.error('Upload API Error:', res.status, errorMessage);
        throw new Error(errorMessage);
      }

      // Check content-type before parsing JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response from upload:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response. Please check the backend configuration.');
      }

      const data = await res.json();
      setFeedback(data.feedback || null);
      
      // Parse the raw feedback text if available
      if (data.feedback?.raw) {
        const parsed = parseAnalysisResponse(data.feedback.raw);
        setParsedData(parsed);
      } else if (data.feedback) {
        // Fallback: use the already extracted fields from backend
        // But we still want to parse for better structure
        const rawText = data.feedback.raw || 
          `ROLE: ${data.feedback.role || ''}\n\n` +
          `SCORE: ${data.feedback.score || ''}\n\n` +
          `FEEDBACK: ${data.feedback.feedback || ''}\n\n` +
          `ISSUES: ${data.feedback.issues || ''}\n\n` +
          `SUGGESTIONS: ${data.feedback.suggestions || ''}\n\n` +
          `TECHNICAL SKILLS REQUIRED: ${data.feedback.technicalSkills || ''}\n\n` +
          `SOFT SKILLS REQUIRED: ${data.feedback.softSkills || ''}\n\n` +
          `PROJECTS THAT IMPRESS RECRUITERS: ${data.feedback.projects || ''}\n\n` +
          `JOB MARKET INSIGHT: ${data.feedback.marketInsight || ''}\n\n` +
          `LEARNING PATHS AND CERTIFICATIONS: ${data.feedback.learningPaths || ''}`;
        
        const parsed = parseAnalysisResponse(rawText);
        setParsedData(parsed);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setFeedback(null);
      setParsedData(null);
      alert(`Upload failed: ${err.message || 'Please check your connection and try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-800/30 via-transparent to-transparent"></div>
      </div>
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}></div>
      
      <main className="relative z-10 max-w-6xl mx-auto p-6 md:p-12">
        <Header />
        
        <UploadSection 
          onUpload={handleUpload}
          onClear={handleClear}
          onRefresh={handleRefresh}
          loading={loading} 
          file={file} 
          setFile={setFile}
          hasResults={!!parsedData || !!feedback}
        />

        {parsedData && (
          <div className="space-y-6">
            {/* Score Section */}
            {(parsedData.scoreNumber || parsedData.scoreText) && (
              <ScoreBoard 
                scoreNumber={parsedData.scoreNumber}
                scoreText={parsedData.scoreText}
                breakdown={parsedData.breakdown}
              />
            )}

            {/* Target Role & General Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {parsedData.targetRole && (
                <FeedbackCard 
                  title="Target Job Role" 
                  content={parsedData.targetRole} 
                  icon={Target}
                />
              )}
              
              {parsedData.feedback && (
                <FeedbackCard 
                  title="General Feedback" 
                  content={parsedData.feedback} 
                  icon={Lightbulb}
                />
              )}
            </div>

            {/* Collapsible Sections for Long Content */}
            <div className="space-y-4">
              {parsedData.issues && parsedData.issues.length > 0 && (
                <Accordion title="Areas for Improvement" icon={AlertCircle}>
                  <ul className="space-y-3">
                    {parsedData.issues.map((item, idx) => (
                      <li key={idx} className="text-slate-300 flex items-start">
                        <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm leading-relaxed flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Accordion>
              )}

              {parsedData.suggestions && parsedData.suggestions.length > 0 && (
                <Accordion title="Suggested Improvements" icon={CheckCircle} defaultOpen={true}>
                  <ol className="space-y-3 list-decimal list-inside">
                    {parsedData.suggestions.map((item, idx) => (
                      <li key={idx} className="text-slate-300 text-sm leading-relaxed pl-2">
                        {item}
                      </li>
                    ))}
                  </ol>
                </Accordion>
              )}

              {parsedData.technicalSkills && parsedData.technicalSkills.length > 0 && (
                <Accordion title="Required Technical Skills" icon={Code}>
                  <ul className="space-y-3">
                    {parsedData.technicalSkills.map((item, idx) => (
                      <li key={idx} className="text-slate-300 flex items-start">
                        <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm leading-relaxed flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Accordion>
              )}

              {parsedData.softSkills && parsedData.softSkills.length > 0 && (
                <Accordion title="Required Soft Skills" icon={Users}>
                  <ul className="space-y-3">
                    {parsedData.softSkills.map((item, idx) => (
                      <li key={idx} className="text-slate-300 flex items-start">
                        <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm leading-relaxed flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Accordion>
              )}

              {parsedData.projects && parsedData.projects.length > 0 && (
                <Accordion title="Impressive Projects" icon={Briefcase}>
                  <ol className="space-y-3 list-decimal list-inside">
                    {parsedData.projects.map((item, idx) => (
                      <li key={idx} className="text-slate-300 text-sm leading-relaxed pl-2">
                        {item}
                      </li>
                    ))}
                  </ol>
                </Accordion>
              )}

              {parsedData.certifications && parsedData.certifications.length > 0 && (
                <Accordion title="Learning Paths & Certifications" icon={BookOpen}>
                  <ol className="space-y-3 list-decimal list-inside">
                    {parsedData.certifications.map((item, idx) => (
                      <li key={idx} className="text-slate-300 text-sm leading-relaxed pl-2">
                        {item}
                      </li>
                    ))}
                  </ol>
                </Accordion>
              )}

           {parsedData.marketInsight && (
  <div className="w-full rounded-xl border border-white/10 bg-white/5 p-6">
    <div className="flex items-center gap-2 mb-3">
      <Globe className="h-5 w-5 text-slate-300" />
      <h3 className="text-lg font-semibold text-white">Job Market Insight</h3>
    </div>

    <p className="w-full text-slate-300 text-sm leading-relaxed" style={{ lineHeight: '1.75' }}>
      {parsedData.marketInsight}
    </p>
  </div>
)}

            </div>
          </div>
        )}

        {/* Interview Prep Section */}
        {parsedData && !showMockInterview && (
          <div className="mt-8 flex flex-col items-center justify-center text-center w-full">
            {!interviewPrep ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                <h3 className="text-xl font-bold text-slate-200 mb-4">Ready for Interview Prep?</h3>
                <p className="text-slate-400 mb-6">
                  Get personalized interview questions and answers based on your resume analysis
                </p>
                <button
                  onClick={handleGenerateInterviewPrep}
                  disabled={loadingInterviewPrep}
                  className="bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-blue-500/10 text-blue-300 font-semibold py-3 px-8 rounded-xl transition-all duration-300 border border-blue-500/30 hover:border-blue-500/40 shadow-lg disabled:cursor-not-allowed"
                >
                  {loadingInterviewPrep ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-300 mr-3"></div>
                      <span>Generating Interview Prep...</span>
                    </div>
                  ) : (
                    'Generate Interview Prep'
                  )}
                </button>
              </div>
            ) : (
              <InterviewPrep 
                data={interviewPrep} 
                onStartMockInterview={() => setShowMockInterview(true)}
              />
            )}
          </div>
        )}

        {/* Mock Interview Mode */}
        {showMockInterview && interviewPrep && (
          <MockInterview 
            interviewData={interviewPrep}
            onExit={() => setShowMockInterview(false)}
          />
        )}
      </main>
    </div>
  );
}
