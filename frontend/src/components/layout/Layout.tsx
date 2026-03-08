import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  GitBranch,
  Banknote,
  ClipboardCheck,
  Target,
  CheckSquare,
  Calendar,
  Pen,
  BookOpen,
  FileText,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/investors', label: 'Investors', icon: <Building2 size={20} /> },
  { to: '/chat', label: 'Chat', icon: <MessageSquare size={20} /> },
  { to: '/pipeline', label: 'Pipeline', icon: <GitBranch size={20} /> },
  { to: '/funded-loans', label: 'Funded Loans', icon: <Banknote size={20} /> },
  { to: '/pre-approvals', label: 'Pre-Approvals', icon: <ClipboardCheck size={20} /> },
  { to: '/goals', label: 'Goals', icon: <Target size={20} /> },
  { to: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
  { to: '/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
  { to: '/content', label: 'Content', icon: <Pen size={20} /> },
  { to: '/guidelines', label: 'Guidelines', icon: <BookOpen size={20} /> },
  { to: '/handbook', label: 'Handbook', icon: <FileText size={20} /> },
  { to: '/processing', label: 'Processing', icon: <Settings size={20} /> },
  { to: '/admin', label: 'Admin', icon: <Shield size={20} /> },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <>
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
        <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center font-bold text-sm">
          M
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-100">MSFG Dashboard</h1>
          <p className="text-xs text-gray-500">Mortgage Services</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-800 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800/60 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col
          transform transition-transform duration-200 lg:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>

      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-gray-900 border-r border-gray-800">
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-gray-900/80 backdrop-blur border-b border-gray-800 flex items-center px-4 lg:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-gray-200"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <p className="text-xs text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
