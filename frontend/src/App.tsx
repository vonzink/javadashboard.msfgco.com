import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AuthGuard from '@/components/ui/AuthGuard';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import InvestorsPage from '@/pages/InvestorsPage';
import ChatPage from '@/pages/ChatPage';
import PipelinePage from '@/pages/PipelinePage';
import FundedLoansPage from '@/pages/FundedLoansPage';
import PreApprovalsPage from '@/pages/PreApprovalsPage';
import GoalsPage from '@/pages/GoalsPage';
import TasksPage from '@/pages/TasksPage';
import CalendarPage from '@/pages/CalendarPage';
import ContentPage from '@/pages/ContentPage';
import GuidelinesPage from '@/pages/GuidelinesPage';
import HandbookPage from '@/pages/HandbookPage';
import ProcessingPage from '@/pages/ProcessingPage';
import AdminPage from '@/pages/AdminPage';
import MondayPage from '@/pages/MondayPage';
import LendingpadPage from '@/pages/LendingpadPage';

// Placeholder page component for routes not yet implemented
function PlaceholderPage({ name }: { name: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100 mb-2">{name}</h1>
      <p className="text-gray-500 text-sm">This page is under construction.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes with layout */}
      <Route
        element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/investors" element={<InvestorsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/funded-loans" element={<FundedLoansPage />} />
        <Route path="/pre-approvals" element={<PreApprovalsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="/handbook" element={<HandbookPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/monday" element={<MondayPage />} />
        <Route path="/lendingpad" element={<LendingpadPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* Catch-all */}
        <Route path="*" element={<PlaceholderPage name="Page Not Found" />} />
      </Route>
    </Routes>
  );
}
