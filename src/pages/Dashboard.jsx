import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { Flame, Target, TrendingUp, Play, ArrowRight, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { progressApi } from '../api';
import { useStore } from '../store/useStore';

const Dashboard = ({ onNavigate }) => {
  const { graph, setGraph, setActiveTopic } = useStore();
  const [loading, setLoading] = useState(true);

  const handleStartLearning = (topic) => {
    setActiveTopic(topic);
    onNavigate('sessions');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await progressApi.getGraph();
        setGraph(res.data);
      } catch (err) {
        console.error("Failed to fetch graph", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const concepts = graph?.concepts || [];
  const averageMastery = concepts.length > 0 
    ? Math.round(concepts.reduce((acc, c) => acc + c.masteryLevel, 0) / concepts.length)
    : 0;
  
  const weakNodes = concepts.filter(c => c.isWeakNode);
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold mb-2">Good morning, Krish. Ready to evolve?</h1>
        <p className="text-on-surface/50">Your cognitive double has prepared fresh insights on your weak areas today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="LEARNING STREAK" icon={Flame}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-5xl font-bold text-primary-indigo">12</span>
            <span className="text-lg text-on-surface/50 font-tech">days</span>
          </div>
          <div className="w-full h-1.5 bg-surface-highest rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-indigo to-primary w-2/3" />
          </div>
        </Card>

        <Card title="CONCEPT MASTERY" icon={TrendingUp}>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-5xl font-bold text-secondary">{averageMastery}</span>
            <span className="text-lg text-on-surface/50 font-tech">%</span>
          </div>
          <p className="text-secondary text-xs mt-4 font-tech">+4.2% from last session</p>
        </Card>

        <Card title="FOCUS TARGET" icon={Target}>
          <div className="flex flex-wrap gap-2 mt-2">
            {weakNodes.length > 0 ? weakNodes.slice(0, 2).map(node => (
              <span key={node.title} className="px-3 py-1 bg-error/10 border border-error/20 text-error rounded-full text-xs font-tech">{node.title}</span>
            )) : (
              <span className="px-3 py-1 bg-primary-indigo/10 border border-primary-indigo/20 text-primary-indigo rounded-full text-xs font-tech">All clear!</span>
            )}
          </div>
          <p className="text-xs text-on-surface/50 mt-6 italic">Recommended: 75min Deep Dive</p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Session Resume */}
        <div className="lg:col-span-2 space-y-6">
          <Card 
            className="border-primary-indigo/30 bg-gradient-to-br from-surface-container to-background"
            glow
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">Resume Session</h2>
                <p className="text-on-surface/70 mb-8 max-w-md">
                  Continue your module on <span className="text-white font-semibold">Advanced State Management</span> where you left off yesterday.
                </p>
                <button 
                  onClick={() => handleStartLearning('Advanced State Management')}
                  className="btn-primary flex items-center gap-2"
                >
                  <span>Start Learning</span>
                  <Play size={18} fill="currentColor" />
                </button>
              </div>
              <div className="w-32 h-32 bg-primary-indigo/5 rounded-full border border-primary-indigo/10 flex items-center justify-center animate-pulse">
                <Zap size={48} className="text-primary-indigo/30" />
              </div>
            </div>
          </Card>

          <Card title="Learning Intensity" subtitle="Focus hours per day">
            <div className="h-64 flex items-end justify-between gap-4 mt-8">
              {[20, 45, 30, 70, 40, 60, 95].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className={clsx(
                      "w-full rounded-t-lg transition-all duration-500",
                      i === 6 ? "bg-primary-indigo shadow-lg shadow-primary-indigo/20" : "bg-surface-highest hover:bg-surface-bright"
                    )}
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[10px] text-on-surface/40 font-tech">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col - Feed & Insights */}
        <div className="space-y-6">
          <Card title="Daily Challenges">
            <div className="space-y-4">
              {[
                { title: 'Quantum Q&A', tag: 'EASY', desc: 'Answer 5 consecutive questions about Superposition.' },
                { title: 'React Refactor', tag: 'HARD', desc: 'Rewrite a class component to use useReducer.' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-surface-lowest border border-white/5 rounded-xl hover:border-white/10 transition-all cursor-pointer group">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-semibold group-hover:text-primary-indigo transition-colors">{item.title}</h4>
                    <span className={clsx(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded border",
                      item.tag === 'EASY' ? "text-secondary border-secondary/20" : "text-tertiary border-tertiary/20"
                    )}>{item.tag}</span>
                  </div>
                  <p className="text-xs text-on-surface/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Twin Insight" className="border-secondary/20 bg-secondary/5">
            <p className="text-sm text-on-surface/80 italic leading-relaxed">
              "You tend to hesitate when applying <span className="text-secondary">useCallback</span>. Shall we focus on re-serialization patterns today?"
            </p>
            <button className="flex items-center gap-1 text-xs text-secondary mt-4 font-bold hover:underline">
              <span>Accept Suggestion</span>
              <ArrowRight size={14} />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
