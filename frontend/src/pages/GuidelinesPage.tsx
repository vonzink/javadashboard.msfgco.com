import { useState, useEffect, useRef, type FormEvent } from 'react';
import { BookOpen, Search, FileUp, Trash2, Loader2, File } from 'lucide-react';
import client from '@/api/client';

// ── Types ──

interface GuidelineChunk {
  id: number;
  chunkIndex?: number;
  sectionId?: string;
  sectionTitle?: string;
  pageNumber?: number;
  content: string;
  productType?: string;
  createdAt: string;
}

interface GuidelineFile {
  id: number;
  productType: string;
  fileName: string;
  fileSize?: number;
  versionLabel?: string;
  status: string;
  chunkCount?: number;
  uploadedBy?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

type Section = 'search' | 'files';

export default function GuidelinesPage() {
  const [section, setSection] = useState<Section>('search');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GuidelineChunk[]>([]);

  // Files state
  const [files, setFiles] = useState<GuidelineFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (section === 'files') fetchFiles();
  }, [section]);

  async function fetchFiles() {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/guidelines/files');
      setFiles(data);
    } catch {
      setError('Failed to load files');
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
      const { data } = await client.get('/guidelines/search', { params: { query: searchQuery } });
      setSearchResults(data);
    } catch {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file: File) {
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await client.post('/guidelines/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchFiles();
    } catch {
      setError('Upload failed');
    }
  }

  async function handleDeleteFile(id: number) {
    if (!confirm('Delete this guideline file and all its chunks?')) return;
    try {
      await client.delete(`/guidelines/files/${id}`);
      fetchFiles();
    } catch {
      setError('Failed to delete file');
    }
  }

  function formatBytes(bytes?: number | null) {
    if (!bytes) return '--';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  function statusBadge(status: string) {
    const map: Record<string, string> = {
      processing: 'bg-yellow-500/20 text-yellow-300',
      ready: 'bg-green-500/20 text-green-300',
      error: 'bg-red-500/20 text-red-300',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] ?? 'bg-gray-500/20 text-gray-400'}`}>
        {status}
      </span>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
          <BookOpen size={28} className="text-brand-400" />
          Guidelines
        </h1>
        <p className="text-gray-500 mt-1">Search investor guidelines and manage uploaded files</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-red-400">{error}</div>
      )}

      {/* Section toggle */}
      <div className="flex gap-1 mb-6 border-b border-gray-700 pb-px">
        {(['search', 'files'] as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors capitalize ${
              section === s
                ? 'bg-gray-800 text-gray-100 border-b-2 border-brand-500'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            {s === 'search' ? <Search size={16} /> : <File size={16} />}
            {s}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      )}

      {/* ─── Search section ─── */}
      {section === 'search' && !loading && (
        <div>
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guidelines (e.g. FHA credit score requirements)..."
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-3 py-2 w-full text-gray-100"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Search
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((chunk) => (
                <div key={chunk.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center gap-3 mb-2">
                    {chunk.sectionTitle && (
                      <h3 className="text-sm font-semibold text-gray-200">{chunk.sectionTitle}</h3>
                    )}
                    {chunk.productType && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                        {chunk.productType}
                      </span>
                    )}
                    {chunk.pageNumber && (
                      <span className="text-xs text-gray-500">Page {chunk.pageNumber}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-4 whitespace-pre-wrap">
                    {chunk.content?.substring(0, 400)}
                    {(chunk.content?.length ?? 0) > 400 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-8 text-sm">No results found</p>
          )}
        </div>
      )}

      {/* ─── Files section ─── */}
      {section === 'files' && !loading && (
        <div>
          <div className="flex justify-end mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FileUp size={16} />
              Upload File
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">File Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Product Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Chunks</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Uploaded By</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {files.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm">No files uploaded</td>
                  </tr>
                ) : (
                  files.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-sm text-gray-200">{f.fileName}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{f.productType}</td>
                      <td className="px-4 py-3">{statusBadge(f.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{f.chunkCount ?? '--'}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{formatBytes(f.fileSize)}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{f.uploadedBy?.name ?? '--'}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDeleteFile(f.id)} className="text-gray-400 hover:text-red-400 p-1" title="Delete">
                          <Trash2 size={16} />
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
    </div>
  );
}
