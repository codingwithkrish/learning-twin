import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { MessageSquare, Send, ChevronLeft, Check, AlertCircle, Sparkles, HelpCircle, Plus, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { learnApi } from '../api';
import axios from 'axios';
import { useStore } from '../store/useStore';

const Session = ({ onNavigate, onNewSession }) => {
  const { activeTopic, setActiveTopic, token, graph } = useStore();
  const [level, setLevel] = useState('academic');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (activeTopic) {
      setMessages([{ role: 'assistant', content: `I'm preparing your session on **${activeTopic}**. One moment...` }]);
      handleInitialExplanation(activeTopic);
    }
  }, [activeTopic]);

  const handleInitialExplanation = async (topic) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/chat', {
        message: "Hi! Can you give me a brief overview of this topic to get started?",
        topic: topic,
        history: []
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([{ role: 'assistant', content: res.data.content }]);
    } catch (err) {
      setMessages([{ role: 'assistant', content: "I had trouble starting the session. Try asking me something manually!" }]);
    } finally {
      setLoading(false);
    }
  };

  if (!activeTopic) {
    return (
      <main className="p-12 animate-in fade-in duration-700" aria-label="Session Library">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Session Library</h1>
          <p className="text-on-surface/50">Pick a concept from your twin's knowledge graph to continue your evolution.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {graph.concepts.map(concept => (
            <button 
              key={concept.title}
              onClick={() => setActiveTopic(concept.title)}
              aria-label={`Start session on ${concept.title}`}
              className="text-left w-full glass-card p-6 border-white/5 hover:border-primary-indigo/30 hover:bg-primary-indigo/5 cursor-pointer transition-all group focus:outline-none focus:ring-2 focus:ring-primary-indigo"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-xl bg-surface-highest group-hover:bg-primary-indigo/10 text-on-surface/40 group-hover:text-primary-indigo transition-colors">
                  <Sparkles size={24} />
                </div>
                <span className={clsx(
                  "px-3 py-1 rounded-full text-[10px] font-tech uppercase font-bold",
                  concept.isWeakNode ? "bg-error/10 text-error" : "bg-secondary/10 text-secondary"
                )}>
                  {concept.isWeakNode ? 'Needs Focus' : 'Stable'}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{concept.title}</h3>
              <div className="flex justify-between items-end">
                <span className="text-xs text-on-surface/40">Mastery: {concept.masteryLevel}%</span>
                <button className="text-primary-indigo text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Continue <ChevronRight size={14} />
                </button>
              </div>
            </button>
          ))}
          
          <button 
            onClick={onNewSession}
            aria-label="Discover New Topic"
            className="w-full h-full min-h-[200px] border-2 border-dashed border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-on-surface/30 hover:text-on-surface/60 hover:border-white/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-indigo"
          >
             <Plus size={32} className="mb-4" />
             <span className="font-bold">Discover New Topic</span>
          </button>
        </div>
      </main>
    );
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5001/api/chat', {
        message: userMsg.content,
        topic: 'Neural Networks',
        history: messages
      }, {
        headers: { Authorization: `Bearer ${useStore.getState().token}` }
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col animate-in fade-in duration-500">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/5 bg-surface-lowest flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTopic(null)}
            className="text-on-surface/40 hover:text-white transition-colors"
          >
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

      <div className="flex-1 flex overflow-hidden relative">
        {loading && !messages.length && (
          <div className="absolute inset-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary-indigo/20 border-t-primary-indigo rounded-full animate-spin mb-6" />
            <p className="text-xl font-tech animate-pulse text-primary-indigo">Generating Personalized Session...</p>
          </div>
        )}

        {/* Main Learning Content */}
        <div className="flex-1 overflow-y-auto p-12 bg-[#0a0a0f]">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-bold">{activeTopic || 'Select a Topic'}</h1>
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
              {messages.length > 0 ? (
                <div className="whitespace-pre-wrap">
                  {messages[0].content}
                </div>
              ) : (
                <p>Waiting for AI to generate content for {activeTopic}...</p>
              )}
              
              <div className="my-12 glass-card p-8 border-primary-indigo/20 bg-primary-indigo/5 rounded-2xl">
                 <div className="flex items-center gap-3 mb-4 text-primary-indigo">
                    <Sparkles size={20} />
                    <span className="font-tech text-sm uppercase tracking-widest font-bold">Concept Insight</span>
                 </div>
                 <p className="text-sm italic">
                    I'm analyzing the core components of {activeTopic} for your current mastery level. Use the chat on the right if you need a specific analogy!
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tutor Sidebar */}
        <aside aria-label="Tutor Chat Sidebar" className="w-96 bg-surface-lowest border-l border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center gap-2">
            <Sparkles className="text-primary-indigo" size={18} />
            <h2 className="font-bold">Tutor Chat</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={clsx(
                "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                m.role === 'assistant' ? "bg-surface-container text-on-surface ml-0" : "bg-primary-indigo text-white ml-auto"
              )}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-surface-container text-on-surface p-4 rounded-2xl text-sm animate-pulse">
                Thinking...
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5">
            <div className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask your Learning Twin..." 
                className="w-full bg-surface-container border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary-indigo/50"
              />
              <button 
                onClick={handleSendMessage}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-indigo hover:text-white transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </aside>
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
