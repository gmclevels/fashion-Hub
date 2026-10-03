import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  Heart, 
  User as UserIcon, 
  Menu, 
  X, 
  ShieldCheck, 
  Store, 
  LogOut, 
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { User, CategoryType } from '../../types';
import { CATEGORIES } from '../../data/categories';

interface HeaderProps {
  currentUser: User | null;
  favoritesCount: number;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateExplore: (category?: CategoryType) => void;
  onNavigateSellerDashboard: () => void;
  onNavigateAdminDashboard: () => void;
  onNavigateFavorites: () => void;
  onNavigateAboutFounder: () => void;
  onOpenSell: () => void;
  onSearchSubmit: (query: string) => void;
  onSwitchDemoAccount: (role: 'Customer' | 'Seller' | 'Admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  favoritesCount,
  onOpenAuth,
  onLogout,
  onNavigateHome,
  onNavigateExplore,
  onNavigateSellerDashboard,
  onNavigateAdminDashboard,
  onNavigateFavorites,
  onNavigateAboutFounder,
  onOpenSell,
  onSearchSubmit,
  onSwitchDemoAccount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner: Founder & Market Trust Notice */}
      <div className="bg-[#064E3B] text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">GERALD FASHION HUB</span>
            <span className="hidden sm:inline text-emerald-300">·</span>
            <span className="hidden sm:inline text-emerald-200">
              Nigeria’s Premier Fashion & Material Exchange · Founder: Mr. Gerald Uzor
            </span>
          </div>

          {/* Quick Demo Role Switcher for instant testing */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="hidden md:inline text-emerald-300">Demo Role:</span>
            <div className="flex items-center gap-1 bg-emerald-950/60 rounded px-1.5 py-0.5 border border-emerald-800">
              <button
                type="button"
                onClick={() => onSwitchDemoAccount('Customer')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  currentUser?.accountType === 'Customer' ? 'bg-emerald-600 text-white font-semibold' : 'text-emerald-300 hover:text-white'
                }`}
              >
                Customer
              </button>
              <span className="text-emerald-600">/</span>
              <button
                type="button"
                onClick={() => onSwitchDemoAccount('Seller')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  currentUser?.accountType === 'Seller' ? 'bg-emerald-600 text-white font-semibold' : 'text-emerald-300 hover:text-white'
                }`}
              >
                Seller
              </button>
              <span className="text-emerald-600">/</span>
              <button
                type="button"
                onClick={() => onSwitchDemoAccount('Admin')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  currentUser?.accountType === 'Admin' ? 'bg-emerald-600 text-white font-semibold' : 'text-emerald-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-left focus:outline-none group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-[#047857] flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm group-hover:bg-[#065F46] transition-colors">
              G
            </div>
            <div>
              <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#047857] transition-colors">
                GERALD FASHION HUB
              </span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Nigeria Fashion Marketplace
              </span>
            </div>
          </button>

          {/* Search bar (Desktop & Tablet) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Ankara, Senator suits, lace, shoes, bags..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-900 rounded-lg border border-transparent focus:border-[#047857] focus:outline-none focus:ring-1 focus:ring-[#047857] transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </form>
          </div>

          {/* Zone 2: Clean 4–6 text navigation links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => onNavigateExplore()}
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              All Marketplace
            </button>
            <button
              type="button"
              onClick={() => onNavigateExplore('Fashion Materials')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap text-emerald-800 font-semibold"
            >
              Materials
            </button>
            <button
              type="button"
              onClick={() => onNavigateExplore('Clothing')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Clothing
            </button>
            <button
              type="button"
              onClick={() => onNavigateExplore('Shoes')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Shoes
            </button>
            <button
              type="button"
              onClick={() => onNavigateExplore('Bags')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Bags
            </button>
            <button
              type="button"
              onClick={onNavigateAboutFounder}
              className="hover:text-slate-900 transition-colors whitespace-nowrap text-amber-900"
            >
              Founder's Story
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Sell Button, Saved, User Profile) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Wishlist button */}
            <button
              type="button"
              onClick={onNavigateFavorites}
              className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Saved items"
            >
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* SELL BUTTON: Highly visible per requirement 19 */}
            <button
              type="button"
              onClick={onOpenSell}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#047857] hover:bg-[#065F46] rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              <PlusCircle className="h-4 w-4" />
              <span>SELL PRODUCT</span>
            </button>

            {/* User Account / Auth Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                >
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px]">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {currentUser.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-left"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {currentUser.accountType} Account
                      </span>
                    </div>

                    {currentUser.accountType === 'Seller' && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigateSellerDashboard();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left"
                      >
                        <Store className="h-4 w-4 text-emerald-700" />
                        <span>Seller Dashboard</span>
                      </button>
                    )}

                    {currentUser.accountType === 'Admin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigateAdminDashboard();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left font-semibold text-emerald-900"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-700" />
                        <span>Admin Control Center</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigateFavorites();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left"
                    >
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span>Saved Products ({favoritesCount})</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              >
                <UserIcon className="h-4 w-4 text-slate-500" />
                <span>Log In / Sign Up</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ankara, senator, lace, shoes, bags in Nigeria..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 text-xs text-slate-900 rounded-lg border border-transparent focus:bg-white focus:border-[#047857] focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateExplore();
              }}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 text-slate-800"
            >
              All Marketplace Items
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateExplore('Fashion Materials');
              }}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 text-emerald-800 font-semibold"
            >
              Fashion Materials (Ankara, Lace, Senator)
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateExplore('Clothing');
              }}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 text-slate-800"
            >
              Clothing (Men, Women, Kids)
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateExplore('Shoes');
              }}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 text-slate-800"
            >
              Shoes & Footwear
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateExplore('Bags');
              }}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 text-slate-800"
            >
              Bags & Backpacks
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateAboutFounder();
              }}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 text-amber-900"
            >
              Founder's Story (Mr. Gerald Uzor)
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSell();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#047857] text-white rounded-lg font-semibold text-xs"
            >
              <PlusCircle className="h-4 w-4" />
              <span>SELL YOUR PRODUCT</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
