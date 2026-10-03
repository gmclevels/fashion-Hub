import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Star, 
  UserPlus, 
  UserCheck, 
  ShieldAlert, 
  Calendar, 
  Sparkles,
  Package
} from 'lucide-react';
import { SellerProfile, Product, User } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { generateWhatsAppLink } from '../../utils/formatters';

interface SellerProfileViewProps {
  seller: SellerProfile;
  products: Product[];
  currentUser: User | null;
  isFollowing: boolean;
  onBack: () => void;
  onSelectProduct: (p: Product) => void;
  onToggleFollow: () => void;
  onOpenReportSeller: () => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const SellerProfileView: React.FC<SellerProfileViewProps> = ({
  seller,
  products,
  currentUser,
  isFollowing,
  onBack,
  onSelectProduct,
  onToggleFollow,
  onOpenReportSeller,
  onToggleFavorite,
  isFavorite
}) => {
  const whatsappUrl = generateWhatsAppLink(
    seller.whatsApp || seller.phone,
    'Marketplace Collection Inquiry',
    0,
    `${seller.city}, ${seller.state}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left">
      
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Seller Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        {/* Cover strip */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-[#064E3B] via-[#047857] to-emerald-800 relative p-6">
          <div className="absolute top-4 right-4">
            <button
              type="button"
              onClick={onOpenReportSeller}
              className="px-2.5 py-1 text-[11px] bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-sm transition-colors flex items-center gap-1"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-300" />
              <span>Report Vendor</span>
            </button>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            {/* Avatar & Names */}
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={seller.avatarUrl}
                  alt={seller.sellerName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                />
                {seller.isVerified && (
                  <div className="absolute bottom-1 right-1 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Nigerian Merchant">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                    {seller.businessName}
                  </h1>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {seller.sellerName}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span>{seller.city}, {seller.state}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">Joined {seller.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={onToggleFollow}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isFollowing
                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    : 'bg-[#047857] text-white hover:bg-[#065F46] shadow-sm'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4 text-emerald-700" />
                    <span>Following ({seller.followerCount})</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Follow Merchant ({seller.followerCount})</span>
                  </>
                )}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${seller.phone}`}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Call ({seller.phone})</span>
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Total Listings</span>
              <span className="font-bold text-slate-900 text-base tabular-nums">
                {products.length} Items
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Merchant Rating</span>
              <div className="flex items-center gap-1 font-bold text-slate-900 text-base">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>{seller.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-normal">({seller.reviewCount} reviews)</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Platform Verification</span>
              <span className="font-semibold text-emerald-800 text-xs">
                {seller.isVerified ? 'Verified Nigerian Merchant' : 'Community Seller'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Followers</span>
              <span className="font-bold text-slate-900 text-base tabular-nums">
                {seller.followerCount}
              </span>
            </div>
          </div>

          {/* About Bio */}
          <div className="pt-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
              About This Business
            </h4>
            <p>{seller.description}</p>
          </div>

          {/* Specialties / Tags */}
          {seller.specialties && seller.specialties.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Specialties:</span>
              <span>{seller.specialties.join(' · ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Seller's Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-800" />
            <h3 className="text-lg font-bold font-serif text-slate-900">
              Listings by {seller.businessName}
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {products.length}
            </span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-8">
            <Package className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-medium">This seller currently has no active products listed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
                isFavorite={isFavorite(p.id)}
                onToggleFavorite={(_, e) => {
                  e.stopPropagation();
                  onToggleFavorite(p.id);
                }}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
