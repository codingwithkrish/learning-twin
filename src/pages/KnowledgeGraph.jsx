import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { Network, Search, Filter, Info, ChevronRight, Zap, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store/useStore';
import { progressApi } from '../api';

const KnowledgeGraph = ({ onNavigate }) => {
  const { graph, setGraph, setActiveTopic } = useStore();
  const [selectedNode, setSelectedNode] = useState(null);

  const handleDiveDeeper = () => {
    if (selectedNode) {
      setActiveTopic(selectedNode);
      onNavigate('sessions');
    }
  };

  const handleQuickQuiz = () => {
    if (selectedNode) {
      setActiveTopic(selectedNode);
      onNavigate('quiz');
    }
  };

  useEffect(() => {
    const fetchGraph = async () => {
      const res = await progressApi.getGraph();
      setGraph(res.data);
      if (res.data.concepts.length > 0) setSelectedNode(res.data.concepts[0].title);
    };
    fetchGraph();
  }, []);

  const concepts = graph?.concepts || [];
  const nodes = concepts.map((c, i) => ({
    ...c,
    id: i.toString(),
    x: 20 + (i * 20) % 60,
    y: 20 + Math.floor(i / 3) * 20,
    status: c.masteryLevel > 80 ? 'mastered' : c.confusionScore > 0.5 ? 'confused' : 'learning'
  }));

  const selectedConcept = concepts.find(c => c.title === selectedNode);

  return (
    <div className="h-screen flex animate-in slide-in-from-right duration-700">
      {/* Graph Area */}
      <div className="flex-1 relative bg-surface-lowest p-8 flex flex-col">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Graph</h1>
            <p className="text-sm text-on-surface/50 font-tech">Exploring 128 connected concepts</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/30" size={16} />
              <input 
                type="text" 
                placeholder="Search concepts..." 
                className="bg-surface-container border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-indigo/50"
              />
            </div>
            <button className="p-2 bg-surface-container rounded-full text-on-surface/50 hover:text-white">
              <Filter size={18} />
            </button>
          </div>
        </header>

        {/* Mock SVG Graph */}
        <div className="flex-1 glass-card overflow-hidden relative cursor-grab active:cursor-grabbing">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Connections */}
            <line x1="50" y1="50" x2="30" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="70" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="60" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            
            {/* Nodes */}
            {nodes.map(node => (
              <g 
                key={node.id} 
                className="cursor-pointer group"
                onClick={() => setSelectedNode(node.title)}
              >
                <circle 
                  cx={node.x} cy={node.y} r="4" 
                  className={clsx(
                    "transition-all duration-300",
                    node.status === 'mastered' ? "fill-secondary shadow-lg shadow-secondary/20" :
                    node.status === 'learning' ? "fill-primary-indigo shadow-lg shadow-primary-indigo/20" :
                    "fill-error shadow-lg shadow-error/20",
                    selectedNode === node.title ? "stroke-white stroke-[0.5]" : "stroke-transparent"
                  )}
                />
                <text 
                  x={node.x} y={node.y + 8} 
                  textAnchor="middle" 
                  className={clsx(
                    "text-[3px] font-tech transition-colors",
                    selectedNode === node.title ? "fill-white font-bold" : "fill-on-surface/40"
                  )}
                >
                  {node.title}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 space-y-2">
            <h4 className="text-[10px] font-tech text-on-surface/30 uppercase tracking-widest">Knowledge Status</h4>
            {[
              { label: 'Mastered', color: 'bg-secondary' },
              { label: 'Learning', color: 'bg-primary-indigo' },
              { label: 'Confused', color: 'bg-error' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={clsx("w-2 h-2 rounded-full", item.color)} />
                <span className="text-[11px] text-on-surface/60 font-tech">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Panel */}
      <div className="w-96 bg-surface-lowest border-l border-white/5 p-6 flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Details</h2>
          <button className="text-on-surface/30 hover:text-white">
            <Info size={20} />
          </button>
        </div>

        <div>
          <span className="text-[10px] font-tech text-primary-indigo uppercase tracking-widest font-bold">Concept</span>
          <h3 className="text-2xl font-bold mt-1">{selectedNode || 'Select a concept'}</h3>
        </div>

        <Card className="border-primary-indigo/20 bg-primary-indigo/5 p-4">
          <div className="flex items-center gap-2 text-primary-indigo mb-2">
            <Zap size={14} />
            <span className="text-xs font-bold uppercase tracking-tighter">AI Insight</span>
          </div>
          <p className="text-xs text-on-surface/80 leading-relaxed italic">
            {selectedConcept?.confusionScore > 0.4 
              ? `You are currently struggling with ${selectedNode}. Your confusion score is high (${Math.round(selectedConcept.confusionScore * 100)}%). I suggest a simplified review.` 
              : `Your mastery of ${selectedNode} is solid at ${selectedConcept?.masteryLevel}%. You're ready for more advanced challenges.`}
          </p>
        </Card>

        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-on-surface/60">Current Mastery</span>
            <span className="text-sm font-bold text-secondary">{selectedConcept?.masteryLevel}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden">
            <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${selectedConcept?.masteryLevel}%` }} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-tech text-on-surface/30 uppercase tracking-widest">Related Concepts</h4>
          <div className="flex flex-wrap gap-2">
            {selectedConcept?.relatedConcepts.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-surface-highest rounded-lg text-xs hover:bg-surface-bright cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <button 
            onClick={handleDiveDeeper}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Network size={18} />
            <span>Dive Deeper</span>
          </button>
          <button 
            onClick={handleQuickQuiz}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <HelpCircle size={18} />
            <span>Quick Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
