import { useState, useEffect, type FormEvent } from 'react';
import { Settings, Plus, Edit2, Trash2, Loader2, ExternalLink, Link2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import client from '@/api/client';

// ── Types ──

interface ProcessingRecord {
  id: number;
  loanNumber?: string;
  borrowerName: string;
  loName?: string;
  processorName?: string;
  orderType: string;
  vendorName?: string;
  status: string;
  orderDate?: string;
  receivedDate?: string;
  dueDate?: string;
  amount?: number;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProcessingLink {
  id: number;
  tab: string;
  name: string;
  url: string;
  sortOrder: number;
  email?: string;
  phone?: string;
  fax?: string;
  agentName?: string;
  agentEmail?: string;
  icon?: string;
  category?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

type Tab = 'records' | 'links';

// ── Status badge ──

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-300',
    ordered: 'bg-blue-500/20 text-blue-300',
    received: 'bg-green-500/20 text-green-300',
    cancelled: 'bg-red-500/20 text-red-300',
    in_progress: 'bg-purple-500/20 text-purple-300',
    completed: 'bg-green-500/20 text-green-300',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] ?? 'bg-gray-500/20 text-gray-400'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default function ProcessingPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [tab, setTab] = useState<Tab>('records');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Records state
  const [records, setRecords] = useState<ProcessingRecord[]>([]);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProcessingRecord | null>(null);
  const [recordForm, setRecordForm] = useState({
    loanNumber: '',
    borrowerName: '',
    loName: '',
    processorName: '',
    orderType: '',
    vendorName: '',
    status: 'ordered',
    orderDate: '',
    notes: '',
  });

  // Links state
  const [links, setLinks] = useState<ProcessingLink[]>([]);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState<ProcessingLink | null>(null);
  const [linkForm, setLinkForm] = useState({
    tab: '',
    name: '',
    url: '',
    email: '',
    phone: '',
    fax: '',
    category: '',
  });

  useEffect(() => {
    if (tab === 'records') fetchRecords();
    else fetchLinks();
  }, [tab]);

  async function fetchRecords() {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/processing');
      setRecords(data);
    } catch {
      setError('Failed to load records');
    } finally {
      setLoading(false);
    }
  }

  async function fetchLinks() {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/processing/links');
      setLinks(data);
    } catch {
      setError('Failed to load links');
    } finally {
      setLoading(false);
    }
  }

  // ── Record CRUD ──

  function openRecordForm(record?: ProcessingRecord) {
    if (record) {
      setEditingRecord(record);
      setRecordForm({
        loanNumber: record.loanNumber ?? '',
        borrowerName: record.borrowerName,
        loName: record.loName ?? '',
        processorName: record.processorName ?? '',
        orderType: record.orderType,
        vendorName: record.vendorName ?? '',
        status: record.status,
        orderDate: record.orderDate ?? '',
        notes: record.notes ?? '',
      });
    } else {
      setEditingRecord(null);
      setRecordForm({
        loanNumber: '',
        borrowerName: '',
        loName: '',
        processorName: '',
        orderType: '',
        vendorName: '',
        status: 'ordered',
        orderDate: '',
        notes: '',
      });
    }
    setShowRecordForm(true);
  }

  async function handleSaveRecord(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (editingRecord) {
        await client.put(`/processing/${editingRecord.id}`, recordForm);
      } else {
        await client.post('/processing', recordForm);
      }
      setShowRecordForm(false);
      fetchRecords();
    } catch {
      setError('Failed to save record');
    }
  }

  async function handleDeleteRecord(id: number) {
    if (!confirm('Delete this processing record?')) return;
    try {
      await client.delete(`/processing/${id}`);
      fetchRecords();
    } catch {
      setError('Failed to delete record');
    }
  }

  // ── Link CRUD ──

  function openLinkForm(link?: ProcessingLink) {
    if (link) {
      setEditingLink(link);
      setLinkForm({
        tab: link.tab,
        name: link.name,
        url: link.url,
        email: link.email ?? '',
        phone: link.phone ?? '',
        fax: link.fax ?? '',
        category: link.category ?? '',
      });
    } else {
      setEditingLink(null);
      setLinkForm({ tab: '', name: '', url: '', email: '', phone: '', fax: '', category: '' });
    }
    setShowLinkForm(true);
  }

  async function handleSaveLink(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (editingLink) {
        await client.put(`/processing/links/${editingLink.id}`, linkForm);
      } else {
        await client.post('/processing/links', linkForm);
      }
      setShowLinkForm(false);
      fetchLinks();
    } catch {
      setError('Failed to save link');
    }
  }

  async function handleDeleteLink(id: number) {
    if (!confirm('Delete this link?')) return;
    try {
      await client.delete(`/processing/links/${id}`);
      fetchLinks();
    } catch {
      setError('Failed to delete link');
    }
  }

  // Group links by tab
  const linksByTab = links.reduce<Record<string, ProcessingLink[]>>((acc, link) => {
    const key = link.tab || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(link);
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
          <Settings size={28} className="text-brand-400" />
          Processing
        </h1>
        <p className="text-gray-500 mt-1">Track processing orders and access quick links</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-red-400">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-700 pb-px">
        {([
          { key: 'records' as Tab, label: 'Records', icon: <Settings size={16} /> },
          { key: 'links' as Tab, label: 'Quick Links', icon: <Link2 size={16} /> },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.key
                ? 'bg-gray-800 text-gray-100 border-b-2 border-brand-500'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      )}

      {/* ─── Records tab ─── */}
      {tab === 'records' && !loading && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openRecordForm()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={16} />
              New Record
            </button>
          </div>

          {/* Record form */}
          {showRecordForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                {editingRecord ? 'Edit Record' : 'New Processing Record'}
              </h3>
              <form onSubmit={handleSaveRecord} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Loan #</label>
                    <input
                      value={recordForm.loanNumber}
                      onChange={(e) => setRecordForm({ ...recordForm, loanNumber: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Borrower</label>
                    <input
                      required
                      value={recordForm.borrowerName}
                      onChange={(e) => setRecordForm({ ...recordForm, borrowerName: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">LO</label>
                    <input
                      value={recordForm.loName}
                      onChange={(e) => setRecordForm({ ...recordForm, loName: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Processor</label>
                    <input
                      value={recordForm.processorName}
                      onChange={(e) => setRecordForm({ ...recordForm, processorName: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Order Type</label>
                    <input
                      required
                      value={recordForm.orderType}
                      onChange={(e) => setRecordForm({ ...recordForm, orderType: e.target.value })}
                      placeholder="e.g. Appraisal, Title, HOI"
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Vendor</label>
                    <input
                      value={recordForm.vendorName}
                      onChange={(e) => setRecordForm({ ...recordForm, vendorName: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select
                      value={recordForm.status}
                      onChange={(e) => setRecordForm({ ...recordForm, status: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    >
                      <option value="pending">Pending</option>
                      <option value="ordered">Ordered</option>
                      <option value="in_progress">In Progress</option>
                      <option value="received">Received</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Order Date</label>
                    <input
                      type="date"
                      value={recordForm.orderDate}
                      onChange={(e) => setRecordForm({ ...recordForm, orderDate: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={recordForm.notes}
                    onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowRecordForm(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    {editingRecord ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Records table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Loan #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Borrower</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">LO</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Processor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Order Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Order Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Received</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-500 text-sm">No processing records</td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-sm text-gray-300">{r.loanNumber || '--'}</td>
                      <td className="px-4 py-3 text-sm text-gray-200">{r.borrowerName}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{r.loName || '--'}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{r.processorName || '--'}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{r.orderType}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{r.vendorName || '--'}</td>
                      <td className="px-4 py-3">{statusBadge(r.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {r.orderDate ? new Date(r.orderDate).toLocaleDateString() : '--'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {r.receivedDate ? new Date(r.receivedDate).toLocaleDateString() : '--'}
                      </td>
                      <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                        <button onClick={() => openRecordForm(r)} className="text-gray-400 hover:text-blue-400 p-1"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteRecord(r.id)} className="text-gray-400 hover:text-red-400 p-1"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Quick Links tab ─── */}
      {tab === 'links' && !loading && (
        <div>
          {isAdmin && (
            <div className="flex justify-end mb-4">
              <button onClick={() => openLinkForm()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus size={16} />
                New Link
              </button>
            </div>
          )}

          {/* Link form */}
          {showLinkForm && isAdmin && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                {editingLink ? 'Edit Link' : 'New Quick Link'}
              </h3>
              <form onSubmit={handleSaveLink} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tab / Section</label>
                    <input
                      required
                      value={linkForm.tab}
                      onChange={(e) => setLinkForm({ ...linkForm, tab: e.target.value })}
                      placeholder="e.g. Insurance, VOE, AMC"
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      required
                      value={linkForm.name}
                      onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                    <input
                      required
                      value={linkForm.url}
                      onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      value={linkForm.email}
                      onChange={(e) => setLinkForm({ ...linkForm, email: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    <input
                      value={linkForm.phone}
                      onChange={(e) => setLinkForm({ ...linkForm, phone: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                    <input
                      value={linkForm.category}
                      onChange={(e) => setLinkForm({ ...linkForm, category: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowLinkForm(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    {editingLink ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Links grouped by tab */}
          {Object.keys(linksByTab).length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <p className="text-gray-500 text-sm">No quick links configured</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(linksByTab).map(([tabName, tabLinks]) => (
                <div key={tabName} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">{tabName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tabLinks.map((link) => (
                      <div key={link.id} className="border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors group">
                        <div className="flex items-center justify-between mb-1">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            {link.name}
                            <ExternalLink size={12} />
                          </a>
                          {isAdmin && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                              <button onClick={() => openLinkForm(link)} className="text-gray-500 hover:text-blue-400 p-0.5"><Edit2 size={14} /></button>
                              <button onClick={() => handleDeleteLink(link.id)} className="text-gray-500 hover:text-red-400 p-0.5"><Trash2 size={14} /></button>
                            </div>
                          )}
                        </div>
                        {(link.email || link.phone) && (
                          <div className="text-xs text-gray-500 space-y-0.5">
                            {link.email && <p>{link.email}</p>}
                            {link.phone && <p>{link.phone}</p>}
                            {link.fax && <p>Fax: {link.fax}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
