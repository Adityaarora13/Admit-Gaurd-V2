import React, { useState, useMemo } from 'react';
import { 
  getAllSubmissions, 
  clearAll 
} from '../utils/localStore';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Info,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';

const AuditLog = () => {
  const [submissions, setSubmissions] = useState(getAllSubmissions());
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const itemsPerPage = 10;

  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter(s => {
        const matchesSearch = s.applicant_name.toLowerCase().includes(search.toLowerCase()) || 
                             s.email.toLowerCase().includes(search.toLowerCase());
        const matchesTier = tierFilter === 'All' || s.tier === tierFilter;
        const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
        return matchesSearch && matchesTier && matchesCategory;
      })
      .sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (sortOrder === 'desc') {
          return valA < valB ? 1 : -1;
        }
        return valA > valB ? 1 : -1;
      });
  }, [submissions, search, tierFilter, categoryFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClear = () => {
    clearAll();
    setSubmissions([]);
    setShowClearConfirm(false);
  };

  const exportCSV = () => {
    const headers = ['Timestamp', 'Name', 'Email', 'Tier', 'Risk Score', 'Category', 'Flags', 'Anomalies'];
    const rows = filteredSubmissions.map(s => [
      new Date(s.timestamp).toLocaleString(),
      s.applicant_name,
      s.email,
      s.tier,
      s.risk_score,
      s.category,
      s.flags.map(f => f.reason).join('; '),
      s.anomalies.join('; ')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `admitguard_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRowColor = (s) => {
    if (s.anomalies.length > 0) return 'bg-orange-50/50 hover:bg-orange-50';
    if (s.tier === 'SOFT_FLAG') return 'bg-amber-50/50 hover:bg-amber-50';
    return 'bg-white hover:bg-gray-50';
  };

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-in fade-in duration-500">
        <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center">
          <FileSpreadsheet className="w-16 h-16 text-indigo-200" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">No Applications Logged</h2>
          <p className="text-gray-500 max-w-xs mx-auto">Start by adding a new candidate to see the audit trail here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Audit Log</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-100 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl text-sm py-2 px-3 outline-none"
          >
            <option value="All">All Tiers</option>
            <option value="CLEAN">Clean</option>
            <option value="SOFT_FLAG">Flagged</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl text-sm py-2 px-3 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Strong Fit">Strong Fit</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Weak Fit">Weak Fit</option>
            <option value="Anomaly">Anomaly</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl text-sm py-2 px-3 outline-none"
          >
            <option value="timestamp-desc">Newest First</option>
            <option value="timestamp-asc">Oldest First</option>
            <option value="risk_score-desc">Risk: High to Low</option>
            <option value="risk_score-asc">Risk: Low to High</option>
          </select>
        </div>
      </div>

      {/* Table / Mobile Cards */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-50 dark:border-gray-800 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Risk</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {paginatedSubmissions.map((s) => (
                <React.Fragment key={s.id}>
                  <tr className={`transition-colors cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 ${expandedRow === s.id ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`} onClick={() => setExpandedRow(expandedRow === s.id ? null : s.id)}>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {new Date(s.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{s.applicant_name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        s.tier === 'CLEAN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {s.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.risk_score < 30 ? 'bg-green-500' : (s.risk_score < 70 ? 'bg-amber-500' : 'bg-red-500')}`} />
                        <span className="text-sm font-black text-gray-900 dark:text-white">{s.risk_score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{s.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {expandedRow === s.id ? <ChevronUp className="w-4 h-4 inline text-gray-400" /> : <ChevronDown className="w-4 h-4 inline text-gray-400" />}
                    </td>
                  </tr>
                  {expandedRow === s.id && (
                    <tr className="bg-gray-50/30 dark:bg-gray-800/20">
                      <td colSpan="6" className="px-6 py-6 border-t border-gray-50 dark:border-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                              <AlertCircle className="w-4 h-4" />
                              <h4 className="text-[10px] font-black uppercase tracking-widest">System Flags</h4>
                            </div>
                            {s.flags.length > 0 ? (
                              <ul className="space-y-2">
                                {s.flags.map((f, i) => (
                                  <li key={i} className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                    {f.reason}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No flags detected.</p>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                              <Info className="w-4 h-4" />
                              <h4 className="text-[10px] font-black uppercase tracking-widest">Anomalies Detected</h4>
                            </div>
                            {s.anomalies.length > 0 ? (
                              <ul className="space-y-2">
                                {s.anomalies.map((a, i) => (
                                  <li key={i} className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                                    {a}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No anomalies detected.</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Card List) */}
        <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
          {paginatedSubmissions.map((s) => (
            <div key={s.id} className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{s.applicant_name}</div>
                  <div className="text-xs text-gray-500">{s.email}</div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  s.tier === 'CLEAN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {s.tier}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="text-gray-500 dark:text-gray-400">
                  {new Date(s.timestamp).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-gray-900 dark:text-white">Risk: {s.risk_score}</span>
                  <div className={`w-2 h-2 rounded-full ${s.risk_score < 30 ? 'bg-green-500' : (s.risk_score < 70 ? 'bg-amber-500' : 'bg-red-500')}`} />
                </div>
              </div>

              <button 
                onClick={() => setExpandedRow(expandedRow === s.id ? null : s.id)}
                className="w-full py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2"
              >
                {expandedRow === s.id ? 'Hide Details' : 'View Details'}
                {expandedRow === s.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {expandedRow === s.id && (
                <div className="pt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Flags</h4>
                    <div className="space-y-1">
                      {s.flags.length > 0 ? s.flags.map((f, i) => (
                        <div key={i} className="text-[10px] text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-amber-400 mt-1 shrink-0" />
                          <span>{f.reason}</span>
                        </div>
                      )) : <span className="text-[10px] text-gray-400">None</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</h4>
                    <p className="text-xs font-bold dark:text-white">{s.category}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing {Math.min(filteredSubmissions.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredSubmissions.length, currentPage * itemsPerPage)} of {filteredSubmissions.length}
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black text-gray-900 px-2">{currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 disabled:opacity-50 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-red-600 p-6 text-white flex items-center gap-3">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-xl font-black tracking-tight">Clear Audit Log?</h3>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-gray-600 font-medium leading-relaxed">
                This will permanently delete all local submission records. This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClear}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  Yes, Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
