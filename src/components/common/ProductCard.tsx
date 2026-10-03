import React, { useState } from 'react';
import { Product } from '../../types';
import { formatNaira } from '../../utils/formatters';
import { MapPin, CheckCircle2, Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string, e: React.MouseEvent) => void;
  onSelectSeller?: (sellerId: string, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  onSelectSeller
}) => {
  const [imgError, setImgError] = useState(false);
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : '';

  return (
    <article 
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
    >
      {/* Image Container with 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {!imgError && primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-950/10 via-slate-100 to-amber-950/10 p-4 text-center">
            <span className="text-2xl font-serif text-emerald-900 font-bold mb-1">GFH</span>
            <span className="text-xs font-medium text-slate-500 line-clamp-1">{product.category}</span>
          </div>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            type="button"
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => onToggleFavorite(product.id, e)}
            className={`absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
              isFavorite 
                ? 'bg-rose-50 text-rose-600 shadow-sm' 
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-600'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        )}

        {/* Subtle sample listing indicator per requirement 22 */}
        {product.isSampleListing && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-slate-900/75 text-white backdrop-blur-sm text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded">
              Demo
            </span>
          </div>
        )}

        {/* Availability status badge */}
        {product.availability === 'Sold Out' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-wider bg-red-600 px-3 py-1 rounded">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Condition text metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium text-emerald-800">{product.category}</span>
          <div className="flex items-center gap-1.5">
            <span>{product.condition}</span>
            {product.deliveryAvailable && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600">Delivery</span>
              </>
            )}
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors mb-2">
          {product.name}
        </h3>

        {/* Price in Naira */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <div className="text-base font-bold text-slate-900 tabular-nums">
              {formatNaira(product.price, product.priceType)}
            </div>
            {product.priceType && product.priceType !== 'Fixed price' && (
              <span className="text-[11px] text-slate-500 block">
                {product.priceType}
              </span>
            )}
          </div>
        </div>

        {/* Location & Seller Footer */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 truncate max-w-[55%]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{product.city}, {product.state}</span>
          </div>

          <div 
            onClick={(e) => {
              if (onSelectSeller) {
                onSelectSeller(product.sellerId, e);
              }
            }}
            className="flex items-center gap-1 text-slate-700 hover:text-emerald-800 transition-colors font-medium truncate max-w-[45%]"
          >
            <span className="truncate">{product.sellerName}</span>
            {product.isSellerVerified && (
              <span title="Verified Seller" className="inline-flex">
                <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
