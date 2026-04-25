import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { MessageSquare, Send, ChevronLeft, Check, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

const Session = () => {
  const [level, setLevel] = useState('academic');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "I see you're stuck on backpropagation. Think of it like correcting a recipe after a bad batch.\n\nIf the cake is too salty, you don't just throw everything away; you trace back which ingredient caused the problem and adjust it for next time. The 'error' is the salty taste, and the 'weights' are the ingredient amounts. Does that analogy make the math feel more intuitive?" }
  ]);

  return (
    <div className="h-screen flex flex-col animate-in fade-in duration-500">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/5 bg-surface-lowest flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <button className="text-on-surface/40 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface/40 font-tech">Computer Science</span>
            <span className="text-on-surface/20">/</span>
            <span className="font-bold">Neural Networks</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-surface-container rounded-full flex items-center gap-2 border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-tech">12 Day Streak</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-indigo/20 border border-primary-indigo/20" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Learning Content */}
        <div className="flex-1 overflow-y-auto p-12 bg-[#0a0a0f]">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-bold">Understanding Backpropagation</h1>
              <div className="flex bg-surface-container p-1 rounded-xl border border-white/5">
                {['child-like', 'academic', 'expert'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={clsx(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                      level === l ? "bg-primary-indigo text-white shadow-lg shadow-primary-indigo/20" : "text-on-surface/40 hover:text-on-surface"
                    )}
                  >
                    {l.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')}
                  </button>
                ))}
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-on-surface/80 leading-relaxed text-lg">
              <p>
                Backpropagation is the fundamental algorithm that allows neural networks to learn from their mistakes. It is essentially an application of the **chain rule** from calculus to calculate the gradient of the loss function with respect to the weights of the network.
              </p>
              
              <div className="my-12 glass-card p-8 border-primary-indigo/20 flex flex-col items-center">
                <div className="flex gap-12 items-center mb-8">
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-primary-indigo/40 flex items-center justify-center font-tech">x₁</div>
                    <div className="w-12 h-12 rounded-full border-2 border-primary-indigo/40 flex items-center justify-center font-tech">x₂</div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-secondary/40 flex items-center justify-center font-tech">h₁</div>
                    <div className="w-12 h-12 rounded-full border-2 border-secondary/40 flex items-center justify-center font-tech">h₂</div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-tertiary/40 flex items-center justify-center font-tech">ŷ</div>
                </div>
                <p className="text-xs text-on-surface/40 italic">Fig 1.1: Signal flow during a forward pass vs error flow during backpropagation.</p>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">The Mathematical Core</h3>
              <p>
                To minimize the error (or loss), we adjust the weights in the direction that most reduces the error. This is done by computing the partial derivative of the error $E$ with respect to each weight $w$:
              </p>
              <div className="bg-surface-lowest p-6 rounded-xl border border-white/5 font-tech text-primary-indigo my-6">
                ∂E/∂w = (∂E/y) * (∂y/∂z) * (∂z/∂w)
              </div>
            </div>
          </div>
        </div>

        {/* Tutor Sidebar */}
        <div className="w-96 bg-surface-lowest border-l border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center gap-2">
            <Sparkles className="text-primary-indigo" size={18} />
            <h2 className="font-bold">Tutor Chat</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={clsx(
                "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
                m.role === 'assistant' ? "bg-surface-container text-on-surface ml-0" : "bg-primary-indigo text-white ml-auto"
              )}>
                {m.content}
              </div>
            ))}
            <div className="bg-primary-indigo/10 p-4 rounded-2xl text-sm text-primary-indigo border border-primary-indigo/20">
              The chain rule part is what gets me. Why do we multiply those three terms?
            </div>
          </div>

          <div className="p-4 border-t border-white/5">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask your Learning Twin..." 
                className="w-full bg-surface-container border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary-indigo/50"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-indigo">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <footer className="h-20 bg-surface-lowest border-t border-white/5 flex items-center justify-between px-12">
        <div className="flex items-center gap-4">
          <div className="text-xs font-tech text-on-surface/40">Session Progress: 65%</div>
          <div className="w-48 h-1 bg-surface-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary-indigo w-[65%]" />
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl font-bold flex items-center gap-2 hover:bg-secondary/20 transition-all">
            <Check size={18} />
            <span>I understood</span>
          </button>
          <button className="px-8 py-3 bg-error/10 border border-error/20 text-error rounded-xl font-bold flex items-center gap-2 hover:bg-error/20 transition-all">
            <AlertCircle size={18} />
            <span>I'm confused</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Session;
