import { useState, useEffect, type FormEvent } from 'react';
import { Loader2, Plus, Edit2, Trash2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import client from '@/api/client';

// ── Types ──

interface MondayBoard {
  id: number;
  boardId: string;
  boardName: string;
  boardType?: string;
  columnMappings?: string;
  enabled: boolean;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MondayPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [boards, setBoards] = useState<MondayBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingBoard, setEditingBoard] = useState<MondayBoard | null>(null);
  const [form, setForm] = useState({
    boardId: '',
    boardName: '',
    boardType: '',
    columnMappings: '',
    enabled: true,
  });

  useEffect(() => {
    fetchBoards();
  }, []);

  async function fetchBoards() {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/monday/boards');
      setBoards(data);
    } catch {
      setError('Failed to load Monday.com boards');
    } finally {
      setLoading(false);
    }
  }

  function openForm(board?: MondayBoard) {
    if (board) {
      setEditingBoard(board);
      setForm({
        boardId: board.boardId,
        boardName: board.boardName,
        boardType: board.boardType ?? '',
        columnMappings: board.columnMappings ?? '',
        enabled: board.enabled,
      });
    } else {
      setEditingBoard(null);
      setForm({ boardId: '', boardName: '', boardType: '', columnMappings: '', enabled: true });
    }
    setShowForm(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        columnMappings: form.columnMappings || null,
      };
      if (editingBoard) {
        await client.put(`/monday/boards/${editingBoard.boardId}`, payload);
      } else {
        await client.post('/monday/boards', payload);
      }
      setShowForm(false);
      fetchBoards();
    } catch {
      setError('Failed to save board');
    }
  }

  async function handleDelete(boardId: string) {
    if (!confirm('Delete this Monday.com board connection?')) return;
    try {
      await client.delete(`/monday/boards/${boardId}`);
      fetchBoards();
    } catch {
      setError('Failed to delete board');
    }
  }

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            <div className="w-7 h-7 bg-[#ff3d57] rounded flex items-center justify-center text-white text-xs font-bold">M</div>
            Monday.com
          </h1>
          <p className="text-gray-500 mt-1">Manage connected Monday.com boards</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => openForm()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Add Board
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-red-400">{error}</div>
      )}

      {/* Form */}
      {showForm && isAdmin && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            {editingBoard ? 'Edit Board' : 'Connect Board'}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Board ID</label>
                <input
                  required
                  disabled={!!editingBoard}
                  value={form.boardId}
                  onChange={(e) => setForm({ ...form, boardId: e.target.value })}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100 disabled:opacity-50"
                  placeholder="e.g. 1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Board Name</label>
                <input
                  required
                  value={form.boardName}
                  onChange={(e) => setForm({ ...form, boardName: e.target.value })}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Board Type / Target Section</label>
                <input
                  value={form.boardType}
                  onChange={(e) => setForm({ ...form, boardType: e.target.value })}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                  placeholder="e.g. pipeline, pre-approvals"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm text-gray-300">Enabled</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Column Mappings (JSON)</label>
              <textarea
                rows={3}
                value={form.columnMappings}
                onChange={(e) => setForm({ ...form, columnMappings: e.target.value })}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100 font-mono text-sm"
                placeholder='{"status": "status_column", "name": "name_column"}'
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200">
                Cancel
              </button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {editingBoard ? 'Update' : 'Connect'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Boards list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : boards.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-sm">No Monday.com boards connected</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boards.map((board) => (
            <div key={board.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-100">{board.boardName}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">ID: {board.boardId}</p>
                </div>
                <div className="flex items-center gap-1">
                  {board.enabled ? (
                    <CheckCircle size={16} className="text-green-400" />
                  ) : (
                    <XCircle size={16} className="text-gray-500" />
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="text-gray-300">{board.boardType || '--'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${board.enabled ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
                    {board.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Sync</span>
                  <span className="text-gray-300 flex items-center gap-1">
                    <RefreshCw size={12} />
                    {formatDate(board.lastSyncAt)}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="flex gap-2 border-t border-gray-700 pt-3">
                  <button
                    onClick={() => openForm(board)}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(board.boardId)}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
