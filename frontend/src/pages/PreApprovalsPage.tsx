import { useState, useEffect } from 'react';
import { ClipboardCheck, Plus, Pencil, Trash2, X } from 'lucide-react';
import { preApprovals } from '@/api';
import { useAuth } from '@/context/AuthContext';
import type { PreApproval } from '@/types';

type PreApprovalStatus = PreApproval['status'];

const STATUS_COLORS: Record<PreApprovalStatus, string> = {
  active: 'bg-green-500/20 text-green-400',
  expired: 'bg-red-500/20 text-red-400',
  converted: 'bg-blue-500/20 text-blue-400',
  cancelled: 'bg-gray-500/20 text-gray-400',
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

export default function PreApprovalsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const [data, setData] = useState<PreApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create / Edit
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PreApproval | null>(null);
  const [form, setForm] = useState({
    clientName: '',
    loanAmount: '',
    loanType: '',
    status: 'active' as PreApprovalStatus,
    issuedDate: '',
    expirationDate: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await preApprovals.getAll();
      setData(result);
    } catch {
      setError('Failed to load pre-approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ clientName: '', loanAmount: '', loanType: '', status: 'active', issuedDate: '', expirationDate: '', notes: '' });
    setShowForm(true);
  };

  const openEdit = (item: PreApproval) => {
    setEditing(item);
    setForm({
      clientName: item.clientName,
      loanAmount: String(item.loanAmount),
      loanType: item.loanType || '',
      status: item.status,
      issuedDate: item.issuedDate?.split('T')[0] || '',
      expirationDate: item.expirationDate?.split('T')[0] || '',
      notes: item.notes || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.clientName.trim() || !form.loanAmount) return;
    setSaving(true);
    try {
      const payload = {
        clientName: form.clientName,
        loanAmount: Number(form.loanAmount),
        loanType: form.loanType || undefined,
        status: form.status,
        issuedDate: form.issuedDate || undefined,
        expirationDate: form.expirationDate || undefined,
        notes: form.notes || undefined,
      };
      if (editing) {
        await preApprovals.update(editing.id, payload);
      } else {
        await preApprovals.create(payload);
      }
      setShowForm(false);
      fetchData();
    } catch {
      setError('Failed to save pre-approval');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this pre-approval?')) return;
    try {
      await preApprovals.delete(id);
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

  const activeCount = data.filter((d) => d.status === 'active').length;
  const expiredCount = data.filter((d) => d.status === 'expired').length;
  const totalAmount = data.filter((d) => d.status === 'active').reduce((sum, d) => sum + d.loanAmount, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            <ClipboardCheck size={28} className="text-brand-400" />
            Pre-Approvals
          </h1>
          <p className="text-gray-500 mt-1">{data.length} total pre-approvals</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Pre-Approval
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{activeCount}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expired</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{expiredCount}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Volume</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">
              {editing ? 'Edit Pre-Approval' : 'New Pre-Approval'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              placeholder="Client name"
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
              onChange={(e) => setForm({ ...form, status: e.target.value as PreApprovalStatus })}
              className="input-field"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="converted">Converted</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="date"
              value={form.issuedDate}
              onChange={(e) => setForm({ ...form, issuedDate: e.target.value })}
              className="input-field"
              placeholder="Issued date"
            />
            <input
              type="date"
              value={form.expirationDate}
              onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
              className="input-field"
              placeholder="Expiration date"
            />
          </div>
          <div className="mt-4">
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes (optional)"
              rows={2}
              className="input-field w-full"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Client</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Issued</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Expires</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">LO</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-200">{item.clientName}</td>
                <td className="px-4 py-3 text-gray-300">{formatCurrency(item.loanAmount)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {item.issuedDate ? new Date(item.issuedDate).toLocaleDateString() : '--'}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : '--'}
                </td>
                <td className="px-4 py-3 text-gray-400">{item.loanOfficerName}</td>
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
                  No pre-approvals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
