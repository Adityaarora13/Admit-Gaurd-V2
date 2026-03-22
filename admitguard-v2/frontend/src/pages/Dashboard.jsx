import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, Cell 
} from 'recharts';
import { getAllSubmissions } from '../utils/localStore';
import { 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  PieChart
} from 'lucide-react';

const Dashboard = () => {
  const submissions = useMemo(() => getAllSubmissions(), []);

  const stats = useMemo(() => {
    const total = submissions.length;
    if (total === 0) return { total: 0, clean: 0, flagged: 0, avgRisk: 0, cleanPct: 0, flaggedPct: 0 };
    
    const clean = submissions.filter(s => s.tier === 'CLEAN').length;
    const flagged = submissions.filter(s => s.tier === 'SOFT_FLAG').length;
    const avgRisk = Math.round(submissions.reduce((acc, s) => acc + s.risk_score, 0) / total);
    
    return {
      total,
      clean,
      flagged,
      avgRisk,
      cleanPct: Math.round((clean / total) * 100),
      flaggedPct: Math.round((flagged / total) * 100)
    };
  }, [submissions]);

  const categoryData = useMemo(() => {
    const counts = {
      'Strong Fit': 0,
      'Needs Review': 0,
      'Weak Fit': 0,
      'Anomaly': 0
    };
    submissions.forEach(s => {
      if (counts[s.category] !== undefined) counts[s.category]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [submissions]);

  const timeData = useMemo(() => {
    const groups = {};
    submissions.forEach(s => {
      const date = new Date(s.timestamp).toLocaleDateString();
      groups[date] = (groups[date] || 0) + 1;
    });
    return Object.entries(groups).map(([date, count]) => ({ date, count }));
  }, [submissions]);

  const riskDistribution = useMemo(() => {
    const total = submissions.length;
    if (total === 0) return { green: 0, yellow: 0, red: 0 };
    
    const green = (submissions.filter(s => s.risk_score >= 75).length / total) * 100;
    const yellow = (submissions.filter(s => s.risk_score >= 55 && s.risk_score < 75).length / total) * 100;
    const red = (submissions.filter(s => s.risk_score < 55).length / total) * 100;
    
    return { green, yellow, red };
  }, [submissions]);

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
          <PieChart className="w-12 h-12 text-indigo-200" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Data Available</h2>
          <p className="text-gray-500">Submit some applications to see analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Analytics</h2>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Activity className="w-4 h-4" />
          Live Metrics
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Total Applications" 
          value={stats.total} 
          color="indigo" 
        />
        <StatCard 
          icon={CheckCircle} 
          label="Clean Submissions" 
          value={stats.clean} 
          subValue={`${stats.cleanPct}% of total`}
          color="emerald" 
        />
        <StatCard 
          icon={AlertTriangle} 
          label="Flagged Applications" 
          value={stats.flagged} 
          subValue={`${stats.flaggedPct}% of total`}
          color="amber" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Avg Risk Score" 
          value={stats.avgRisk} 
          color="rose" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="font-bold text-gray-900">Applications by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.name === 'Strong Fit' ? '#10b981' : 
                      entry.name === 'Needs Review' ? '#f59e0b' : 
                      entry.name === 'Weak Fit' ? '#ef4444' : '#8b5cf6'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="font-bold text-gray-900">Submissions Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} dot={{r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Risk Distribution</h3>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Low Risk</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> Medium Risk</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /> High Risk</div>
          </div>
        </div>
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${riskDistribution.green}%` }} />
          <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${riskDistribution.yellow}%`, transitionDelay: '200ms' }} />
          <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${riskDistribution.red}%`, transitionDelay: '400ms' }} />
        </div>
        <div className="flex justify-between text-xs font-bold text-gray-400">
          <span>{Math.round(riskDistribution.green)}% Low</span>
          <span>{Math.round(riskDistribution.yellow)}% Medium</span>
          <span>{Math.round(riskDistribution.red)}% High</span>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subValue, color }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-3xl font-black text-gray-900">{value}</h4>
          {subValue && <span className="text-xs font-bold text-gray-400">{subValue}</span>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
