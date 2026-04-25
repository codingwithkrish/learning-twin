import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { ChevronRight, HelpCircle, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(14);
  const [confidence, setConfidence] = useState(0.8);

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] p-8 space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <span className="text-xs font-tech text-primary-indigo uppercase tracking-widest font-bold">Machine Learning Foundations</span>
          <h1 className="text-3xl font-bold">Adaptive Assessment</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-on-surface/50 font-tech">Question {currentQuestion} of 20</p>
          <div className="w-64 h-1.5 bg-surface-highest rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-primary-indigo w-[70%]" />
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
              Explain the difference between supervised and unsupervised learning.
            </h2>
          </div>

          <div className="relative">
            <textarea 
              className="w-full h-48 bg-surface-container border border-white/5 rounded-2xl p-6 text-on-surface/80 focus:outline-none focus:border-primary-indigo/50 transition-all resize-none"
              placeholder="Type your answer here..."
            />
            <div className="absolute bottom-4 right-4 text-[10px] font-tech text-on-surface/30">
              240 / 500
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-tech uppercase tracking-widest text-on-surface/40">
              <span>Confidence Level</span>
              <span className="text-primary-indigo font-bold">Certain</span>
            </div>
            <div className="relative h-10 flex items-center">
              <input 
                type="range" 
                min="0" max="1" step="0.01" 
                value={confidence} 
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full h-1 bg-surface-highest rounded-full appearance-none cursor-pointer accent-primary-indigo"
              />
              <div className="absolute top-8 left-0 text-[10px] text-on-surface/30 uppercase">Guessing</div>
              <div className="absolute top-8 right-0 text-[10px] text-on-surface/30 uppercase">Sure</div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-white/5">
            <button className="flex items-center gap-2 text-on-surface/40 hover:text-white transition-colors text-sm">
              <AlertCircle size={16} />
              <span>Report</span>
            </button>
            <div className="flex gap-4">
              <button className="btn-secondary px-10">
                Check
              </button>
              <button className="btn-primary flex items-center gap-2 px-10">
                <span>Next Question</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <div className="px-3 py-1 bg-white/5 rounded text-[10px] text-on-surface/30 border border-white/5">
          <kbd className="font-sans">Enter</kbd> to submit
        </div>
        <div className="px-3 py-1 bg-white/5 rounded text-[10px] text-on-surface/30 border border-white/5">
          <kbd className="font-sans">H</kbd> for hint
        </div>
      </div>
    </div>
  );
};

export default Quiz;
