import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Trash2, Tag, Plus, X } from 'lucide-react';
import { chat } from '@/api';
import { useAuth } from '@/context/AuthContext';
import type { ChatMessage, ChatTag } from '@/types';

export default function ChatPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tags, setTags] = useState<ChatTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New message
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Filters
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Tag management
  const [showTagForm, setShowTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [msgs, tgs] = await Promise.all([chat.getMessages(100), chat.getTags()]);
      setMessages(msgs);
      setTags(tgs);
    } catch {
      setError('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const msg = await chat.sendMessage({ message: newMessage.trim() });
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
    } catch {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      await chat.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setError('Failed to delete message');
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const tag = await chat.createTag({ name: newTagName.trim() });
      setTags((prev) => [...prev, tag]);
      setNewTagName('');
      setShowTagForm(false);
    } catch {
      setError('Failed to create tag');
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await chat.deleteTag(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
      if (filterTag && tags.find((t) => t.id === id)?.name === filterTag) {
        setFilterTag(null);
      }
    } catch {
      setError('Failed to delete tag');
    }
  };

  const filteredMessages = filterTag
    ? messages.filter((m) => m.tags?.includes(filterTag))
    : messages;

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
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
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar: Tags */}
      <div className="w-56 flex-shrink-0">
        <div className="card h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Tag size={16} />
              Tags
            </h3>
            {isAdmin && (
              <button onClick={() => setShowTagForm(!showTagForm)} className="text-gray-500 hover:text-brand-400">
                <Plus size={16} />
              </button>
            )}
          </div>

          {showTagForm && (
            <div className="flex gap-2 mb-3">
              <input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name"
                className="input-field text-xs flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
              />
              <button onClick={handleCreateTag} className="text-brand-400 hover:text-brand-300">
                <Plus size={14} />
              </button>
            </div>
          )}

          <div className="space-y-1 flex-1 overflow-y-auto">
            <button
              onClick={() => setFilterTag(null)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterTag === null ? 'bg-brand-500/20 text-brand-400' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              All Messages
            </button>
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center group">
                <button
                  onClick={() => setFilterTag(tag.name)}
                  className={`flex-1 text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filterTag === tag.name ? 'bg-brand-500/20 text-brand-400' : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {tag.name}
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 px-1"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            <MessageSquare size={28} className="text-brand-400" />
            Chat
          </h1>
          {filterTag && (
            <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-1 rounded-full">
              #{filterTag}
            </span>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="card flex-1 overflow-y-auto p-4 space-y-4 mb-4">
          {filteredMessages.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">No messages yet</p>
          )}
          {filteredMessages.map((msg) => {
            const isOwn = msg.userId === user?.id;
            return (
              <div key={msg.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs font-medium text-gray-300">
                  {msg.userName?.[0] || '?'}
                </div>
                <div className={`max-w-[70%] ${isOwn ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-400">{msg.userName}</span>
                    <span className="text-xs text-gray-600">{formatTime(msg.createdAt)}</span>
                    {(isOwn || isAdmin) && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-gray-600 hover:text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <div
                    className={`rounded-xl px-4 py-2.5 text-sm ${
                      isOwn
                        ? 'bg-brand-600 text-white rounded-tr-sm'
                        : 'bg-gray-800 text-gray-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.message}
                  </div>
                  {msg.tags && msg.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {msg.tags.map((t) => (
                        <span key={t} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="input-field flex-1"
            disabled={sending}
          />
          <button onClick={handleSend} disabled={sending || !newMessage.trim()} className="btn-primary px-4">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
