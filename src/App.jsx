import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import KnowledgeGraph from './pages/KnowledgeGraph';
import Session from './pages/Session';
import Quiz from './pages/Quiz';
import Analytics from './pages/Analytics';
import Auth from './pages/Auth';
import { useStore } from './store/useStore';
import { progressApi } from './api';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const { setActiveTopic, user, setGraph } = useStore();

  const handleStartNewSession = async () => {
    if (newTopic.trim()) {
      const topicToStart = newTopic.trim();
      setActiveTopic(topicToStart);
      setActivePage('sessions');
      setShowNewSessionModal(false);
      setNewTopic('');
      
      try {
        const res = await progressApi.addTopic(topicToStart);
        setGraph(res.data);
      } catch (err) {
        console.error("Failed to save new topic to db", err);
      }
    }
  };

  if (!user) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'graph':
        return <KnowledgeGraph onNavigate={setActivePage} />;
      case 'sessions':
        return <Session onNavigate={setActivePage} onNewSession={() => setShowNewSessionModal(true)} />;
      case 'quiz':
        return <Quiz />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen bg-surface text-on-surface overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onNewSession={() => setShowNewSessionModal(true)} />
      
      <main className="flex-1 overflow-y-auto relative">
        {renderPage()}
        
        {/* New Session Modal */}
        {showNewSessionModal && (
          <div className="absolute inset-0 z-[100] bg-surface/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-surface-container border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
              <h2 className="text-2xl font-bold mb-2">What's next on your journey?</h2>
              <p className="text-on-surface/50 text-sm mb-8">Enter any topic, from "Quantum Mechanics" to "Cooking Pasta." Your Learning Twin will adapt.</p>
              
              <input 
                type="text"
                autoFocus
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartNewSession()}
                placeholder="e.g. Distributed Systems"
                className="w-full bg-surface-lowest border border-white/10 rounded-xl py-4 px-6 text-lg focus:outline-none focus:border-primary-indigo/50 mb-6"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowNewSessionModal(false)}
                  className="flex-1 py-3 bg-surface-highest rounded-xl font-bold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleStartNewSession}
                  className="flex-1 py-3 bg-primary-indigo text-white rounded-xl font-bold hover:bg-primary-indigo/80 shadow-lg shadow-primary-indigo/20 transition-all"
                >
                  Start Journey
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
