import React from 'react';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';

interface SavedItemsViewProps {
  favoriteProducts: Product[];
  onBack: () => void;
  onSelectProduct: (p: Product) => void;
  onToggleFavorite: (productId: string) => void;
  onSelectSeller: (sellerId: string) => void;
  onExplore: () => void;
}

export const SavedItemsView: React.FC<SavedItemsViewProps> = ({
  favoriteProducts,
  onBack,
  onSelectProduct,
  onToggleFavorite,
  onSelectSeller,
  onExplore
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          {favoriteProducts.length} items saved
        </span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif text-slate-900">
          Saved Products & Fabrics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Keep track of materials, shoes, bags, and fashion products you want to buy.
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Heart className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 font-serif">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any fabric, shoes, or clothing card to save it here for later.
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="mt-3 px-5 py-2.5 bg-[#047857] hover:bg-[#065F46] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Explore Marketplace Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {favoriteProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
              isFavorite={true}
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
    </div>
  );
};
