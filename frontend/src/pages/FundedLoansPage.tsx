import { useState, useEffect } from 'react';
import { Banknote, Trash2 } from 'lucide-react';
import { fundedLoans } from '@/api';
import { useAuth } from '@/context/AuthContext';
import type { FundedLoan } from '@/types';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

export default function FundedLoansPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const [data, setData] = useState<FundedLoan[]>([]);
  const [, setSummary] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [loans, sum] = await Promise.all([fundedLoans.getAll(), fundedLoans.getSummary()]);
      setData(loans);
      setSummary(sum);
    } catch {
      setError('Failed to load funded loans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this funded loan record?')) return;
    try {
      await fundedLoans.delete(id);
      fetchData();
    } catch {
      setError('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalCount = data.length;
  const totalVolume = data.reduce((sum, loan) => sum + loan.loanAmount, 0);
  const avgLoan = totalCount > 0 ? totalVolume / totalCount : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
          <Banknote size={28} className="text-brand-400" />
          Funded Loans
        </h1>
        <p className="text-gray-500 mt-1">{totalCount} funded loans on record</p>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Funded</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{totalCount}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Volume</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(totalVolume)}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Average Loan</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">{formatCurrency(avgLoan)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Borrower</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Investor</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Funded Date</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">LO</th>
              {isAdmin && (
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((loan) => (
              <tr key={loan.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-200">{loan.borrowerName}</td>
                <td className="px-4 py-3 text-gray-300">{formatCurrency(loan.loanAmount)}</td>
                <td className="px-4 py-3 text-gray-400">{loan.loanType}</td>
                <td className="px-4 py-3 text-gray-400">{loan.investorName || '--'}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(loan.fundedDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-400">{loan.loanOfficerName}</td>
                {isAdmin && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(loan.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="px-4 py-8 text-center text-gray-500">
                  No funded loans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
