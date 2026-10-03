import React from 'react';
import { CategoryType } from '../../types';
import { ShieldCheck, MapPin, Phone, Mail, Award, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: CategoryType) => void;
  onOpenSafetyGuide: () => void;
  onOpenFounderStory: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSafetyGuide,
  onOpenFounderStory
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-20 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand & Founder Column (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-emerald-600 text-white font-serif font-bold text-lg flex items-center justify-center">
                G
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                GERALD FASHION HUB
              </span>
            </div>

            <p className="text-sm text-slate-300 italic font-serif">
              "Discover Fashion. Find Materials. Buy & Sell."
            </p>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                <Award className="h-4 w-4" />
                <span>Platform Founder & Leadership</span>
              </div>
              <p className="leading-relaxed">
                <strong className="text-white">GERALD FASHION HUB</strong> is a Nigerian fashion marketplace created by <span className="text-emerald-300 font-medium">Mr. Gerald Uzor</span> to make it easier for customers, fashion designers, material suppliers, boutiques and fashion businesses across Nigeria to discover and trade fashion products and authentic textiles.
              </p>
              <button
                type="button"
                onClick={onOpenFounderStory}
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold text-xs pt-1 transition-colors"
              >
                Read Mr. Gerald Uzor's Founder Message <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Lagos · Abuja · Across all 36 Nigerian States</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Explore Marketplace
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Fashion Materials')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Fashion Materials & Fabrics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Clothing')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Men's & Women's Clothing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Shoes')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Handmade Shoes & Footwear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Bags')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Leather Bags & School Bags
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('Accessories')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Coral Beads, Watches & Belts
                </button>
              </li>
            </ul>
          </div>

          {/* Top Textiles & Niches */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Popular Materials
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Ankara Wax Prints (Dutch & Nigerian)</li>
              <li>Swiss Dry Lace & French Net</li>
              <li>Super 140s Senator Cashmere</li>
              <li>Italian Wool Suitings</li>
              <li>Pure Guinea Brocade</li>
              <li>Children's Soft Cotton Prints</li>
            </ul>
          </div>

          {/* Trust, Safety & Currency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Trust & Safety
            </h4>
            <div className="space-y-3 text-xs">
              <p className="text-slate-400 leading-relaxed">
                All prices are displayed in Nigerian Naira (₦). Always inspect fabrics and goods before completing payments.
              </p>
              <button
                type="button"
                onClick={onOpenSafetyGuide}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg font-medium transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Buyer Safety Rules</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} GERALD FASHION HUB. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Founder & Owner: <strong className="text-slate-200">MR. GERALD UZOR</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>Currency: Nigerian Naira (₦)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
