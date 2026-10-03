import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Star, 
  Check, 
  Layers, 
  MapPin, 
  Eye, 
  Store 
} from 'lucide-react';
import { Product, SellerProfile, User, ReportItem } from '../../types';
import { formatNaira, formatRelativeDate } from '../../utils/formatters';
import { marketplaceStore } from '../../services/marketplaceStore';
import { CATEGORIES } from '../../data/categories';
import { ALL_STATE_NAMES } from '../../data/locations';

interface AdminDashboardViewProps {
  currentUser: User;
  onRefreshData: () => void;
  onViewProduct: (p: Product) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  onRefreshData,
  onViewProduct
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'reports' | 'sellers' | 'locations'>('products');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const products = marketplaceStore.getProducts();
  const sellers = marketplaceStore.getSellers();
  const users = marketplaceStore.getUsers();
  const reports = marketplaceStore.getReports();

  // Statistics
  const totalUsers = users.length;
  const totalSellers = sellers.length;
  const totalProducts = products.length;
  const activeListings = products.filter(p => p.availability !== 'Sold Out').length;
  const soldListings = products.filter(p => p.availability === 'Sold Out').length;
  const reportedListings = reports.filter(r => r.status === 'pending').length;

  const handleToggleFeatured = (productId: string, currentFeatured?: boolean) => {
    marketplaceStore.updateProduct(productId, { isFeatured: !currentFeatured });
    setStatusMessage(`Listing ${!currentFeatured ? 'added to' : 'removed from'} Featured showcase.`);
    setTimeout(() => setStatusMessage(null), 3000);
    onRefreshData();
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this listing permanently?')) {
      marketplaceStore.deleteProduct(productId);
      setStatusMessage('Listing removed by Administrator.');
      setTimeout(() => setStatusMessage(null), 3000);
      onRefreshData();
    }
  };

  const handleToggleSellerVerification = (sellerId: string, currentStatus: boolean) => {
    marketplaceStore.updateSellerProfile(sellerId, { isVerified: !currentStatus });
    setStatusMessage(`Seller verification status updated to: ${!currentStatus ? 'VERIFIED' : 'UNVERIFIED'}.`);
    setTimeout(() => setStatusMessage(null), 3000);
    onRefreshData();
  };

  const handleResolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    marketplaceStore.updateReportStatus(reportId, status);
    setStatusMessage(`Report marked as ${status}.`);
    setTimeout(() => setStatusMessage(null), 3000);
    onRefreshData();
  };

  const handleResetData = () => {
    if (window.confirm('Reset all marketplace data back to default sample state? This will restore original Nigerian products and demo accounts.')) {
      marketplaceStore.resetToSampleData();
      setStatusMessage('Marketplace restored to default factory state.');
      setTimeout(() => setStatusMessage(null), 3000);
      onRefreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      
      {/* Admin Top Banner */}
      <div className="bg-[#064E3B] text-white rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-white mt-1">
            GERALD FASHION HUB · Management Desk
          </h1>
          <p className="text-xs text-emerald-200 mt-0.5">
            Founder: Mr. Gerald Uzor · Platform Governance, Approvals, & Trust Oversight
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetData}
          className="px-3.5 py-2 bg-emerald-900/80 hover:bg-emerald-950 text-emerald-200 border border-emerald-700 rounded-xl text-xs font-semibold transition-colors self-start md:self-auto"
        >
          Reset Sample Demo Data
        </button>
      </div>

      {statusMessage && (
        <div className="mb-6 p-3 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Metrics Row (Section 12 requirement) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Total Users</span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{totalUsers}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Total Sellers</span>
          <span className="text-xl font-bold text-emerald-700 tabular-nums">{totalSellers}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Total Products</span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{totalProducts}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Active Listings</span>
          <span className="text-xl font-bold text-emerald-700 tabular-nums">{activeListings}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Sold Listings</span>
          <span className="text-xl font-bold text-slate-600 tabular-nums">{soldListings}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Pending Reports</span>
          <span className={`text-xl font-bold tabular-nums ${reportedListings > 0 ? 'text-red-600' : 'text-slate-400'}`}>
            {reportedListings}
          </span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 mb-6 space-x-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'products'
              ? 'border-[#047857] text-[#047857]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Listings ({totalProducts})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'border-[#047857] text-[#047857]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Reported Items</span>
          {reportedListings > 0 && (
            <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px]">
              {reportedListings}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sellers')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'sellers'
              ? 'border-[#047857] text-[#047857]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Sellers & Verification ({totalSellers})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('locations')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'locations'
              ? 'border-[#047857] text-[#047857]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Nigerian Coverage (36 States + FCT)
        </button>
      </div>

      {/* Tab: Products Management */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              All Platform Product Listings
            </h3>
            <span className="text-xs text-slate-500">
              Feature on homepage or moderate inappropriate items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product Name</th>
                  <th className="py-3 px-4 font-semibold">Seller</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Featured</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={p.images[0]} alt={p.name} className="h-9 w-9 rounded object-cover border" />
                        <span className="font-semibold text-slate-900 line-clamp-1 max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{p.sellerName}</td>
                    <td className="py-3 px-4 text-slate-500">{p.city}, {p.state}</td>
                    <td className="py-3 px-4 font-semibold tabular-nums text-slate-900">{formatNaira(p.price, p.priceType)}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p.id, p.isFeatured)}
                        className={`p-1.5 rounded transition-colors ${
                          p.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`h-4 w-4 ${p.isFeatured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.availability === 'In Stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.availability}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewProduct(p)}
                          className="p-1 text-slate-500 hover:text-emerald-800"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Reports & Trust Safety */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Compliance & Reported Items Desk
            </h3>
            <p className="text-xs text-slate-500">
              Review flags regarding counterfeit fabrics, inactive vendors, or deceptive pricing.
            </p>
          </div>

          {reports.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-medium">No pending user reports. All listings comply with marketplace guidelines.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map(rep => (
                <div key={rep.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded text-[10px] uppercase">
                        {rep.type}
                      </span>
                      <strong className="text-slate-900">{rep.targetName}</strong>
                    </div>
                    <span className="text-[11px] text-slate-400">{formatRelativeDate(rep.createdAt)}</span>
                  </div>

                  <div className="text-slate-700 bg-white p-3 rounded border border-slate-200 space-y-1">
                    <p><strong>Reason:</strong> {rep.reason}</p>
                    <p><strong>Details:</strong> {rep.details}</p>
                    <p className="text-[11px] text-slate-400">Reported by: {rep.reporterName}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      rep.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      Status: {rep.status}
                    </span>

                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleResolveReport(rep.id, 'dismissed')}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold"
                        >
                          Dismiss
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolveReport(rep.id, 'resolved')}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold"
                        >
                          Resolve & Warn
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Manage Sellers */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Registered Nigerian Sellers & Boutiques
            </h3>
            <p className="text-xs text-slate-500">
              Ensure accurate badge verification: do not falsely claim verification unless physical or business credentials have been audited.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Business Name</th>
                  <th className="py-3 px-4 font-semibold">Contact Person</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Phone / WhatsApp</th>
                  <th className="py-3 px-4 font-semibold">Verified Badge</th>
                  <th className="py-3 px-4 font-semibold text-right">Verification Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sellers.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">{s.businessName}</td>
                    <td className="py-3 px-4 text-slate-700">{s.sellerName}</td>
                    <td className="py-3 px-4 text-slate-500">{s.city}, {s.state}</td>
                    <td className="py-3 px-4 text-slate-600">{s.phone}</td>
                    <td className="py-3 px-4">
                      {s.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle className="h-3 w-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Unverified</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleSellerVerification(s.id, s.isVerified)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          s.isVerified
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-emerald-700 text-white hover:bg-emerald-800'
                        }`}
                      >
                        {s.isVerified ? 'Revoke Badge' : 'Grant Verified Badge'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Locations Reference */}
      {activeTab === 'locations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Nigerian Geographic Coverage & Commercial Hubs
            </h3>
            <p className="text-xs text-slate-500">
              Gerald Fashion Hub operates across all 36 Nigerian states and the Federal Capital Territory (Abuja).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
            {ALL_STATE_NAMES.map(st => {
              const stateProductCount = products.filter(p => p.state.toLowerCase() === st.toLowerCase()).length;
              return (
                <div key={st} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 truncate">{st}</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border text-slate-500 font-bold">
                    {stateProductCount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
