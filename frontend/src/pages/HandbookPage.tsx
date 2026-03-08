import { useState, useEffect, type FormEvent } from 'react';
import { FileText, Plus, Edit2, Trash2, Loader2, ChevronRight, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import client from '@/api/client';

// ── Types ──

interface HandbookDocument {
  id: number;
  title: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HandbookSection {
  id: number;
  title: string;
  slug: string;
  content: string;
  sortOrder: number;
  isActive: boolean;
  createdBy?: { id: number; name: string };
  updatedBy?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

export default function HandbookPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [documents, setDocuments] = useState<HandbookDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [sections, setSections] = useState<HandbookSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<HandbookSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [error, setError] = useState('');

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');

  // Create section state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/handbook/documents');
      setDocuments(data);
      if (data.length > 0 && !selectedDocId) {
        setSelectedDocId(data[0].id);
      }
    } catch {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }

  // Fetch sections when document changes
  useEffect(() => {
    if (!selectedDocId) return;
    const doc = documents.find((d) => d.id === selectedDocId);
    if (!doc) return;
    fetchSections(doc.slug);
  }, [selectedDocId, documents]);

  async function fetchSections(docSlug: string) {
    setSectionsLoading(true);
    setError('');
    setSelectedSection(null);
    setEditing(false);
    try {
      // Handbook API does not have a direct "list sections by document" endpoint.
      // We use the search endpoint with an empty query or list the document to get sections.
      // The controller exposes /sections/by-slug/{docSlug}/{sectionSlug}, so we'll
      // use the search endpoint to get all sections for the document.
      const { data } = await client.get('/handbook/search', { params: { query: docSlug } });
      setSections(data);
      if (data.length > 0) {
        setSelectedSection(data[0]);
      }
    } catch {
      // Fallback: sections may be empty
      setSections([]);
    } finally {
      setSectionsLoading(false);
    }
  }

  // ── Edit section ──

  function startEdit() {
    if (!selectedSection) return;
    setEditTitle(selectedSection.title);
    setEditContent(selectedSection.content);
    setEditing(true);
  }

  async function handleSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!selectedSection) return;
    setError('');
    try {
      const { data } = await client.put(`/handbook/sections/${selectedSection.id}`, {
        title: editTitle,
        content: editContent,
      });
      // Update local state
      setSections((prev) => prev.map((s) => (s.id === data.id ? data : s)));
      setSelectedSection(data);
      setEditing(false);
    } catch {
      setError('Failed to save section');
    }
  }

  // ── Create section ──

  async function handleCreateSection(e: FormEvent) {
    e.preventDefault();
    if (!selectedDocId) return;
    setError('');
    try {
      await client.post(`/handbook/documents/${selectedDocId}/sections`, {
        title: newSectionTitle,
        slug: newSectionTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        content: newSectionContent,
        sortOrder: sections.length,
      });
      setShowCreateForm(false);
      setNewSectionTitle('');
      setNewSectionContent('');
      // Refresh sections
      const doc = documents.find((d) => d.id === selectedDocId);
      if (doc) fetchSections(doc.slug);
    } catch {
      setError('Failed to create section');
    }
  }

  // ── Delete section ──

  async function handleDeleteSection(id: number) {
    if (!confirm('Delete this section? This cannot be undone.')) return;
    try {
      await client.delete(`/handbook/sections/${id}`);
      setSections((prev) => prev.filter((s) => s.id !== id));
      if (selectedSection?.id === id) {
        setSelectedSection(sections.find((s) => s.id !== id) ?? null);
      }
    } catch {
      setError('Failed to delete section');
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
          <FileText size={28} className="text-brand-400" />
          Handbook
        </h1>
        <p className="text-gray-500 mt-1">Company handbook documents and policies</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-red-400">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="flex gap-6 min-h-[600px]">
          {/* ── Sidebar: Documents & Sections ── */}
          <div className="w-72 flex-shrink-0">
            {/* Document selector */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Documents</h3>
              <div className="space-y-1">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedDocId === doc.id
                        ? 'bg-brand-500/20 text-brand-300'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    }`}
                  >
                    {doc.title}
                  </button>
                ))}
                {documents.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">No documents</p>
                )}
              </div>
            </div>

            {/* Section list */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Sections</h3>
                {isAdmin && selectedDocId && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="text-gray-400 hover:text-brand-400"
                    title="Add section"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              {sectionsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 size={18} className="animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-1">
                  {sections.map((sec) => (
                    <div key={sec.id} className="flex items-center group">
                      <button
                        onClick={() => {
                          setSelectedSection(sec);
                          setEditing(false);
                        }}
                        className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                          selectedSection?.id === sec.id
                            ? 'bg-gray-700 text-gray-100'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                        }`}
                      >
                        <ChevronRight size={14} />
                        <span className="truncate">{sec.title}</span>
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteSection(sec.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  {sections.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">No sections</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Main content area ── */}
          <div className="flex-1 min-w-0">
            {/* Create section form */}
            {showCreateForm && isAdmin && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">New Section</h3>
                <form onSubmit={handleCreateSection} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input
                      required
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                    <textarea
                      required
                      rows={8}
                      value={newSectionContent}
                      onChange={(e) => setNewSectionContent(e.target.value)}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200">
                      Cancel
                    </button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      Create
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Section content */}
            {selectedSection ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                {editing ? (
                  <form onSubmit={handleSaveEdit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                      <input
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100 text-lg font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                      <textarea
                        required
                        rows={20}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full text-gray-100 font-mono text-sm"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200">
                        <X size={16} /> Cancel
                      </button>
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Save size={16} /> Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-100">{selectedSection.title}</h2>
                      {isAdmin && (
                        <button onClick={startEdit} className="text-gray-400 hover:text-blue-400 p-1" title="Edit">
                          <Edit2 size={18} />
                        </button>
                      )}
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedSection.content}
                      </div>
                    </div>
                    {selectedSection.updatedBy && (
                      <p className="text-xs text-gray-500 mt-6">
                        Last updated by {selectedSection.updatedBy.name} on{' '}
                        {new Date(selectedSection.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                <p className="text-gray-500 text-sm">Select a section to view its content</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
