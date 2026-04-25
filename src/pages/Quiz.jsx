import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { HelpCircle, AlertCircle, CheckCircle2, XCircle, ArrowRight, BrainCircuit, Play } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store/useStore';
import { learnApi } from '../api';

const Quiz = () => {
  const { graph } = useStore();
  const [phase, setPhase] = useState('setup'); // setup, loading, active, results
  const [topic, setTopic] = useState(graph?.concepts[0]?.title || '');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);

  const handleStartQuiz = async () => {
    if (!topic) return;
    setPhase('loading');
    try {
      const res = await learnApi.getQuiz(topic, difficulty, numQuestions);
      setQuestions(res.data.questions || []);
      setCurrentIndex(0);
      setScore(0);
      setSelectedOption(null);
      setIsChecked(false);
      setPhase('active');
    } catch (error) {
      alert("Failed to generate quiz. Please try again.");
      setPhase('setup');
    }
  };

  if (phase === 'setup') {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0f] p-8 animate-in zoom-in-95 duration-500">
        <Card className="w-full max-w-md p-10 bg-surface-lowest">
          <div className="flex items-center gap-3 mb-8">
            <BrainCircuit className="text-primary-indigo" size={28} />
            <h1 className="text-2xl font-bold">Configure Quiz</h1>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-tech text-on-surface/50 uppercase tracking-widest mb-2 block">Select Topic</label>
              <select 
                value={topic} 
                onChange={e => setTopic(e.target.value)}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-indigo"
              >
                {graph?.concepts?.length > 0 ? (
                  graph.concepts.map(c => (
                    <option key={c.title} value={c.title}>{c.title}</option>
                  ))
                ) : (
                  <option value="">No topics available</option>
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-tech text-on-surface/50 uppercase tracking-widest mb-2 block">Difficulty</label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={clsx(
                      "flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all",
                      difficulty === d ? "bg-primary-indigo text-white" : "bg-surface-container text-on-surface/50 hover:text-white"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-tech text-on-surface/50 uppercase tracking-widest">Questions</label>
                <span className="text-primary-indigo font-bold">{numQuestions}</span>
              </div>
              <input 
                type="range" 
                min="1" max="20" 
                value={numQuestions} 
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full h-1 bg-surface-highest rounded-full appearance-none cursor-pointer accent-primary-indigo"
              />
            </div>
            
            <button 
              onClick={handleStartQuiz}
              disabled={!topic}
              className="w-full btn-primary py-4 mt-4 flex items-center justify-center gap-2"
            >
              <Play size={18} />
              <span>Start Quiz</span>
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0f] space-y-6">
        <div className="w-16 h-16 border-4 border-primary-indigo/20 border-t-primary-indigo rounded-full animate-spin" />
        <p className="text-xl font-tech text-primary-indigo animate-pulse">Generating your custom quiz with Gemini...</p>
      </div>
    );
  }

  if (phase === 'active' && questions.length > 0) {
    const currentQ = questions[currentIndex];
    
    const handleCheck = () => {
      if (!selectedOption) return;
      setIsChecked(true);
      if (selectedOption === currentQ.correct_answer) {
        setScore(s => s + 1);
      }
    };
    
    const handleNext = () => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
        setIsChecked(false);
      } else {
        setPhase('results');
      }
    };

    return (
      <div className="h-screen flex flex-col bg-[#0a0a0f] p-8 space-y-8 animate-in fade-in duration-500">
        <header className="flex justify-between items-end">
          <div>
            <span className="text-xs font-tech text-primary-indigo uppercase tracking-widest font-bold">{topic} - {difficulty}</span>
            <h1 className="text-3xl font-bold">Adaptive Assessment</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-on-surface/50 font-tech">Question {currentIndex + 1} of {questions.length}</p>
            <div className="w-64 h-1.5 bg-surface-highest rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary-indigo transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-2xl p-10 space-y-8 bg-surface-lowest">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary-indigo/10 rounded-xl flex items-center justify-center text-primary-indigo flex-shrink-0">
                <HelpCircle size={22} />
              </div>
              <h2 className="text-xl font-semibold leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correct_answer;
                
                let stateClass = "border-white/5 bg-surface-container hover:border-primary-indigo/50 hover:bg-primary-indigo/5";
                if (isChecked) {
                  if (isCorrect) stateClass = "border-secondary text-secondary bg-secondary/10";
                  else if (isSelected && !isCorrect) stateClass = "border-error text-error bg-error/10";
                  else stateClass = "border-white/5 bg-surface-container opacity-50";
                } else if (isSelected) {
                  stateClass = "border-primary-indigo text-primary-indigo bg-primary-indigo/10";
                }

                return (
                  <button 
                    key={i}
                    onClick={() => !isChecked && setSelectedOption(opt)}
                    disabled={isChecked}
                    className={clsx(
                      "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between",
                      stateClass
                    )}
                  >
                    <span>{opt}</span>
                    {isChecked && isCorrect && <CheckCircle2 size={18} className="text-secondary" />}
                    {isChecked && isSelected && !isCorrect && <XCircle size={18} className="text-error" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end items-center pt-6 border-t border-white/5 gap-4">
              {!isChecked ? (
                <button 
                  onClick={handleCheck}
                  disabled={!selectedOption}
                  className="btn-primary px-10"
                >
                  Check Answer
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-2 px-10"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0f] animate-in zoom-in-95 duration-500">
        <Card className="w-full max-w-md p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold">Quiz Complete!</h2>
          <p className="text-on-surface/50">You scored <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span></p>
          
          <div className="w-full h-2 bg-surface-highest rounded-full overflow-hidden mt-4">
            <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${(score / questions.length) * 100}%` }} />
          </div>
          
          <button 
            onClick={() => {
              setPhase('setup');
              setQuestions([]);
            }}
            className="w-full btn-primary py-4 mt-8"
          >
            Start Another Quiz
          </button>
        </Card>
      </div>
    );
  }

  return null;
};

export default Quiz;
