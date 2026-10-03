import React from 'react';
import { Home, Grid, Search, PlusCircle, User as UserIcon, Heart } from 'lucide-react';
import { User } from '../../types';

interface MobileNavProps {
  currentTab: string;
  currentUser: User | null;
  favoritesCount: number;
  onNavigateHome: () => void;
  onNavigateCategories: () => void;
  onNavigateSearch: () => void;
  onOpenSell: () => void;
  onNavigateProfile: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  currentUser,
  favoritesCount,
  onNavigateHome,
  onNavigateCategories,
  onNavigateSearch,
  onOpenSell,
  onNavigateProfile
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          type="button"
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-[11px] font-medium transition-colors ${
            currentTab === 'home' ? 'text-[#047857]' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span>Home</span>
        </button>

        {/* Categories */}
        <button
          type="button"
          onClick={onNavigateCategories}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-[11px] font-medium transition-colors ${
            currentTab === 'categories' ? 'text-[#047857]' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Grid className="h-5 w-5 mb-0.5" />
          <span>Categories</span>
        </button>

        {/* Sell Button - Elevated & Prominent */}
        <button
          type="button"
          onClick={onOpenSell}
          className="flex flex-col items-center justify-center -mt-4 bg-[#047857] text-white rounded-full h-12 w-12 shadow-lg shadow-emerald-900/30 hover:bg-[#065F46] active:scale-95 transition-all"
          aria-label="Sell your product"
        >
          <PlusCircle className="h-6 w-6" />
          <span className="sr-only">Sell</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={onNavigateSearch}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-[11px] font-medium transition-colors ${
            currentTab === 'search' ? 'text-[#047857]' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search className="h-5 w-5 mb-0.5" />
          <span>Search</span>
        </button>

        {/* Profile / Account */}
        <button
          type="button"
          onClick={onNavigateProfile}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-[11px] font-medium transition-colors relative ${
            currentTab === 'profile' || currentTab === 'dashboard' ? 'text-[#047857]' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserIcon className="h-5 w-5 mb-0.5" />
          <span>{currentUser ? 'Account' : 'Login'}</span>
        </button>
      </div>
    </nav>
  );
};
