import React, { useState, useEffect } from 'react';
import { progressApi } from '../api';
import Card from '../components/ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Zap, PieChart as PieIcon, TrendingUp, Download } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await progressApi.getAnalytics();
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-primary-indigo/20 border-t-primary-indigo rounded-full animate-spin"></div>
      </div>
    );
  }

  const { learningData, retentionData, subjectData, topicsToRevisit } = data;


  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Analytics</h1>
          <p className="text-on-surface/50">Real-time performance metrics and retention tracking.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <TrendingUp size={18} />
            <span>Last 30 Days</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Learning Speed" subtitle="+14% vs last week" icon={Zap}>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={learningData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#e4e1ed', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1b1b23', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#c0c1ff' }}
                />
                <Bar dataKey="concepts" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-on-surface/30 mt-4 text-center uppercase tracking-widest font-tech">
            Concepts mastered per session over the current week
          </p>
        </Card>

        <Card title="Subject Breakdown" icon={PieIcon}>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold">84%</span>
              <span className="text-[10px] text-on-surface/40 uppercase font-tech">Total Focus</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {subjectData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}} />
                <span className="text-[11px] text-on-surface/60 font-tech">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Retention Rate Over 30 Days" className="lg:col-span-2">
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#e4e1ed', fontSize: 10}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#6366F1" fillOpacity={1} fill="url(#colorRate)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Topics to Revisit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicsToRevisit?.map(topic => (
            <Card key={topic.title} className="bg-surface-lowest hover:bg-surface-container transition-colors group">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-highest rounded-xl flex items-center justify-center font-bold text-on-surface/40 group-hover:text-primary-indigo transition-colors">
                    {topic.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{topic.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-24 h-1 bg-surface-highest rounded-full overflow-hidden">
                        <div className="h-full bg-error" style={{width: `${topic.recall}%`}} />
                      </div>
                      <span className="text-[10px] text-error font-tech">{topic.recall}% Recall</span>
                    </div>
                  </div>
                </div>
                <button className="btn-secondary py-2 px-4 text-xs">Study Now</button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
