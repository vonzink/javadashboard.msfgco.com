import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, X } from 'lucide-react';
import { calendar } from '@/api';
import { useAuth } from '@/context/AuthContext';
import type { CalendarEvent } from '@/types';

const EVENT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export default function CalendarPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Date range filter
  const [startFilter, setStartFilter] = useState('');
  const [endFilter, setEndFilter] = useState('');

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    allDay: false,
    color: EVENT_COLORS[0],
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: { start?: string; end?: string } = {};
      if (startFilter) params.start = new Date(startFilter).toISOString();
      if (endFilter) params.end = new Date(endFilter).toISOString();
      const result = await calendar.getAll(params);
      setEvents(result);
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startFilter, endFilter]);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.startDate) return;
    setSaving(true);
    try {
      await calendar.create({
        title: form.title,
        description: form.description || undefined,
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
        allDay: form.allDay,
        color: form.color,
      });
      setShowForm(false);
      setForm({ title: '', description: '', startDate: '', endDate: '', allDay: false, color: EVENT_COLORS[0] });
      fetchData();
    } catch {
      setError('Failed to create event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this event?')) return;
    try {
      await calendar.delete(id);
      fetchData();
    } catch {
      setError('Failed to delete');
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

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
            <CalendarIcon size={28} className="text-brand-400" />
            Calendar
          </h1>
          <p className="text-gray-500 mt-1">{events.length} events</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Event
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Date range filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">From:</label>
          <input
            type="date"
            value={startFilter}
            onChange={(e) => setStartFilter(e.target.value)}
            className="input-field text-sm py-1.5"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">To:</label>
          <input
            type="date"
            value={endFilter}
            onChange={(e) => setEndFilter(e.target.value)}
            className="input-field text-sm py-1.5"
          />
        </div>
        {(startFilter || endFilter) && (
          <button
            onClick={() => {
              setStartFilter('');
              setEndFilter('');
            }}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">New Event</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Event title"
              className="input-field md:col-span-2"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description (optional)"
              rows={2}
              className="input-field md:col-span-2"
            />
            <input
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="input-field"
            />
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="input-field"
            />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.allDay}
                  onChange={(e) => setForm({ ...form, allDay: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-brand-500 focus:ring-brand-500"
                />
                All day event
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Color:</span>
              <div className="flex gap-1.5">
                {EVENT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setForm({ ...form, color })}
                    className={`w-6 h-6 rounded-full transition-all ${
                      form.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleCreate} disabled={saving} className="btn-primary">
              {saving ? 'Creating...' : 'Create Event'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Events list */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="w-3"></th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Event</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Start</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">End</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Recurrence</th>
              {isAdmin && (
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                <td className="pl-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: event.color || '#3b82f6' }}
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-200">{event.title}</p>
                  {event.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{event.description}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  <div>{formatDate(event.startDate)}</div>
                  {!event.allDay && (
                    <div className="text-xs text-gray-500">{formatTime(event.startDate)}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {event.endDate ? (
                    <>
                      <div>{formatDate(event.endDate)}</div>
                      {!event.allDay && (
                        <div className="text-xs text-gray-500">{formatTime(event.endDate)}</div>
                      )}
                    </>
                  ) : (
                    '--'
                  )}
                </td>
                <td className="px-4 py-3">
                  {event.recurrence ? (
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded capitalize">
                      {event.recurrence}
                    </span>
                  ) : (
                    <span className="text-gray-600">--</span>
                  )}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-4 py-8 text-center text-gray-500">
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
