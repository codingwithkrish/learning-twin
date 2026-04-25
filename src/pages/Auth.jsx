import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import Card from '../components/ui/Card';
import { authApi } from '../api';
import { Share2, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const setUser = useStore(state => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await authApi.login({ email: form.email, password: form.password });
        setUser(res.data.username, res.data.token);
      } else {
        await authApi.register(form);
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-[#0a0a0f]">
      <Card className="w-full max-w-md p-10 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-indigo rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary-indigo/20">
            <Share2 className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold">Learning Twin</h1>
          <p className="text-on-surface/50 mt-2">{isLogin ? 'Welcome back, Evolver' : 'Start your cognitive journey'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/30" size={18} />
              <input 
                type="text" 
                placeholder="Username" 
                className="input-field w-full pl-12"
                onChange={(e) => setForm({...form, username: e.target.value})}
                required 
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/30" size={18} />
            <input 
              type="email" 
              placeholder="Email address" 
              className="input-field w-full pl-12"
              onChange={(e) => setForm({...form, email: e.target.value})}
              required 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/30" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field w-full pl-12"
              onChange={(e) => setForm({...form, password: e.target.value})}
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 mt-4 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-on-surface/40 hover:text-primary-indigo transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
