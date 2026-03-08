import api from './client';
import type {
  User,
  Investor,
  ChatMessage,
  ChatTag,
  Announcement,
  Notification,
  Goal,
  PipelineItem,
  FundedLoan,
  PreApproval,
  Task,
  CalendarEvent,
} from '@/types';

// ── Investors ───────────────────────────────────────────────

export const investors = {
  getAll: () =>
    api.get<Investor[]>('/investors').then((r) => r.data),

  getByKey: (key: string) =>
    api.get<Investor>(`/investors/${key}`).then((r) => r.data),

  create: (data: Partial<Investor>) =>
    api.post<Investor>('/investors', data).then((r) => r.data),

  update: (idOrKey: string | number, data: Record<string, unknown>) =>
    api.put<Investor>(`/investors/${idOrKey}`, data).then((r) => r.data),

  delete: (idOrKey: string | number) =>
    api.delete(`/investors/${idOrKey}`).then(() => undefined),

  updateTeam: (id: number, team: unknown[]) =>
    api.put(`/investors/${id}/team`, team).then((r) => r.data),

  updateLenderIds: (id: number, data: unknown[]) =>
    api.put(`/investors/${id}/lender-ids`, data).then((r) => r.data),

  updateClauses: (id: number, clauses: unknown[]) =>
    api.put(`/investors/${id}/mortgagee-clauses`, clauses).then((r) => r.data),

  updateLinks: (id: number, links: unknown[]) =>
    api.put(`/investors/${id}/links`, links).then((r) => r.data),
};

// ── Chat ────────────────────────────────────────────────────

export const chat = {
  getMessages: (limit = 50) =>
    api.get<ChatMessage[]>('/chat/messages', { params: { limit } }).then((r) => r.data),

  sendMessage: (data: Partial<ChatMessage>) =>
    api.post<ChatMessage>('/chat/messages', data).then((r) => r.data),

  deleteMessage: (id: number) =>
    api.delete(`/chat/messages/${id}`).then(() => undefined),

  getTags: () =>
    api.get<ChatTag[]>('/chat/tags').then((r) => r.data),

  createTag: (data: Partial<ChatTag>) =>
    api.post<ChatTag>('/chat/tags', data).then((r) => r.data),

  deleteTag: (id: number) =>
    api.delete(`/chat/tags/${id}`).then(() => undefined),
};

// ── Announcements ───────────────────────────────────────────

export const announcements = {
  getAll: () =>
    api.get<Announcement[]>('/announcements').then((r) => r.data),

  create: (data: Partial<Announcement>) =>
    api.post<Announcement>('/announcements', data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/announcements/${id}`).then(() => undefined),
};

// ── Notifications ───────────────────────────────────────────

export const notifications = {
  getAll: () =>
    api.get<Notification[]>('/notifications').then((r) => r.data),

  create: (data: Partial<Notification>) =>
    api.post<Notification>('/notifications', data).then((r) => r.data),

  update: (id: number, data: Partial<Notification>) =>
    api.put<Notification>(`/notifications/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/notifications/${id}`).then(() => undefined),
};

// ── Goals ───────────────────────────────────────────────────

export const goals = {
  getAll: (params?: { period_type?: string; period_value?: string; user_id?: number }) =>
    api.get<Goal[]>('/goals', { params }).then((r) => r.data),

  upsert: (data: Partial<Goal>[]) =>
    api.put<Goal[]>('/goals', data).then((r) => r.data),

  getSummary: () =>
    api.get<Record<string, unknown>[]>('/goals/by-lo/summary').then((r) => r.data),
};

// ── Pipeline ────────────────────────────────────────────────

export const pipeline = {
  getAll: (params?: { status?: string; loanOfficerId?: number }) =>
    api.get<PipelineItem[]>('/pipeline', { params }).then((r) => r.data),

  getSummary: () =>
    api.get<Record<string, unknown>>('/pipeline/summary').then((r) => r.data),

  getById: (id: number) =>
    api.get<PipelineItem>(`/pipeline/${id}`).then((r) => r.data),

  create: (data: Partial<PipelineItem>) =>
    api.post<PipelineItem>('/pipeline', data).then((r) => r.data),

  update: (id: number, data: Partial<PipelineItem>) =>
    api.put<PipelineItem>(`/pipeline/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/pipeline/${id}`).then(() => undefined),
};

// ── Funded Loans ────────────────────────────────────────────

export const fundedLoans = {
  getAll: () =>
    api.get<FundedLoan[]>('/funded-loans').then((r) => r.data),

  getSummary: () =>
    api.get<Record<string, unknown>>('/funded-loans/summary').then((r) => r.data),

  getById: (id: number) =>
    api.get<FundedLoan>(`/funded-loans/${id}`).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/funded-loans/${id}`).then(() => undefined),
};

// ── Pre-Approvals ───────────────────────────────────────────

export const preApprovals = {
  getAll: () =>
    api.get<PreApproval[]>('/pre-approvals').then((r) => r.data),

  getSummary: () =>
    api.get<Record<string, unknown>>('/pre-approvals/summary').then((r) => r.data),

  create: (data: Partial<PreApproval>) =>
    api.post<PreApproval>('/pre-approvals', data).then((r) => r.data),

  update: (id: number, data: Partial<PreApproval>) =>
    api.put<PreApproval>(`/pre-approvals/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/pre-approvals/${id}`).then(() => undefined),
};

// ── Tasks ───────────────────────────────────────────────────

export const tasks = {
  getAll: (params?: { status?: string; assigned_to?: number }) =>
    api.get<Task[]>('/tasks', { params }).then((r) => r.data),

  create: (data: Partial<Task>) =>
    api.post<Task>('/tasks', data).then((r) => r.data),

  update: (id: number, data: Partial<Task>) =>
    api.put<Task>(`/tasks/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/tasks/${id}`).then(() => undefined),
};

// ── Calendar ────────────────────────────────────────────────

export const calendar = {
  getAll: (params?: { start?: string; end?: string }) =>
    api.get<CalendarEvent[]>('/calendar-events', { params }).then((r) => r.data),

  create: (data: Partial<CalendarEvent>) =>
    api.post<CalendarEvent>('/calendar-events', data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/calendar-events/${id}`).then(() => undefined),
};

// ── Users ───────────────────────────────────────────────────

export const users = {
  getDirectory: () =>
    api.get<User[]>('/users/directory').then((r) => r.data),

  getContactCard: (id: number) =>
    api.get(`/users/${id}/contact-card`).then((r) => r.data),
};

// ── Files ───────────────────────────────────────────────────

export const files = {
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/files/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },

  browse: () =>
    api.get<Record<string, unknown>[]>('/files/browse').then((r) => r.data),

  getDownloadUrl: (filename: string) =>
    `${api.defaults.baseURL}/files/download/${encodeURIComponent(filename)}`,
};

// ── Content ─────────────────────────────────────────────────

export const content = {
  getTemplates: () =>
    api.get('/content/templates').then((r) => r.data),

  createTemplate: (data: Record<string, unknown>) =>
    api.post('/content/templates', data).then((r) => r.data),

  updateTemplate: (id: number, data: Record<string, unknown>) =>
    api.put(`/content/templates/${id}`, data).then((r) => r.data),

  search: (query: string) =>
    api.get('/content/search', { params: { query } }).then((r) => r.data),

  generate: (data: Record<string, unknown>) =>
    api.post('/content/generate', data).then((r) => r.data),

  getItems: () =>
    api.get('/content/items').then((r) => r.data),

  updateItem: (id: number, data: Record<string, unknown>) =>
    api.put(`/content/items/${id}`, data).then((r) => r.data),

  approveItem: (id: number) =>
    api.post(`/content/items/${id}/approve`).then((r) => r.data),

  deleteItem: (id: number) =>
    api.delete(`/content/items/${id}`).then(() => undefined),

  publish: (id: number) =>
    api.post(`/content/publish/${id}`).then((r) => r.data),
};

// ── Integrations ────────────────────────────────────────────

export const integrations = {
  getAll: () =>
    api.get('/integrations').then((r) => r.data),

  upsert: (service: string, data: Record<string, unknown>) =>
    api.post(`/integrations/${service}`, data).then((r) => r.data),

  test: (service: string) =>
    api.post(`/integrations/${service}/test`).then((r) => r.data),

  delete: (service: string) =>
    api.delete(`/integrations/${service}`).then(() => undefined),
};

// ── Monday.com ──────────────────────────────────────────────

export const monday = {
  getEvents: () =>
    api.get('/monday').then((r) => r.data),

  getBoards: () =>
    api.get('/monday/boards').then((r) => r.data),

  createBoard: (data: Record<string, unknown>) =>
    api.post('/monday/boards', data).then((r) => r.data),

  updateBoard: (boardId: string, data: Record<string, unknown>) =>
    api.put(`/monday/boards/${boardId}`, data).then((r) => r.data),

  deleteBoard: (boardId: string) =>
    api.delete(`/monday/boards/${boardId}`).then(() => undefined),
};

// ── Guidelines ──────────────────────────────────────────────

export const guidelines = {
  search: (params: { query: string }) =>
    api.get('/guidelines/search', { params }).then((r) => r.data),

  getFiles: () =>
    api.get('/guidelines/files').then((r) => r.data),

  getChunks: (id: number) =>
    api.get(`/guidelines/chunks/${id}`).then((r) => r.data),

  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/guidelines/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },

  deleteFile: (id: number) =>
    api.delete(`/guidelines/files/${id}`).then(() => undefined),
};

// ── Handbook ────────────────────────────────────────────────

export const handbook = {
  getDocuments: () =>
    api.get('/handbook/documents').then((r) => r.data),

  getSection: (docSlug: string, sectionSlug: string) =>
    api.get(`/handbook/sections/by-slug/${docSlug}/${sectionSlug}`).then((r) => r.data),

  search: (query: string) =>
    api.get('/handbook/search', { params: { query } }).then((r) => r.data),

  updateSection: (id: number, data: Record<string, unknown>) =>
    api.put(`/handbook/sections/${id}`, data).then((r) => r.data),

  createSection: (docId: number, data: Record<string, unknown>) =>
    api.post(`/handbook/documents/${docId}/sections`, data).then((r) => r.data),

  deleteSection: (id: number) =>
    api.delete(`/handbook/sections/${id}`).then(() => undefined),
};

// ── Lendingpad ──────────────────────────────────────────────

export const lendingpad = {
  getLoans: () =>
    api.get('/lendingpad').then((r) => r.data),
};

// ── Processing ──────────────────────────────────────────────

export const processing = {
  getRecords: () =>
    api.get('/processing').then((r) => r.data),

  createRecord: (data: Record<string, unknown>) =>
    api.post('/processing', data).then((r) => r.data),

  updateRecord: (id: number, data: Record<string, unknown>) =>
    api.put(`/processing/${id}`, data).then((r) => r.data),

  deleteRecord: (id: number) =>
    api.delete(`/processing/${id}`).then(() => undefined),

  getLinks: () =>
    api.get('/processing/links').then((r) => r.data),

  createLink: (data: Record<string, unknown>) =>
    api.post('/processing/links', data).then((r) => r.data),

  updateLink: (id: number, data: Record<string, unknown>) =>
    api.put(`/processing/links/${id}`, data).then((r) => r.data),

  deleteLink: (id: number) =>
    api.delete(`/processing/links/${id}`).then(() => undefined),
};

// ── Admin ───────────────────────────────────────────────────

export const admin = {
  getUsers: () =>
    api.get<User[]>('/admin/users').then((r) => r.data),

  createUser: (data: Record<string, unknown>) =>
    api.post<User>('/admin/users', data).then((r) => r.data),

  updateUser: (id: number, data: Record<string, unknown>) =>
    api.put<User>(`/admin/users/${id}`, data).then((r) => r.data),

  deleteUser: (id: number) =>
    api.delete(`/admin/users/${id}`).then(() => undefined),
};
