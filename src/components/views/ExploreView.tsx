import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  ChevronDown, 
  PackageSearch, 
  RotateCcw,
  MapPin
} from 'lucide-react';
import { Product, FilterState, CategoryType } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { ALL_STATE_NAMES, getCitiesForState } from '../../data/locations';
import { marketplaceStore } from '../../services/marketplaceStore';
import { ProductCard } from '../common/ProductCard';

interface ExploreViewProps {
  initialCategory?: CategoryType;
  initialKeyword?: string;
  onSelectProduct: (p: Product) => void;
  onSelectSeller: (sellerId: string) => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const INITIAL_FILTERS: FilterState = {
  keyword: '',
  category: 'all',
  subcategory: 'all',
  gender: 'all',
  ageGroup: 'all',
  state: 'all',
  city: 'all',
  minPrice: '',
  maxPrice: '',
  condition: 'all',
  availability: 'all',
  deliveryOnly: false,
  sortBy: 'newest'
};

export const ExploreView: React.FC<ExploreViewProps> = ({
  initialCategory,
  initialKeyword,
  onSelectProduct,
  onSelectSeller,
  onToggleFavorite,
  isFavorite
}) => {
  const [filters, setFilters] = useState<FilterState>({
    ...INITIAL_FILTERS,
    category: initialCategory || 'all',
    keyword: initialKeyword || ''
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync if initial props change
  useEffect(() => {
    if (initialCategory) {
      setFilters(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialKeyword !== undefined) {
      setFilters(prev => ({ ...prev, keyword: initialKeyword }));
    }
  }, [initialKeyword]);

  const filteredProducts = marketplaceStore.filterProducts(filters);

  const selectedCategoryDef = CATEGORIES.find(
    c => c.name.toLowerCase() === filters.category.toLowerCase()
  );

  const availableSubcategories = selectedCategoryDef ? selectedCategoryDef.subcategories : [];
  const availableCities = filters.state !== 'all' ? getCitiesForState(filters.state) : [];

  const handleResetFilters = () => {
    setFilters({ ...INITIAL_FILTERS });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      
      {/* Header & Search Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              GERALD FASHION HUB · NIGERIA CATALOG
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
              Explore Fashion Materials & Products
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Discover authentic Nigerian textiles, bespoke garments, shoes, and bags from verified sellers.
            </p>
          </div>

          {/* Quick search input */}
          <div className="w-full md:w-96">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                placeholder="Search Ankara, senator, lace, shoes, bags..."
                className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#047857] shadow-sm"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              {filters.keyword && (
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, keyword: '' })}
                  className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Filter / Sort bar on desktop & mobile trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters ({Object.values(filters).filter(v => v !== 'all' && v !== '' && v !== false && v !== 'newest').length})</span>
            </button>

            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900 tabular-nums">{filteredProducts.length}</strong> items across Nigeria
            </span>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#047857]"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High (₦)</option>
              <option value="price-desc">Price: High to Low (₦)</option>
              <option value="popular">Most Popular / Viewed</option>
            </select>

            {(filters.category !== 'all' || filters.state !== 'all' || filters.keyword || filters.minPrice !== '' || filters.maxPrice !== '') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 ml-2"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters Left (3 Cols), Products Right (9 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6 sticky top-20 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <Filter className="h-4 w-4 text-[#047857]" />
              <span>Filters</span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-slate-500 hover:text-rose-600 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Category
            </label>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setFilters({ ...filters, category: 'all', subcategory: 'all' })}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  filters.category === 'all' 
                    ? 'bg-emerald-50 text-[#047857] font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setFilters({ ...filters, category: c.name, subcategory: 'all' })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    filters.category.toLowerCase() === c.name.toLowerCase()
                      ? 'bg-emerald-50 text-[#047857] font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Filter (Dynamic) */}
          {availableSubcategories.length > 0 && (
            <div>
              <label className="block font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
                Subcategory
              </label>
              <select
                value={filters.subcategory}
                onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })}
                className="w-full py-2 px-2.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="all">All Subcategories</option>
                {availableSubcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          {/* Nigerian Location Filter (Requirement 6) */}
          <div>
            <label className="block font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Location (State & City)
            </label>
            <div className="space-y-2">
              <select
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value, city: 'all' })}
                className="w-full py-2 px-2.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="all">All Nigeria (36 States + FCT)</option>
                {ALL_STATE_NAMES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {filters.state !== 'all' && availableCities.length > 0 && (
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full py-2 px-2.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="all">All Cities in {filters.state}</option>
                  {availableCities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Price Range Filter (in ₦) */}
          <div>
            <label className="block font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Price Range (₦)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  min={0}
                  step={500}
                  placeholder="Min ₦"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value === '' ? '' : Number(e.target.value) })}
                  className="w-full py-2 px-2 text-xs border border-slate-200 rounded-lg tabular-nums"
                />
              </div>
              <div>
                <input
                  type="number"
                  min={0}
                  step={500}
                  placeholder="Max ₦"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value === '' ? '' : Number(e.target.value) })}
                  className="w-full py-2 px-2 text-xs border border-slate-200 rounded-lg tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="w-full py-2 px-2.5 border border-slate-200 rounded-lg bg-white"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Age Group */}
          <div>
            <label className="block font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Age Group
            </label>
            <select
              value={filters.ageGroup}
              onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
              className="w-full py-2 px-2.5 border border-slate-200 rounded-lg bg-white"
            >
              <option value="all">All Age Groups</option>
              <option value="Adult">Adult</option>
              <option value="Children">Children</option>
              <option value="Teen">Teen</option>
              <option value="Baby">Baby</option>
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
              Condition
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFilters({ ...filters, condition: filters.condition === 'New' ? 'all' : 'New' })}
                className={`py-1.5 text-center rounded-lg border font-medium transition-colors ${
                  filters.condition === 'New' 
                    ? 'border-[#047857] bg-emerald-50 text-[#047857]' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                New
              </button>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, condition: filters.condition === 'Used' ? 'all' : 'Used' })}
                className={`py-1.5 text-center rounded-lg border font-medium transition-colors ${
                  filters.condition === 'Used' 
                    ? 'border-[#047857] bg-emerald-50 text-[#047857]' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Used
              </button>
            </div>
          </div>

          {/* Interstate Delivery Only */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.deliveryOnly}
                onChange={(e) => setFilters({ ...filters, deliveryOnly: e.target.checked })}
                className="rounded text-[#047857] focus:ring-[#047857] h-4 w-4"
              />
              <span className="text-slate-700 font-medium">Delivery Available Only</span>
            </label>
          </div>
        </aside>

        {/* Mobile Filters Drawer Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm lg:hidden">
            <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto p-6 space-y-5 text-left text-xs">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="font-bold text-base text-slate-900">Filter Marketplace</span>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value, subcategory: 'all' })}
                  className="w-full py-2 px-3 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">State (Nigeria)</label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value, city: 'all' })}
                  className="w-full py-2 px-3 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="all">All 36 States + FCT Abuja</option>
                  {ALL_STATE_NAMES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">Price Range (₦)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min ₦"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full py-2 px-3 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max ₦"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full py-2 px-3 border rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 py-2.5 bg-[#047857] text-white font-semibold rounded-lg"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Results (9 Cols) */}
        <main className="lg:col-span-9 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <PackageSearch className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 font-serif">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We couldn't find items matching your current filters. Try changing your search keywords or resetting price and location parameters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 bg-[#047857] text-white rounded-lg text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={onSelectProduct}
                  isFavorite={isFavorite(p.id)}
                  onToggleFavorite={(_, e) => {
                    e.stopPropagation();
                    onToggleFavorite(p.id);
                  }}
                  onSelectSeller={(_, e) => {
                    e.stopPropagation();
                    onSelectSeller(p.sellerId);
                  }}
                />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
};
