// ── User & Auth ──────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'user';
  avatarUrl?: string;
  phone?: string;
  title?: string;
  nmlsId?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ── Investor ─────────────────────────────────────────────────

export interface Investor {
  id: number;
  name: string;
  code?: string;
  logoUrl?: string;
  website?: string;
  phone?: string;
  email?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorContact {
  id: number;
  investorId: number;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
}

// ── Chat ─────────────────────────────────────────────────────

export interface ChatMessage {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  message: string;
  tags: string[];
  parentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatTag {
  id: number;
  name: string;
  color?: string;
  createdAt: string;
}

// ── Notifications ───────────────────────────────────────────

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent' | 'success';
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Pre-Approvals ───────────────────────────────────────────

export interface PreApproval {
  id: number;
  clientName: string;
  loanAmount: number;
  loanType?: string;
  status: 'active' | 'expired' | 'converted' | 'cancelled';
  issuedDate: string;
  expirationDate?: string;
  loanOfficerId: number;
  loanOfficerName: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Announcements ────────────────────────────────────────────

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'urgent' | 'success';
  authorId: number;
  authorName: string;
  expiresAt?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Goals ────────────────────────────────────────────────────

export interface Goal {
  id: number;
  userId: number;
  userName: string;
  type: 'units' | 'volume';
  target: number;
  current: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  year: number;
  month?: number;
  quarter?: number;
  createdAt: string;
  updatedAt: string;
}

// ── Pipeline ─────────────────────────────────────────────────

export interface PipelineItem {
  id: number;
  borrowerName: string;
  loanAmount: number;
  loanType: string;
  propertyAddress?: string;
  status: PipelineStatus;
  investorId?: number;
  investorName?: string;
  lockDate?: string;
  lockExpiration?: string;
  estimatedCloseDate?: string;
  loanOfficerId: number;
  loanOfficerName: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PipelineStatus =
  | 'prospect'
  | 'pre_approved'
  | 'processing'
  | 'underwriting'
  | 'conditional_approval'
  | 'clear_to_close'
  | 'closed'
  | 'denied'
  | 'withdrawn';

// ── Funded Loans ─────────────────────────────────────────────

export interface FundedLoan {
  id: number;
  borrowerName: string;
  loanAmount: number;
  loanType: string;
  propertyAddress: string;
  investorId?: number;
  investorName?: string;
  fundedDate: string;
  loanOfficerId: number;
  loanOfficerName: string;
  createdAt: string;
}

// ── Calendar ─────────────────────────────────────────────────

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  color?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// ── Tasks ────────────────────────────────────────────────────

export interface Task {
  id: number;
  title: string;
  description?: string;
  assignedTo: number;
  assignedToName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Content ──────────────────────────────────────────────────

export interface ContentItem {
  id: number;
  title: string;
  body: string;
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  status: 'draft' | 'scheduled' | 'published';
  scheduledFor?: string;
  publishedAt?: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

// ── API ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
