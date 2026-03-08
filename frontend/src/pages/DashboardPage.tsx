import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
          <LayoutDashboard size={28} className="text-brand-400" />
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {user?.firstName || 'User'}
        </p>
      </div>

      {/* Placeholder cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Pipeline', value: '--', color: 'text-blue-400' },
          { label: 'Funded This Month', value: '--', color: 'text-green-400' },
          { label: 'Pre-Approvals', value: '--', color: 'text-yellow-400' },
          { label: 'Tasks Due', value: '--', color: 'text-red-400' },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="text-gray-400 text-sm">
          Dashboard widgets will be implemented here. This includes announcements,
          recent activity, pipeline summary, and goal progress.
        </p>
      </div>
    </div>
  );
}
