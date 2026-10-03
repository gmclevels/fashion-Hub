import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle2, 
  Heart, 
  Share2, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Truck, 
  Calendar, 
  Layers, 
  Eye, 
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Product, SellerProfile, User } from '../../types';
import { formatNaira, formatRelativeDate, generateWhatsAppLink } from '../../utils/formatters';
import { ProductCard } from '../common/ProductCard';

interface ProductDetailViewProps {
  product: Product;
  seller?: SellerProfile;
  similarProducts: Product[];
  currentUser: User | null;
  isFavorite: boolean;
  onBack: () => void;
  onSelectProduct: (p: Product) => void;
  onSelectSeller: (sellerId: string) => void;
  onToggleFavorite: (productId: string) => void;
  onOpenContactModal: () => void;
  onOpenReportModal: () => void;
  onOpenSafetyGuide: () => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  seller,
  similarProducts,
  currentUser,
  isFavorite,
  onBack,
  onSelectProduct,
  onSelectSeller,
  onToggleFavorite,
  onOpenContactModal,
  onOpenReportModal,
  onOpenSafetyGuide,
  onEditProduct
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[selectedImageIndex] || '';

  const whatsappUrl = generateWhatsAppLink(
    product.sellerWhatsApp || product.sellerPhone,
    product.name,
    product.price,
    `${product.city}, ${product.state}`
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} (${formatNaira(product.price, product.priceType)}) on Gerald Fashion Hub!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const isOwner = currentUser && currentUser.id === product.sellerId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          {isOwner && onEditProduct && (
            <button
              type="button"
              onClick={() => onEditProduct(product)}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Edit My Listing
            </button>
          )}

          <button
            type="button"
            onClick={() => onToggleFavorite(product.id)}
            className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium ${
              isFavorite 
                ? 'border-rose-200 bg-rose-50 text-rose-600' 
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Save product"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Share listing"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">{copySuccess ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery Left, Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Image Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image Container */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                <span className="text-3xl font-serif font-bold text-emerald-900">GFH</span>
                <span className="text-xs">No image provided</span>
              </div>
            )}

            {/* Sample Notice Badge */}
            {product.isSampleListing && (
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                Verified Sample Listing
              </div>
            )}

            {/* Availability Pill */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-slate-200">
              {product.availability}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx 
                      ? 'border-[#047857] ring-2 ring-[#047857]/20 shadow-sm' 
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Product Specifications & Full Description */}
          <div className="pt-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif mb-2">
                Detailed Product Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200">
                {product.description}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Garment & Material Specifications
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Category</span>
                  <span className="font-semibold text-slate-800">{product.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Subcategory</span>
                  <span className="font-semibold text-slate-800">{product.subcategory}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Material Composition</span>
                  <span className="font-semibold text-slate-800">{product.material || 'Standard Fabric'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Size / Yardage</span>
                  <span className="font-semibold text-slate-800">{product.size || 'Standard Size'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Color Scheme</span>
                  <span className="font-semibold text-slate-800">{product.color || 'As Photographed'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Condition</span>
                  <span className="font-semibold text-slate-800">{product.condition}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Gender Target</span>
                  <span className="font-semibold text-slate-800">{product.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Age Group</span>
                  <span className="font-semibold text-slate-800">{product.ageGroup}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Stock Available</span>
                  <span className="font-semibold text-slate-800">{product.quantity} units</span>
                </div>
              </div>
            </div>

            {/* Delivery Terms */}
            <div className="flex items-start gap-3 p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-950">
              <Truck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Interstate Delivery & Logistics</strong>
                <span>
                  {product.deliveryAvailable 
                    ? `Delivery is available from ${product.city}, ${product.state} to all 36 Nigerian states via trusted park couriers, dispatch riders, or waybill services.` 
                    : `Direct in-person pickup available in ${product.city}, ${product.state}. Contact seller to discuss delivery arrangements.`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase & Seller Module (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Price & Title Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            
            {/* Category and Location Breadcrumb */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-emerald-800">{product.category} · {product.subcategory}</span>
              <div className="flex items-center gap-1 text-slate-600">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{product.city}, {product.state}</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug font-serif">
              {product.name}
            </h1>

            {/* Price block */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-500 font-medium">Marketplace Price</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#047857] tabular-nums mt-0.5">
                {formatNaira(product.price, product.priceType)}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-xs text-slate-500">
                <span>Terms: <strong className="text-slate-800">{product.priceType}</strong></span>
                <span>Last updated: {formatRelativeDate(product.updatedAt)}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={onOpenContactModal}
                className="w-full py-3 bg-[#047857] hover:bg-[#065F46] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/10 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Contact Seller / Send Enquiry</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp Seller</span>
                </a>

                <a
                  href={`tel:${product.sellerPhone}`}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Seller</span>
                </a>
              </div>
            </div>

            {/* Safety Guidance Note */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenSafetyGuide}
                className="w-full flex items-center justify-between p-3 bg-amber-50/70 hover:bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>Always inspect fabrics & products before payment</span>
                </div>
                <ChevronRight className="h-4 w-4 text-amber-600" />
              </button>
            </div>
          </div>

          {/* Seller Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Seller Information
              </span>
              <button
                type="button"
                onClick={() => onSelectSeller(product.sellerId)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
              >
                <span>View Full Profile</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="relative">
                {seller?.avatarUrl ? (
                  <img
                    src={seller.avatarUrl}
                    alt={seller.sellerName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 font-bold font-serif text-lg flex items-center justify-center">
                    {product.sellerName.charAt(0)}
                  </div>
                )}
                {product.isSellerVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 border-2 border-white shadow-sm" title="Verified Nigerian Seller">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {product.sellerBusinessName || product.sellerName}
                  </h4>
                </div>

                <p className="text-xs text-slate-500 mt-0.5">
                  Operated by {product.sellerName}
                </p>

                <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>{product.city}, {product.state}</span>
                </div>
              </div>
            </div>

            {seller && (
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {seller.description}
              </p>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
              <button
                type="button"
                onClick={onOpenReportModal}
                className="text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Report this listing</span>
              </button>

              <span className="text-[11px] text-slate-400">
                Product ID: {product.id}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Similar / Related Products Section */}
      {similarProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                Related Marketplace Discoveries
              </span>
              <h3 className="text-xl font-bold font-serif text-slate-900 mt-0.5">
                Similar Products in {product.category}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.slice(0, 4).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
                isFavorite={false}
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
      )}

    </div>
  );
};
