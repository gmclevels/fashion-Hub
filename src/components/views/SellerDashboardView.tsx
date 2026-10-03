import React, { useState } from 'react';
import { 
  PlusCircle, 
  Package, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  TrendingUp, 
  DollarSign, 
  Store, 
  User as UserIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import { Product, User, SellerProfile, EnquiryMessage } from '../../types';
import { formatNaira, formatRelativeDate } from '../../utils/formatters';
import { marketplaceStore } from '../../services/marketplaceStore';

interface SellerDashboardViewProps {
  currentUser: User;
  onOpenAddProduct: () => void;
  onEditProduct: (p: Product) => void;
  onViewProduct: (p: Product) => void;
  onRefreshData: () => void;
}

export const SellerDashboardView: React.FC<SellerDashboardViewProps> = ({
  currentUser,
  onOpenAddProduct,
  onEditProduct,
  onViewProduct,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'enquiries' | 'profile'>('overview');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPriceVal, setNewPriceVal] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const allProducts = marketplaceStore.getProducts();
  const myProducts = allProducts.filter(p => p.sellerId === currentUser.id);
  const myEnquiries = marketplaceStore.getSellerEnquiries(currentUser.id);
  const sellerProfile = marketplaceStore.getSellerById(currentUser.id);

  // Statistics
  const totalListings = myProducts.length;
  const activeListings = myProducts.filter(p => p.availability !== 'Sold Out').length;
  const soldProducts = myProducts.filter(p => p.availability === 'Sold Out').length;
  const totalViews = myProducts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalEnquiries = myEnquiries.length;

  const handleToggleSold = (productId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Sold Out' ? 'In Stock' : 'Sold Out';
    marketplaceStore.updateProduct(productId, { availability: nextStatus as any });
    setStatusMessage(`Listing marked as ${nextStatus}!`);
    setTimeout(() => setStatusMessage(null), 3000);
    onRefreshData();
  };

  const handleDelete = (productId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from your listings?`)) {
      marketplaceStore.deleteProduct(productId);
      setStatusMessage('Listing successfully removed.');
      setTimeout(() => setStatusMessage(null), 3000);
      onRefreshData();
    }
  };

  const handleSavePrice = (productId: string) => {
    if (newPriceVal > 0) {
      marketplaceStore.updateProduct(productId, { price: newPriceVal });
      setEditingPriceId(null);
      setStatusMessage('Price updated successfully.');
      setTimeout(() => setStatusMessage(null), 3000);
      onRefreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      
      {/* Dashboard Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <Store className="h-4 w-4" />
            <span>Merchant Control Hub</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 mt-1">
            {currentUser.businessName || `${currentUser.fullName}'s Shop`}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Seller Account: {currentUser.fullName} · {currentUser.city}, {currentUser.state}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="px-4 py-2.5 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Post New Listing</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 p-3 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-6 space-x-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'border-[#047857] text-[#047857]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Overview & Stats
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'products'
              ? 'border-[#047857] text-[#047857]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          My Listings ({totalListings})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'enquiries'
              ? 'border-[#047857] text-[#047857]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Buyer Enquiries ({totalEnquiries})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-medium text-slate-500 block">Total Listings</span>
              <span className="text-2xl font-bold text-slate-900 tabular-nums">{totalListings}</span>
              <span className="text-[10px] text-emerald-700 block mt-1">Catalog items</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-medium text-slate-500 block">Active Listings</span>
              <span className="text-2xl font-bold text-emerald-700 tabular-nums">{activeListings}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Ready to purchase</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-medium text-slate-500 block">Sold Items</span>
              <span className="text-2xl font-bold text-slate-700 tabular-nums">{soldProducts}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Fulfilled orders</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-medium text-slate-500 block">Product Views</span>
              <span className="text-2xl font-bold text-slate-900 tabular-nums">{totalViews}</span>
              <span className="text-[10px] text-emerald-700 block mt-1">Market exposure</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-medium text-slate-500 block">Customer Inquiries</span>
              <span className="text-2xl font-bold text-amber-700 tabular-nums">{totalEnquiries}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Direct buyer contacts</span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-emerald-900 text-white rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-white">
                Expand Your Nigerian Customer Reach
              </h3>
              <p className="text-xs text-emerald-200 max-w-xl">
                Buyers across Lagos, Abuja, Kano, Port Harcourt, and Aba are actively searching for Ankara wax prints, Senator fabrics, shoes, and bespoke native wear.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAddProduct}
              className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-[#064E3B] text-xs font-bold rounded-xl shrink-0 transition-colors"
            >
              + Add Product Now
            </button>
          </div>

          {/* Recent Products Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                Recent Product Inventory
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                View all ({totalListings})
              </button>
            </div>

            {myProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">You have not posted any products yet.</p>
                <button
                  type="button"
                  onClick={onOpenAddProduct}
                  className="mt-3 px-3.5 py-1.5 bg-[#047857] text-white text-xs font-semibold rounded-lg"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {myProducts.slice(0, 3).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded object-cover" />
                      <div>
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-500">{p.category} · {formatNaira(p.price, p.priceType)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.availability === 'In Stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {p.availability}
                      </span>
                      <button
                        type="button"
                        onClick={() => onViewProduct(p)}
                        className="p-1 hover:text-emerald-800 text-slate-500"
                        title="View listing"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: My Products Management */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                Manage Product Listings
              </h2>
              <p className="text-xs text-slate-500">
                Update prices, stock, availability, or edit specifications.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAddProduct}
              className="px-3.5 py-2 bg-[#047857] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {myProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No Listings Yet</h3>
              <p className="text-xs text-slate-500 mt-1">Start selling your fabrics, apparel, or accessories today.</p>
              <button
                type="button"
                onClick={onOpenAddProduct}
                className="mt-4 px-4 py-2 bg-[#047857] text-white text-xs font-bold rounded-lg"
              >
                Post Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Product</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Price (₦)</th>
                    <th className="py-3 px-4 font-semibold">Stock</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Views</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-semibold text-slate-900 truncate block">{p.name}</span>
                            <span className="text-[10px] text-slate-500">{p.city}, {p.state}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {p.category}
                        <span className="block text-[10px] text-slate-400">{p.subcategory}</span>
                      </td>

                      <td className="py-3 px-4">
                        {editingPriceId === p.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              defaultValue={p.price}
                              onChange={(e) => setNewPriceVal(Number(e.target.value))}
                              className="w-20 px-1.5 py-1 text-xs border rounded"
                            />
                            <button
                              type="button"
                              onClick={() => handleSavePrice(p.id)}
                              className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="font-bold text-slate-900 tabular-nums flex items-center gap-1 cursor-pointer hover:text-emerald-800"
                            onClick={() => {
                              setEditingPriceId(p.id);
                              setNewPriceVal(p.price);
                            }}
                            title="Click to edit price"
                          >
                            <span>{formatNaira(p.price, p.priceType)}</span>
                            <Edit3 className="h-3 w-3 text-slate-400" />
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 tabular-nums text-slate-700">
                        {p.quantity}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleSold(p.id, p.availability)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                            p.availability === 'Sold Out'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          title="Click to toggle Sold / In Stock"
                        >
                          {p.availability}
                        </button>
                      </td>

                      <td className="py-3 px-4 tabular-nums text-slate-500">
                        {p.viewsCount || 0}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onViewProduct(p)}
                            className="p-1.5 text-slate-500 hover:text-emerald-800 rounded hover:bg-slate-100"
                            title="View on site"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditProduct(p)}
                            className="p-1.5 text-slate-500 hover:text-emerald-800 rounded hover:bg-slate-100"
                            title="Edit full listing"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                            title="Delete listing"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Buyer Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Buyer Enquiries & Message Requests
            </h2>
            <p className="text-xs text-slate-500">
              Customers inquiring about your fabrics and fashion items.
            </p>
          </div>

          {myEnquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs">No customer enquiries received yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myEnquiries.map(enq => (
                <div key={enq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{enq.buyerName}</span>
                    <span className="text-[11px] text-slate-400">{formatRelativeDate(enq.createdAt)}</span>
                  </div>

                  <p className="text-slate-700 italic bg-white p-2.5 rounded border border-slate-200">
                    "{enq.message}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                    <div>
                      Product: <strong className="text-slate-800">{enq.productName}</strong>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={`tel:${enq.buyerPhone}`} className="text-emerald-700 font-semibold hover:underline">
                        Call {enq.buyerPhone}
                      </a>
                      <a 
                        href={`https://wa.me/${enq.buyerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.buyerName)},%20regarding%20your%20enquiry%20for%20${encodeURIComponent(enq.productName)}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[#25D366] font-semibold hover:underline"
                      >
                        Reply on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
