import { useState, useEffect, type FormEvent } from 'react';
import {
  Pen,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Sparkles,
  X,
  Loader2,
  FileText,
  LayoutTemplate,
} from 'lucide-react';
import client from '@/api/client';

// ── Types ──

interface PromptTemplate {
  id: number;
  name: string;
  description?: string;
  promptText: string;
  platform?: string;
  category?: string;
  contentType?: string;
  variables?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContentItem {
  id: number;
  platform: string;
  contentType?: string;
  content: string;
  status: string;
  approvedAt?: string;
  scheduledFor?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: number; name: string };
  template?: { id: number; name: string };
}

type Tab = 'templates' | 'items' | 'search';

// ── Status badge helper ──

function statusBadge(status: string) {
  const map: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-300',
    pending: 'bg-yellow-500/20 text-yellow-300',
    approved: 'bg-blue-500/20 text-blue-300',
    published: 'bg-green-500/20 text-green-300',
    scheduled: 'bg-purple-500/20 text-purple-300',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] ?? 'bg-gray-500/20 text-gray-400'}`}>
      {status}
    </span>
  );
}

// ── Main component ──

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>('templates');
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Template form state
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    promptText: '',
    platform: '',
    contentType: '',
    isActive: true,
  });

  // Generate state
  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  // ── Fetch data on tab change ──

  useEffect(() => {
    if (tab === 'templates') fetchTemplates();
    else if (tab === 'items') fetchItems();
  }, [tab]);

  async function fetchTemplates() {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/content/templates');
      setTemplates(data);
    } catch {
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  }

  async function fetchItems() {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/content/items');
      setItems(data);
    } catch {
      setError('Failed to load content items');
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/content/search', { params: { query: searchQuery } });
      setSearchResults(data);
    } catch {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }

  // ── Template CRUD ──

  function openTemplateForm(template?: PromptTemplate) {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({
        name: template.name,
        description: template.description ?? '',
        promptText: template.promptText,
        platform: template.platform ?? '',
        contentType: template.contentType ?? '',
        isActive: template.isActive,
      });
    } else {
      setEditingTemplate(null);
      setTemplateForm({ name: '', description: '', promptText: '', platform: '', contentType: '', isActive: true });
    }
    setShowTemplateForm(true);
  }

  async function handleSaveTemplate(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (editingTemplate) {
        await client.put(`/content/templates/${editingTemplate.id}`, templateForm);
      } else {
        await client.post('/content/templates', templateForm);
      }
      setShowTemplateForm(false);
      fetchTemplates();
    } catch {
      setError('Failed to save template');
    }
  }

  // ── Item actions ──

  async function handleApprove(id: number) {
    try {
      await client.post(`/content/items/${id}/approve`);
      fetchItems();
    } catch {
      setError('Failed to approve item');
    }
  }

  async function handleDeleteItem(id: number) {
    if (!confirm('Delete this content item?')) return;
    try {
      await client.delete(`/content/items/${id}`);
      fetchItems();
    } catch {
      setError('Failed to delete item');
    }
  }

  // ── Generate ──

  async function handleGenerate() {
    setGenerating(true);
    setGeneratedResult(null);
    try {
      const { data } = await client.post('/content/generate', {
        prompt: 'Generate a social media post about mortgage rates',
        platform: 'linkedin',
      });
      setGeneratedResult(data.content ?? JSON.stringify(data, null, 2));
    } catch {
      setGeneratedResult('Generation failed. The AI service may not be configured yet.');
    } finally {
      setGenerating(false);
    }
  }

  // ── Render ──

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'templates', label: 'Templates', icon: <LayoutTemplate size={16} /> },
    { key: 'items', label: 'Items', icon: <FileText size={16} /> },
    { key: 'search', label: 'Search', icon: <Search size={16} /> },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            <Pen size={28} className="text-brand-400" />
            Content Engine
          </h1>
          <p className="text-gray-500 mt-1">Manage templates, content items, and AI generation</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Generate
        </button>
      </div>

      {/* Generated result */}
      {generatedResult && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-300">Generated Content</h3>
            <button onClick={() => setGeneratedResult(null)} className="text-gray-400 hover:text-gray-200">
              <X size={16} />
            </button>
          </div>
          <p className="text-gray-300 text-sm whitespace-pre-wrap">{generatedResult}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-red-400">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-700 pb-px">
        {tabs.map((t) => (
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      )}

      {/* ─── Templates tab ─── */}
      {tab === 'templates' && !loading && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openTemplateForm()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={16} />
              New Template
            </button>
          </div>

          {/* Template form modal */}
          {showTemplateForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                {editingTemplate ? 'Edit Template' : 'New Template'}
              </h3>
              <form onSubmit={handleSaveTemplate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      required
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                    <select
                      value={templateForm.platform}
                      onChange={(e) => setTemplateForm({ ...templateForm, platform: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    >
                      <option value="">All Platforms</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Content Type</label>
                    <input
                      value={templateForm.contentType}
                      onChange={(e) => setTemplateForm({ ...templateForm, contentType: e.target.value })}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                      placeholder="e.g. post, story, article"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      checked={templateForm.isActive}
                      onChange={(e) => setTemplateForm({ ...templateForm, isActive: e.target.checked })}
                      className="rounded"
                    />
                    <label className="text-sm text-gray-300">Active</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <input
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Prompt Text</label>
                  <textarea
                    required
                    rows={4}
                    value={templateForm.promptText}
                    onChange={(e) => setTemplateForm({ ...templateForm, promptText: e.target.value })}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowTemplateForm(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    {editingTemplate ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Templates table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Platform</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {templates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">No templates found</td>
                  </tr>
                ) : (
                  templates.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-sm text-gray-200">{t.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{t.platform || '--'}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{t.contentType || '--'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
                          {t.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => openTemplateForm(t)} className="text-gray-400 hover:text-blue-400 p-1">
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Items tab ─── */}
      {tab === 'items' && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Content</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Platform</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">No content items found</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-sm text-gray-200 max-w-xs truncate">
                      {item.content?.substring(0, 80)}...
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 capitalize">{item.platform}</td>
                    <td className="px-4 py-3">{statusBadge(item.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                      {item.status === 'draft' && (
                        <button onClick={() => handleApprove(item.id)} className="text-gray-400 hover:text-green-400 p-1" title="Approve">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button onClick={() => handleDeleteItem(item.id)} className="text-gray-400 hover:text-red-400 p-1" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Search tab ─── */}
      {tab === 'search' && !loading && (
        <div>
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content..."
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-3 py-2 w-full text-gray-100"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Search
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Content</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Platform</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {searchResults.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-sm text-gray-200 max-w-md truncate">
                        {item.content?.substring(0, 100)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 capitalize">{item.platform}</td>
                      <td className="px-4 py-3">{statusBadge(item.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {searchQuery && searchResults.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-8 text-sm">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}
