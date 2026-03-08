import { useState, useEffect } from 'react';
import { Target, Save } from 'lucide-react';
import { goals } from '@/api';
import type { Goal } from '@/types';

type Period = 'monthly' | 'quarterly' | 'yearly';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

export default function GoalsPage() {
  const [data, setData] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<Period>('monthly');
  const [saving, setSaving] = useState(false);

  // Editable targets
  const [editTargets, setEditTargets] = useState<Record<number, number>>({});
  const [editMode, setEditMode] = useState(false);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentQuarter = Math.ceil(currentMonth / 3);

  const periodValue = period === 'monthly'
    ? `${currentYear}-${String(currentMonth).padStart(2, '0')}`
    : period === 'quarterly'
      ? `${currentYear}-Q${currentQuarter}`
      : String(currentYear);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await goals.getAll({
        period_type: period,
        period_value: periodValue,
      });
      setData(result);
      // Init edit targets
      const targets: Record<number, number> = {};
      result.forEach((g) => {
        targets[g.id] = g.target;
      });
      setEditTargets(targets);
    } catch {
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = data.map((g) => ({
        ...g,
        target: editTargets[g.id] ?? g.target,
      }));
      await goals.upsert(updates);
      setEditMode(false);
      fetchData();
    } catch {
      setError('Failed to save goals');
    } finally {
      setSaving(false);
    }
  };

  const getProgressPercent = (current: number, target: number) => {
    if (target <= 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 100) return 'bg-green-500';
    if (pct >= 75) return 'bg-blue-500';
    if (pct >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Group goals by type
  const unitGoals = data.filter((g) => g.type === 'units');
  const volumeGoals = data.filter((g) => g.type === 'volume');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            <Target size={28} className="text-brand-400" />
            Goals
          </h1>
          <p className="text-gray-500 mt-1">Track progress toward your targets</p>
        </div>
        <div className="flex items-center gap-3">
          {editMode ? (
            <>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                <Save size={16} />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditMode(false)} className="btn-ghost">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="btn-ghost">
              Edit Goals
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Period selector */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 w-fit mb-6">
        {(['monthly', 'quarterly', 'yearly'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
              period === p
                ? 'bg-brand-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="card text-center py-12">
          <Target size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">No goals set for this period</p>
          <p className="text-gray-600 text-sm mt-1">Click "Edit Goals" to set targets</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Unit goals */}
          {unitGoals.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">Unit Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unitGoals.map((goal) => {
                  const pct = getProgressPercent(goal.current, editTargets[goal.id] ?? goal.target);
                  return (
                    <div key={goal.id} className="card">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-200">{goal.userName}</h3>
                        <span className="text-xs text-gray-500">Units</span>
                      </div>
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <span className="text-3xl font-bold text-gray-100">{goal.current}</span>
                          <span className="text-gray-500 ml-1">
                            / {editMode ? (
                              <input
                                type="number"
                                value={editTargets[goal.id] ?? goal.target}
                                onChange={(e) =>
                                  setEditTargets({ ...editTargets, [goal.id]: Number(e.target.value) })
                                }
                                className="input-field w-20 inline py-1 px-2 text-sm"
                              />
                            ) : (
                              goal.target
                            )}
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${pct >= 100 ? 'text-green-400' : 'text-gray-400'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(pct)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Volume goals */}
          {volumeGoals.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">Volume Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {volumeGoals.map((goal) => {
                  const target = editTargets[goal.id] ?? goal.target;
                  const pct = getProgressPercent(goal.current, target);
                  return (
                    <div key={goal.id} className="card">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-200">{goal.userName}</h3>
                        <span className="text-xs text-gray-500">Volume</span>
                      </div>
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <span className="text-2xl font-bold text-gray-100">{formatCurrency(goal.current)}</span>
                          <span className="text-gray-500 text-sm ml-1">
                            / {editMode ? (
                              <input
                                type="number"
                                value={target}
                                onChange={(e) =>
                                  setEditTargets({ ...editTargets, [goal.id]: Number(e.target.value) })
                                }
                                className="input-field w-28 inline py-1 px-2 text-sm"
                              />
                            ) : (
                              formatCurrency(target)
                            )}
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${pct >= 100 ? 'text-green-400' : 'text-gray-400'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(pct)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
