import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Product, User } from '../../types';
import { formatNaira, generateWhatsAppLink } from '../../utils/formatters';
import { marketplaceStore } from '../../services/marketplaceStore';

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  currentUser: User | null;
  onRequireAuth: () => void;
}

export const ContactSellerModal: React.FC<ContactSellerModalProps> = ({
  isOpen,
  onClose,
  product,
  currentUser,
  onRequireAuth
}) => {
  const [buyerName, setBuyerName] = useState(currentUser?.fullName || '');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phoneNumber || '');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || '');
  const [message, setMessage] = useState(
    `Hello ${product.sellerName}, I am interested in purchasing your "${product.name}" listed at ${formatNaira(product.price, product.priceType)}. Please let me know your delivery terms and availability.`
  );
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (!buyerName.trim() || !buyerPhone.trim() || !message.trim()) {
      setError('Please provide your name, phone number, and enquiry message.');
      return;
    }

    try {
      marketplaceStore.sendEnquiry({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        sellerId: product.sellerId,
        buyerId: currentUser.id,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim() || currentUser.email,
        buyerPhone: buyerPhone.trim(),
        message: message.trim()
      });
      setSentSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry.');
    }
  };

  const whatsappUrl = generateWhatsAppLink(
    product.sellerWhatsApp || product.sellerPhone,
    product.name,
    product.price,
    `${product.city}, ${product.state}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#047857] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-serif text-white">
              Contact Seller
            </h3>
            <p className="text-xs text-emerald-100">
              {product.sellerBusinessName || product.sellerName} · {product.city}, {product.state}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Snapshot */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="h-14 w-14 rounded-lg object-cover border border-slate-200 shrink-0" 
            />
          ) : (
            <div className="h-14 w-14 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              GFH
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-slate-900 truncate">
              {product.name}
            </h4>
            <div className="text-sm font-bold text-[#047857] tabular-nums mt-0.5">
              {formatNaira(product.price, product.priceType)}
            </div>
            <p className="text-[11px] text-slate-500">
              Location: {product.city}, {product.state}
            </p>
          </div>
        </div>

        {/* Action Content */}
        <div className="p-6 space-y-5">
          {/* Quick Direct Actions */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-semibold shadow-sm transition-all text-center"
            >
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp Seller</span>
            </a>

            <a
              href={`tel:${product.sellerPhone}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all text-center"
            >
              <Phone className="h-4 w-4" />
              <span>Call ({product.sellerPhone})</span>
            </a>
          </div>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              Or Send Marketplace Enquiry
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Enquiry Form */}
          {sentSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">Enquiry Sent Successfully!</h4>
              <p className="text-xs text-emerald-700">
                The seller has received your message and contact details. They will contact you shortly via phone or WhatsApp.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-4 py-1.5 bg-[#047857] text-white rounded-lg text-xs font-semibold"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendEnquiry} className="space-y-3">
              {error && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Chioma Adebayo"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Your Nigerian Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="e.g. 0802 111 2233"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Enquiry Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#047857]"
                />
              </div>

              {/* Safety notice per requirement 16 */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[11px] text-amber-800">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  <strong>Safety Notice:</strong> Inspect fashion products or fabric materials before making final payment. Never wire funds to unverified couriers in advance.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#047857] hover:bg-[#065F46] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Direct Enquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
