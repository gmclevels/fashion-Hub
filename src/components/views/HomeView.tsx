import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  PlusCircle, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  ShoppingBag, 
  Scissors, 
  Shirt, 
  Footprints, 
  Briefcase, 
  Award, 
  ChevronRight,
  Truck
} from 'lucide-react';
import { Product, SellerProfile, CategoryType } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { ALL_STATE_NAMES } from '../../data/locations';
import { heroImg } from '../../data/initialData';
import { ProductCard } from '../common/ProductCard';

interface HomeViewProps {
  products: Product[];
  sellers: SellerProfile[];
  onSelectProduct: (p: Product) => void;
  onSelectSeller: (sellerId: string) => void;
  onNavigateExplore: (category?: CategoryType) => void;
  onOpenSell: () => void;
  onSearchSubmit: (query: string, state?: string, category?: string) => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  onOpenAboutFounder: () => void;
  onOpenSafetyGuide: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  sellers,
  onSelectProduct,
  onSelectSeller,
  onNavigateExplore,
  onOpenSell,
  onSearchSubmit,
  onToggleFavorite,
  isFavorite,
  onOpenAboutFounder,
  onOpenSafetyGuide
}) => {
  const [heroKeyword, setHeroKeyword] = useState('');
  const [heroCategory, setHeroCategory] = useState<string>('all');
  const [heroState, setHeroState] = useState<string>('all');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(heroKeyword, heroState, heroCategory);
  };

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const latestProducts = [...products].reverse().slice(0, 8);
  
  // Categorized showcases
  const materialProducts = products.filter(p => p.category === 'Fashion Materials').slice(0, 4);
  const clothingProducts = products.filter(p => p.category === 'Clothing').slice(0, 4);
  const childrenProducts = products.filter(p => p.ageGroup === 'Children' || p.subcategory.toLowerCase().includes('children')).slice(0, 4);
  const shoeAndBagProducts = products.filter(p => p.category === 'Shoes' || p.category === 'Bags').slice(0, 4);

  return (
    <div className="space-y-16 pb-16 text-left">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#064E3B] to-[#047857] text-white pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headlines & Search Module */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Nigeria’s Dedicated Fashion & Textile Marketplace</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-white tracking-tight leading-[1.15]">
                Find Fashion Materials, Clothes, Shoes & Bags Across Nigeria
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl font-normal leading-relaxed">
                Buy and sell fashion products and materials from trusted sellers across Nigeria.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigateExplore()}
                  className="px-6 py-3 bg-white hover:bg-emerald-50 text-[#064E3B] font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shop Now</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenSell}
                  className="px-6 py-3 bg-[#065F46] hover:bg-[#064E3B] text-white border border-emerald-400/40 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4 text-emerald-300" />
                  <span>Sell Your Product</span>
                </button>
              </div>

              {/* Nigerian Integrated Search Box */}
              <div className="pt-4">
                <form onSubmit={handleHeroSearch} className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-emerald-800/30 grid grid-cols-1 sm:grid-cols-12 gap-2 text-slate-800">
                  <div className="sm:col-span-5 relative">
                    <input
                      type="text"
                      value={heroKeyword}
                      onChange={(e) => setHeroKeyword(e.target.value)}
                      placeholder="Ankara, Senator, Lace, Loafers..."
                      className="w-full pl-8 pr-2 py-2 text-xs text-slate-900 border-0 focus:ring-0 focus:outline-none placeholder-slate-400"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  </div>

                  <div className="sm:col-span-4 border-t sm:border-t-0 sm:border-l border-slate-200 pl-0 sm:pl-2">
                    <select
                      value={heroState}
                      onChange={(e) => setHeroState(e.target.value)}
                      aria-label="Filter by Nigerian State"
                      className="w-full py-2 px-2 text-xs text-slate-700 bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer"
                    >
                      <option value="all">All 36 States + FCT</option>
                      {ALL_STATE_NAMES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full py-2 px-3 bg-[#047857] hover:bg-[#065F46] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Search className="h-3.5 w-3.5" />
                      <span>Search</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Regional trust markers */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200 pt-1">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Prices strictly in Naira (₦)</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Direct WhatsApp & Call to Vendors</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Verified Fabric Suppliers</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero High-Fashion Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-700/50 aspect-[4/3] bg-emerald-950">
                <img
                  src={heroImg}
                  alt="Contemporary Nigerian Bespoke Fashion & Ankara"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                    Founder Showcase
                  </span>
                  <h3 className="text-base font-bold font-serif leading-tight">
                    MR. GERALD UZOR
                  </h3>
                  <p className="text-xs text-slate-200 mt-0.5">
                    "Connecting Nigerian fashion creators, fabric depots, and discerning buyers nationwide."
                  </p>
                </div>
              </div>

              {/* Floating Pill Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 px-4 py-2.5 rounded-xl shadow-xl border border-slate-200 hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  ₦
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-slate-900">Per Yard & Ready-to-Wear</div>
                  <div className="text-slate-500 text-[10px]">Nationwide interstate courier delivery</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Curated Departments
            </span>
            <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              Popular Marketplace Categories
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateExplore()}
            className="text-xs font-semibold text-[#047857] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const count = products.filter(p => p.category === cat.name).length;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onNavigateExplore(cat.name)}
                className="group p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-[#047857] hover:shadow-md transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-[#047857] text-[#047857] group-hover:text-white flex items-center justify-center mb-3 transition-colors">
                    {cat.name === 'Fashion Materials' && <Scissors className="h-5 w-5" />}
                    {cat.name === 'Clothing' && <Shirt className="h-5 w-5" />}
                    {cat.name === 'Shoes' && <Footprints className="h-5 w-5" />}
                    {cat.name === 'Bags' && <Briefcase className="h-5 w-5" />}
                    {cat.name === 'Accessories' && <Sparkles className="h-5 w-5" />}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {cat.subcategories.slice(0, 3).join(', ')}...
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-700 tabular-nums">{count} items</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#047857] group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Handpicked Quality
            </span>
            <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              Featured Nigerian Products & Fabrics
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateExplore()}
            className="text-xs font-semibold text-[#047857] hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((p) => (
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
      </section>

      {/* 4. FASHION MATERIALS SPOTLIGHT (Ankara, Lace, Senator Cashmere) */}
      <section className="bg-slate-100/70 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                Textile & Fabric Supply
              </span>
              <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
                Authentic Nigerian & Imported Fabrics
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Grade-A Ankara wax, Swiss dry lace, and Senator suit fabrics priced per yard or bundle.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateExplore('Fashion Materials')}
              className="px-4 py-2 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
            >
              Browse All Materials →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {materialProducts.map((p) => (
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
        </div>
      </section>

      {/* 5. MEN'S & WOMEN'S CLOTHING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Ready-to-Wear & Bespoke
            </span>
            <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              Men's & Women's Fashion
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateExplore('Clothing')}
            className="text-xs font-semibold text-[#047857] hover:underline flex items-center gap-1"
          >
            <span>View Clothing</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {clothingProducts.map((p) => (
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
      </section>

      {/* 6. CHILDREN'S FASHION & ACCESSORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Young Stars & Kids
            </span>
            <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              Children's Fashion, Shoes & Bags
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateExplore()}
            className="text-xs font-semibold text-[#047857] hover:underline flex items-center gap-1"
          >
            <span>View Kids Catalog</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {childrenProducts.map((p) => (
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
      </section>

      {/* 7. RECOMMENDED SELLERS (Requirement 4 & 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Verified & Community Vendors
            </span>
            <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              Recommended Nigerian Sellers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sellers.slice(0, 4).map((seller) => (
            <div
              key={seller.id}
              onClick={() => onSelectSeller(seller.id)}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-[#047857] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img
                      src={seller.avatarUrl}
                      alt={seller.sellerName}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    {seller.isVerified && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 bg-white rounded-full absolute -bottom-1 -right-1" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {seller.businessName}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {seller.sellerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{seller.city}, {seller.state}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {seller.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>{seller.rating.toFixed(1)}</span>
                </div>
                <span className="text-[#047857] font-semibold flex items-center gap-0.5">
                  View Shop <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOUNDER & BRAND OWNER STORY SPOTLIGHT (Requirement 23) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#064E3B] via-[#047857] to-emerald-950 text-white rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
                <Award className="h-4 w-4 text-amber-300" />
                <span>Founder & Owner Spotlight</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                About GERALD FASHION HUB
              </h2>

              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-normal">
                "<strong>GERALD FASHION HUB</strong> is a Nigerian fashion marketplace created by <strong>Mr. Gerald Uzor</strong> to make it easier for customers, fashion designers, material suppliers, boutiques and fashion businesses to discover and trade fashion products."
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="text-xs text-emerald-200">
                  Founder: <strong className="text-white text-sm">MR. GERALD UZOR</strong>
                </div>
                <button
                  type="button"
                  onClick={onOpenAboutFounder}
                  className="px-4 py-2 bg-white text-[#064E3B] text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  Read Founder's Full Mission →
                </button>
                <button
                  type="button"
                  onClick={onOpenSafetyGuide}
                  className="px-4 py-2 bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-600/40 text-emerald-200 text-xs font-bold rounded-xl transition-colors"
                >
                  Buyer & Seller Safety Guide
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center space-y-3 max-w-xs">
                <div className="w-16 h-16 rounded-2xl bg-white text-[#064E3B] font-serif font-extrabold text-3xl flex items-center justify-center mx-auto shadow-md">
                  G
                </div>
                <h4 className="text-base font-bold text-white font-serif">
                  GERALD FASHION HUB
                </h4>
                <p className="text-xs text-emerald-200 italic">
                  "Discover Fashion. Find Materials. Buy & Sell."
                </p>
                <div className="pt-2 border-t border-white/10 text-[11px] text-emerald-300">
                  Serving all 36 Nigerian States + FCT Abuja
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
