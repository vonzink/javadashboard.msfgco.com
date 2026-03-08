import { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, ExternalLink, X, Users, Key, FileText, Link2 } from 'lucide-react';
import { investors } from '@/api';
import { useAuth } from '@/context/AuthContext';
import type { Investor } from '@/types';

type DetailTab = 'team' | 'lenderIds' | 'clauses' | 'links';

export default function InvestorsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [data, setData] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Detail panel
  const [selected, setSelected] = useState<Investor | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('team');
  const [detailData, setDetailData] = useState<Record<DetailTab, unknown[]>>({
    team: [],
    lenderIds: [],
    clauses: [],
    links: [],
  });

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await investors.getAll();
      setData(result);
    } catch {
      setError('Failed to load investors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDetail = async (inv: Investor) => {
    setSelected(inv);
    setDetailTab('team');
    try {
      const full = await investors.getByKey(inv.code || String(inv.id));
      // The full investor response may contain nested data
      const fullAny = full as unknown as Record<string, unknown>;
      setDetailData({
        team: (fullAny.team as unknown[]) || [],
        lenderIds: (fullAny.lenderIds as unknown[]) || [],
        clauses: (fullAny.mortgageeClauses as unknown[]) || (fullAny.clauses as unknown[]) || [],
        links: (fullAny.links as unknown[]) || [],
      });
    } catch {
      setDetailData({ team: [], lenderIds: [], clauses: [], links: [] });
    }
  };

  const handleCreate = async () => {
    if (!createName.trim()) return;
    setCreating(true);
    try {
      await investors.create({ name: createName.trim(), active: true });
      setCreateName('');
      setShowCreate(false);
      fetchData();
    } catch {
      setError('Failed to create investor');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this investor?')) return;
    try {
      await investors.delete(id);
      if (selected?.id === id) setSelected(null);
      fetchData();
    } catch {
      setError('Failed to delete investor');
    }
  };

  const detailTabs: { key: DetailTab; label: string; icon: React.ReactNode }[] = [
    { key: 'team', label: 'Team', icon: <Users size={16} /> },
    { key: 'lenderIds', label: 'Lender IDs', icon: <Key size={16} /> },
    { key: 'clauses', label: 'Clauses', icon: <FileText size={16} /> },
    { key: 'links', label: 'Links', icon: <Link2 size={16} /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            <Building2 size={28} className="text-brand-400" />
            Investors
          </h1>
          <p className="text-gray-500 mt-1">{data.length} investors</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Investor
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="card mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">New Investor</h3>
          <div className="flex gap-3">
            <input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="Investor name"
              className="input-field flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <button onClick={handleCreate} disabled={creating} className="btn-primary">
              {creating ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setShowCreate(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Table */}
        <div className={`${selected ? 'w-1/2' : 'w-full'} transition-all`}>
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Code</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Website</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</th>
                  {isAdmin && (
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => openDetail(inv)}
                    className={`border-b border-gray-800/50 hover:bg-gray-800/40 cursor-pointer transition-colors ${
                      selected?.id === inv.id ? 'bg-brand-500/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-200">{inv.name}</td>
                    <td className="px-4 py-3 text-gray-400">{inv.code || '--'}</td>
                    <td className="px-4 py-3">
                      {inv.website ? (
                        <a
                          href={inv.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                          Link
                        </a>
                      ) : (
                        <span className="text-gray-600">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{inv.phone || '--'}</td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(inv.id);
                          }}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="px-4 py-8 text-center text-gray-500">
                      No investors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-1/2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-100">{selected.name}</h2>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-300">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                <div>
                  <span className="text-gray-500">Code:</span>
                  <span className="ml-2 text-gray-300">{selected.code || '--'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2 text-gray-300">{selected.phone || '--'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2 text-gray-300">{selected.email || '--'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Active:</span>
                  <span className={`ml-2 ${selected.active ? 'text-green-400' : 'text-red-400'}`}>
                    {selected.active ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {selected.notes && (
                <p className="text-sm text-gray-400 mb-6 bg-gray-800/50 p-3 rounded-lg">{selected.notes}</p>
              )}

              {/* Tabs */}
              <div className="flex gap-1 border-b border-gray-800 mb-4">
                {detailTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setDetailTab(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      detailTab === tab.key
                        ? 'text-brand-400 border-b-2 border-brand-400'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="text-sm">
                {(detailData[detailTab] as unknown[]).length === 0 ? (
                  <p className="text-gray-500 py-4 text-center">No {detailTab} data available</p>
                ) : (
                  <div className="space-y-2">
                    {(detailData[detailTab] as Record<string, unknown>[]).map((item, idx) => (
                      <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                        <pre className="text-gray-300 text-xs whitespace-pre-wrap">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
