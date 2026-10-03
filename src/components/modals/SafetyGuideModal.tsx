import React from 'react';
import { X, ShieldCheck, AlertTriangle, MapPin, Eye, CheckCircle2 } from 'lucide-react';

interface SafetyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyGuideModal: React.FC<SafetyGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-emerald-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold font-serif text-white">
                Buyer & Seller Safety Guide
              </h3>
              <p className="text-xs text-emerald-200">
                Safe Trading Guidelines for Gerald Fashion Hub
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <strong className="block font-semibold">Important Notice:</strong>
              Do not send advance payment to unknown or unverified vendors until you have confirmed physical receipt or used an agreed verification inspection.
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Inspect Materials Upon Delivery</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  When buying fabrics (Ankara, Lace, Senator cashmere), inspect the yardage count, texture, and edge stamps before final handover.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Meet in Public, Well-Trafficked Locations</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  If arranging local pickup in cities like Lagos, Abuja, Onitsha, or Kano, prefer recognized commercial markets, shopping complexes, or courier hubs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Check Seller Badges Honestly</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Gerald Fashion Hub only awards the Verified Seller badge to businesses whose credentials and business registry or physical stores have been confirmed by platform administrators.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Report Inappropriate or Suspicious Listings</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Use the "Report Product" button on any listing that appears fraudulent or counterfeit. Reports are swiftly reviewed by our moderation desk.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
