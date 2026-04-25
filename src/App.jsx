import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import KnowledgeGraph from './pages/KnowledgeGraph';
import Session from './pages/Session';
import Quiz from './pages/Quiz';
import Analytics from './pages/Analytics';
import Auth from './pages/Auth';
import { useStore } from './store/useStore';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const user = useStore(state => state.user);

  if (!user) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'graph':
        return <KnowledgeGraph />;
      case 'sessions':
        return <Session />;
      case 'quiz':
        return <Quiz />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-on-surface overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto bg-[#0a0a0f]">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
