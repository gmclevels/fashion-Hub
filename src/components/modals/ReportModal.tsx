import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { User } from '../../types';
import { marketplaceStore } from '../../services/marketplaceStore';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'product' | 'seller';
  targetId: string;
  targetName: string;
  currentUser: User | null;
}

const REPORT_REASONS = [
  'Suspected fraud or advance payment scam',
  'Counterfeit fabric / mislabeled material',
  'Inaccurate or deceptive price listed',
  'Seller is unresponsive or unreachable',
  'Copyright infringement or stolen images',
  'Defective or damaged product on arrival',
  'Other violation'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  type,
  targetId,
  targetName,
  currentUser
}) => {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState(currentUser?.fullName || '');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!details.trim()) {
      setError('Please provide a brief explanation of the issue.');
      return;
    }

    try {
      marketplaceStore.submitReport({
        type,
        targetId,
        targetName,
        reporterName: reporterName.trim() || 'Anonymous Marketplace User',
        reason,
        details: details.trim()
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-200" />
            <h3 className="text-base font-bold text-white">
              Report {type === 'product' ? 'Product Listing' : 'Seller Profile'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-red-200 hover:text-white hover:bg-red-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Report Received</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thank you for helping keep Gerald Fashion Hub safe and trustworthy. Our compliance team will review <strong>{targetName}</strong> and take appropriate disciplinary action.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600">
                You are reporting: <strong className="text-slate-900">{targetName}</strong>
              </p>

              {error && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Report *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-red-600"
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Obinna"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Details / Evidence *
                </label>
                <textarea
                  rows={3}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe what occurred (e.g. incorrect yard measurement, seller insisted on off-platform unsecured payment)..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Submit Official Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
