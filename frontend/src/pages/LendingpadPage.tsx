import { useState, useEffect } from 'react';
import { Loader2, Building2, Search } from 'lucide-react';
import client from '@/api/client';

// ── Types ──

interface LendingpadLoan {
  id: number;
  externalId?: string;
  borrowerName: string;
  coBorrowerName?: string;
  loanNumber?: string;
  loanAmount?: number;
  loanType?: string;
  loanPurpose?: string;
  propertyAddress?: string;
  propertyCity?: string;
  propertyState?: string;
  propertyZip?: string;
  status?: string;
  lockStatus?: string;
  lockExpiration?: string;
  rate?: number;
  loName?: string;
  processorName?: string;
  investorName?: string;
  estimatedClosing?: string;
  actualClosing?: string;
  createdAt: string;
  updatedAt: string;
}

export default function LendingpadPage() {
  const [loans, setLoans] = useState<LendingpadLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/lendingpad');
      setLoans(data);
    } catch {
      setError('Failed to load LendingPad loans');
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount?: number | null) {
    if (amount == null) return '--';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  }

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString();
  }

  function statusBadge(status?: string | null) {
    if (!status) return <span className="text-gray-500">--</span>;
    const s = status.toLowerCase();
    const map: Record<string, string> = {
      processing: 'bg-blue-500/20 text-blue-300',
      approved: 'bg-green-500/20 text-green-300',
      funded: 'bg-emerald-500/20 text-emerald-300',
      closed: 'bg-emerald-500/20 text-emerald-300',
      denied: 'bg-red-500/20 text-red-300',
      withdrawn: 'bg-gray-500/20 text-gray-400',
      suspended: 'bg-yellow-500/20 text-yellow-300',
    };
    const cls = Object.entries(map).find(([k]) => s.includes(k))?.[1] ?? 'bg-gray-500/20 text-gray-400';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
        {status}
      </span>
    );
  }

  // Filter loans by search term
  const filtered = loans.filter((loan) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      loan.borrowerName?.toLowerCase().includes(q) ||
      loan.loanNumber?.toLowerCase().includes(q) ||
      loan.loName?.toLowerCase().includes(q) ||
      loan.status?.toLowerCase().includes(q) ||
      loan.loanType?.toLowerCase().includes(q) ||
      loan.investorName?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            <Building2 size={28} className="text-brand-400" />
            LendingPad
          </h1>
          <p className="text-gray-500 mt-1">Loan pipeline from LendingPad</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-sm text-red-400">{error}</div>
      )}

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by borrower, loan #, LO, status..."
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 w-full text-gray-100 text-sm placeholder-gray-500"
          />
        </div>
      </div>

      {/* Loans table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Borrower</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Loan #</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">LO</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Investor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Est. Closing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500 text-sm">
                      {search ? 'No loans match your search' : 'No loans found'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-3">
                        <div>
                          <span className="text-sm text-gray-200">{loan.borrowerName}</span>
                          {loan.coBorrowerName && (
                            <p className="text-xs text-gray-500">{loan.coBorrowerName}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300 font-mono">{loan.loanNumber || '--'}</td>
                      <td className="px-4 py-3 text-sm text-gray-300 text-right">{formatCurrency(loan.loanAmount)}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{loan.loanType || '--'}</td>
                      <td className="px-4 py-3">{statusBadge(loan.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{loan.loName || '--'}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{loan.investorName || '--'}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{formatDate(loan.estimatedClosing)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          {filtered.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-400">
              <span>{filtered.length} loan{filtered.length !== 1 ? 's' : ''}</span>
              <span>
                Total: {formatCurrency(filtered.reduce((sum, l) => sum + (l.loanAmount ?? 0), 0))}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
