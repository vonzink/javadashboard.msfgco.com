import { useState, useEffect } from 'react';
import { GitBranch, Plus, Pencil, Trash2, X } from 'lucide-react';
import { pipeline } from '@/api';
import { useAuth } from '@/context/AuthContext';
import type { PipelineItem, PipelineStatus } from '@/types';

const STATUS_COLORS: Record<PipelineStatus, string> = {
  prospect: 'bg-gray-500/20 text-gray-400',
  pre_approved: 'bg-blue-500/20 text-blue-400',
  processing: 'bg-yellow-500/20 text-yellow-400',
  underwriting: 'bg-orange-500/20 text-orange-400',
  conditional_approval: 'bg-purple-500/20 text-purple-400',
  clear_to_close: 'bg-green-500/20 text-green-400',
  closed: 'bg-emerald-500/20 text-emerald-400',
  denied: 'bg-red-500/20 text-red-400',
  withdrawn: 'bg-gray-600/20 text-gray-500',
};

const STATUS_LABELS: Record<PipelineStatus, string> = {
  prospect: 'Prospect',
  pre_approved: 'Pre-Approved',
  processing: 'Processing',
  underwriting: 'Underwriting',
  conditional_approval: 'Cond. Approval',
  clear_to_close: 'Clear to Close',
  closed: 'Closed',
  denied: 'Denied',
  withdrawn: 'Withdrawn',
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

export default function PipelinePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const [data, setData] = useState<PipelineItem[]>([]);
  const [, setSummary] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create/Edit form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PipelineItem | null>(null);
  const [form, setForm] = useState({
    borrowerName: '',
    loanAmount: '',
    loanType: 'Conventional',
    status: 'prospect' as PipelineStatus,
    estimatedCloseDate: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [items, sum] = await Promise.all([pipeline.getAll(), pipeline.getSummary()]);
      setData(items);
      setSummary(sum);
    } catch {
      setError('Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ borrowerName: '', loanAmount: '', loanType: 'Conventional', status: 'prospect', estimatedCloseDate: '' });
    setShowForm(true);
  };

  const openEdit = (item: PipelineItem) => {
    setEditing(item);
    setForm({
      borrowerName: item.borrowerName,
      loanAmount: String(item.loanAmount),
      loanType: item.loanType,
      status: item.status,
      estimatedCloseDate: item.estimatedCloseDate?.split('T')[0] || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.borrowerName.trim() || !form.loanAmount) return;
    setSaving(true);
    try {
      const payload = {
        borrowerName: form.borrowerName,
        loanAmount: Number(form.loanAmount),
        loanType: form.loanType,
        status: form.status,
        estimatedCloseDate: form.estimatedCloseDate || undefined,
      };
      if (editing) {
        await pipeline.update(editing.id, payload);
      } else {
        await pipeline.create(payload);
      }
      setShowForm(false);
      fetchData();
    } catch {
      setError('Failed to save pipeline item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this pipeline item?')) return;
    try {
      await pipeline.delete(id);
      fetchData();
    } catch {
      setError('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalCount = data.length;
  const totalVolume = data.reduce((sum, item) => sum + item.loanAmount, 0);
  const byStatus = data.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            <GitBranch size={28} className="text-brand-400" />
            Pipeline
          </h1>
          <p className="text-gray-500 mt-1">{totalCount} active loans</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Loan
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Loans</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{totalCount}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Volume</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(totalVolume)}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Processing</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{byStatus['processing'] || 0}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Clear to Close</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{byStatus['clear_to_close'] || 0}</p>
        </div>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">
              {editing ? 'Edit Loan' : 'New Loan'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={form.borrowerName}
              onChange={(e) => setForm({ ...form, borrowerName: e.target.value })}
              placeholder="Borrower name"
              className="input-field"
            />
            <input
              type="number"
              value={form.loanAmount}
              onChange={(e) => setForm({ ...form, loanAmount: e.target.value })}
              placeholder="Loan amount"
              className="input-field"
            />
            <input
              value={form.loanType}
              onChange={(e) => setForm({ ...form, loanType: e.target.value })}
              placeholder="Loan type"
              className="input-field"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PipelineStatus })}
              className="input-field"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <input
              type="date"
              value={form.estimatedCloseDate}
              onChange={(e) => setForm({ ...form, estimatedCloseDate: e.target.value })}
              className="input-field"
            />
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Borrower</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">LO</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Close Date</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-200">{item.borrowerName}</td>
                <td className="px-4 py-3 text-gray-300">{formatCurrency(item.loanAmount)}</td>
                <td className="px-4 py-3 text-gray-400">{item.loanType}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{item.loanOfficerName}</td>
                <td className="px-4 py-3 text-gray-400">
                  {item.estimatedCloseDate
                    ? new Date(item.estimatedCloseDate).toLocaleDateString()
                    : '--'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="text-gray-500 hover:text-brand-400">
                      <Pencil size={16} />
                    </button>
                    {isAdmin && (
                      <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No pipeline items
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
