import React from 'react';
import { X, Award, CheckCircle2, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';

interface AboutFounderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExplore: () => void;
}

export const AboutFounderModal: React.FC<AboutFounderModalProps> = ({
  isOpen,
  onClose,
  onOpenExplore
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with emerald aesthetic */}
        <div className="bg-[#064E3B] text-white p-6 sm:p-8 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">
            <Award className="h-4 w-4" />
            <span>Platform Vision & Leadership</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            GERALD FASHION HUB
          </h2>
          <p className="text-sm font-serif italic text-emerald-200 mt-1">
            "Discover Fashion. Find Materials. Buy & Sell."
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-700/80 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-100">
            <span>Founder & Owner:</span>
            <strong className="text-white font-bold">MR. GERALD UZOR</strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 bg-emerald-50/80 border border-emerald-100 rounded-xl text-emerald-950 text-xs sm:text-sm font-medium">
            "GERALD FASHION HUB is a Nigerian fashion marketplace created by <strong>Mr. Gerald Uzor</strong> to make it easier for customers, fashion designers, material suppliers, boutiques and fashion businesses to discover and trade fashion products."
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Empowering the Nigerian Fashion Ecosystem
            </h3>
            <p>
              From the vibrant textile corridors of Balogun Market in Lagos and Kwari in Kano, to Ariaria in Aba and Wuse in Abuja, Nigeria boasts one of the world's most dynamic and culturally rich fashion markets. 
            </p>
            <p>
              However, connecting textile buyers with authentic fabric importers, and matching discerning clients with skilled bespoke tailors, has often been hindered by geographic barriers, unverified intermediaries, and fragmented advertising.
            </p>
            <p>
              <strong>GERALD FASHION HUB</strong> bridges this gap. Led by <strong>Mr. Gerald Uzor</strong>, the platform delivers a centralized, transparent digital marketplace engineered specifically for the Nigerian commercial reality:
            </p>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Compass className="h-4 w-4 text-[#047857]" />
                <span>All 36 States + FCT</span>
              </div>
              <p className="text-slate-600">
                Discover sellers from your exact state and local commercial center for easy pickup or expedited delivery.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <ShieldCheck className="h-4 w-4 text-[#047857]" />
                <span>Nigerian Naira (₦) Focus</span>
              </div>
              <p className="text-slate-600">
                Transparent pricing with per-yard, per-bundle, and negotiable terms directly with Nigerian artisans.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <HeartHandshake className="h-4 w-4 text-[#047857]" />
                <span>Textiles to Ready-to-Wear</span>
              </div>
              <p className="text-slate-600">
                Connecting fabric suppliers, shoe artisans, leather bag producers, and couture designers in one hub.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <CheckCircle2 className="h-4 w-4 text-[#047857]" />
                <span>Direct WhatsApp & Call</span>
              </div>
              <p className="text-slate-600">
                Streamlined communication with verified and peer-reviewed Nigerian vendors.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenExplore();
              }}
              className="px-4 py-2 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Explore Marketplace Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
