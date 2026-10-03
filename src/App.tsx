/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Product, SellerProfile, CategoryType } from './types';
import { marketplaceStore } from './services/marketplaceStore';

// Common components
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';

// Views
import { HomeView } from './components/views/HomeView';
import { ExploreView } from './components/views/ExploreView';
import { ProductDetailView } from './components/views/ProductDetailView';
import { SellerProfileView } from './components/views/SellerProfileView';
import { SellerDashboardView } from './components/views/SellerDashboardView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { SavedItemsView } from './components/views/SavedItemsView';

// Modals
import { AuthModal } from './components/modals/AuthModal';
import { ContactSellerModal } from './components/modals/ContactSellerModal';
import { ReportModal } from './components/modals/ReportModal';
import { AddEditProductModal } from './components/views/AddEditProductModal';
import { AboutFounderModal } from './components/modals/AboutFounderModal';
import { SafetyGuideModal } from './components/modals/SafetyGuideModal';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<
    'home' | 'explore' | 'product-detail' | 'seller-profile' | 'seller-dashboard' | 'admin-dashboard' | 'saved-items'
  >('home');

  // Selected Entities
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  
  // Search & Filter parameters for Explore View
  const [exploreCategory, setExploreCategory] = useState<CategoryType | undefined>(undefined);
  const [exploreKeyword, setExploreKeyword] = useState<string | undefined>(undefined);

  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<User | null>(marketplaceStore.getCurrentUser());

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(marketplaceStore.getFavorites());

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'product' | 'seller'; id: string; name: string } | null>(null);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [aboutFounderModalOpen, setAboutFounderModalOpen] = useState(false);
  const [safetyGuideModalOpen, setSafetyGuideModalOpen] = useState(false);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Re-fetch products & sellers whenever data changes
  const [products, setProducts] = useState<Product[]>(marketplaceStore.getProducts());
  const [sellers, setSellers] = useState<SellerProfile[]>(marketplaceStore.getSellers());

  const handleRefreshData = () => {
    setProducts(marketplaceStore.getProducts());
    setSellers(marketplaceStore.getSellers());
    setFavorites(marketplaceStore.getFavorites());
    setCurrentUser(marketplaceStore.getCurrentUser());
  };

  // Scroll to top on navigation
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SELL BUTTON WORKFLOW (Requirement 19)
  // "When clicked: If user is not logged in: Show Login/Register. If logged in: Open Add Product page."
  const handleOpenSell = () => {
    if (!currentUser) {
      setAuthMode('register');
      setAuthModalOpen(true);
      showToast('Please create an account or sign in to sell your products.');
    } else {
      setProductToEdit(null);
      setAddEditModalOpen(true);
    }
  };

  // Navigation Handlers
  const handleNavigateHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
    scrollToTop();
  };

  const handleNavigateExplore = (category?: CategoryType) => {
    setExploreCategory(category);
    setExploreKeyword(undefined);
    setCurrentView('explore');
    scrollToTop();
  };

  const handleSearchSubmit = (query: string, state?: string, category?: string) => {
    setExploreKeyword(query);
    if (category && category !== 'all') {
      setExploreCategory(category as CategoryType);
    } else {
      setExploreCategory(undefined);
    }
    setCurrentView('explore');
    scrollToTop();
  };

  const handleSelectProduct = (product: Product) => {
    marketplaceStore.incrementProductViews(product.id);
    setSelectedProduct(product);
    setCurrentView('product-detail');
    scrollToTop();
  };

  const handleSelectSeller = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    setCurrentView('seller-profile');
    scrollToTop();
  };

  const handleToggleFavorite = (productId: string) => {
    const isNowFav = marketplaceStore.toggleFavorite(productId);
    setFavorites(marketplaceStore.getFavorites());
    showToast(isNowFav ? 'Product added to your wishlist!' : 'Product removed from wishlist.');
  };

  const handleQuickSwitchDemoRole = (role: 'Customer' | 'Seller' | 'Admin') => {
    const users = marketplaceStore.getUsers();
    let target = users.find(u => u.accountType === role);
    if (target) {
      marketplaceStore.setCurrentUser(target);
      setCurrentUser(target);
      showToast(`Switched to ${role} demo account: ${target.fullName}`);
    }
  };

  const handleLogout = () => {
    marketplaceStore.logoutUser();
    setCurrentUser(null);
    showToast('You have been logged out.');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.fullName}!`);
  };

  // Active Seller Profile
  const activeSellerProfile = selectedSellerId 
    ? sellers.find(s => s.id === selectedSellerId || s.userId === selectedSellerId) 
    : undefined;

  const sellerProducts = selectedSellerId
    ? products.filter(p => p.sellerId === selectedSellerId)
    : [];

  const similarProducts = selectedProduct
    ? products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    : [];

  const favoriteProductsList = products.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1E293B]">
      
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <Header
        currentUser={currentUser}
        favoritesCount={favorites.length}
        onOpenAuth={() => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onNavigateHome={handleNavigateHome}
        onNavigateExplore={handleNavigateExplore}
        onNavigateSellerDashboard={() => {
          setCurrentView('seller-dashboard');
          scrollToTop();
        }}
        onNavigateAdminDashboard={() => {
          setCurrentView('admin-dashboard');
          scrollToTop();
        }}
        onNavigateFavorites={() => {
          setCurrentView('saved-items');
          scrollToTop();
        }}
        onNavigateAboutFounder={() => setAboutFounderModalOpen(true)}
        onOpenSell={handleOpenSell}
        onSearchSubmit={(q) => handleSearchSubmit(q)}
        onSwitchDemoAccount={handleQuickSwitchDemoRole}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            products={products}
            sellers={sellers}
            onSelectProduct={handleSelectProduct}
            onSelectSeller={handleSelectSeller}
            onNavigateExplore={handleNavigateExplore}
            onOpenSell={handleOpenSell}
            onSearchSubmit={handleSearchSubmit}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={(id) => favorites.includes(id)}
            onOpenAboutFounder={() => setAboutFounderModalOpen(true)}
            onOpenSafetyGuide={() => setSafetyGuideModalOpen(true)}
          />
        )}

        {currentView === 'explore' && (
          <ExploreView
            initialCategory={exploreCategory}
            initialKeyword={exploreKeyword}
            onSelectProduct={handleSelectProduct}
            onSelectSeller={handleSelectSeller}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={(id) => favorites.includes(id)}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            seller={sellers.find(s => s.id === selectedProduct.sellerId || s.userId === selectedProduct.sellerId)}
            similarProducts={similarProducts}
            currentUser={currentUser}
            isFavorite={favorites.includes(selectedProduct.id)}
            onBack={() => setCurrentView('explore')}
            onSelectProduct={handleSelectProduct}
            onSelectSeller={handleSelectSeller}
            onToggleFavorite={handleToggleFavorite}
            onOpenContactModal={() => setContactModalOpen(true)}
            onOpenReportModal={() => {
              setReportTarget({
                type: 'product',
                id: selectedProduct.id,
                name: selectedProduct.name
              });
              setReportModalOpen(true);
            }}
            onOpenSafetyGuide={() => setSafetyGuideModalOpen(true)}
            onEditProduct={(prod) => {
              setProductToEdit(prod);
              setAddEditModalOpen(true);
            }}
          />
        )}

        {currentView === 'seller-profile' && activeSellerProfile && (
          <SellerProfileView
            seller={activeSellerProfile}
            products={sellerProducts}
            currentUser={currentUser}
            isFollowing={marketplaceStore.isFollowingSeller(activeSellerProfile.id)}
            onBack={() => setCurrentView('explore')}
            onSelectProduct={handleSelectProduct}
            onToggleFollow={() => {
              marketplaceStore.toggleFollowSeller(activeSellerProfile.id);
              handleRefreshData();
            }}
            onOpenReportSeller={() => {
              setReportTarget({
                type: 'seller',
                id: activeSellerProfile.id,
                name: activeSellerProfile.businessName
              });
              setReportModalOpen(true);
            }}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={(id) => favorites.includes(id)}
          />
        )}

        {currentView === 'seller-dashboard' && currentUser && (
          <SellerDashboardView
            currentUser={currentUser}
            onOpenAddProduct={() => {
              setProductToEdit(null);
              setAddEditModalOpen(true);
            }}
            onEditProduct={(p) => {
              setProductToEdit(p);
              setAddEditModalOpen(true);
            }}
            onViewProduct={handleSelectProduct}
            onRefreshData={handleRefreshData}
          />
        )}

        {currentView === 'admin-dashboard' && currentUser && (
          <AdminDashboardView
            currentUser={currentUser}
            onRefreshData={handleRefreshData}
            onViewProduct={handleSelectProduct}
          />
        )}

        {currentView === 'saved-items' && (
          <SavedItemsView
            favoriteProducts={favoriteProductsList}
            onBack={handleNavigateHome}
            onSelectProduct={handleSelectProduct}
            onToggleFavorite={handleToggleFavorite}
            onSelectSeller={handleSelectSeller}
            onExplore={() => handleNavigateExplore()}
          />
        )}
      </main>

      {/* Mobile Navigation Bar (Bottom) */}
      <MobileNav
        currentTab={currentView === 'home' ? 'home' : currentView === 'explore' ? 'categories' : currentView.includes('dashboard') ? 'profile' : 'search'}
        currentUser={currentUser}
        favoritesCount={favorites.length}
        onNavigateHome={handleNavigateHome}
        onNavigateCategories={() => handleNavigateExplore()}
        onNavigateSearch={() => handleNavigateExplore()}
        onOpenSell={handleOpenSell}
        onNavigateProfile={() => {
          if (!currentUser) {
            setAuthMode('login');
            setAuthModalOpen(true);
          } else if (currentUser.accountType === 'Seller') {
            setCurrentView('seller-dashboard');
            scrollToTop();
          } else if (currentUser.accountType === 'Admin') {
            setCurrentView('admin-dashboard');
            scrollToTop();
          } else {
            setCurrentView('saved-items');
            scrollToTop();
          }
        }}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => handleNavigateExplore(cat)}
        onOpenSafetyGuide={() => setSafetyGuideModalOpen(true)}
        onOpenFounderStory={() => setAboutFounderModalOpen(true)}
      />

      {/* MODALS */}
      {/* 1. Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleLoginSuccess}
      />

      {/* 2. Contact Seller Modal */}
      {contactModalOpen && selectedProduct && (
        <ContactSellerModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          product={selectedProduct}
          currentUser={currentUser}
          onRequireAuth={() => {
            setContactModalOpen(false);
            setAuthMode('login');
            setAuthModalOpen(true);
          }}
        />
      )}

      {/* 3. Report Modal */}
      {reportModalOpen && reportTarget && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          type={reportTarget.type}
          targetId={reportTarget.id}
          targetName={reportTarget.name}
          currentUser={currentUser}
        />
      )}

      {/* 4. Add/Edit Product Modal */}
      {addEditModalOpen && currentUser && (
        <AddEditProductModal
          isOpen={addEditModalOpen}
          onClose={() => setAddEditModalOpen(false)}
          currentUser={currentUser}
          productToEdit={productToEdit}
          onSuccess={(prod) => {
            handleRefreshData();
            showToast(productToEdit ? 'Product listing updated!' : 'Product published successfully to marketplace!');
            handleSelectProduct(prod);
          }}
        />
      )}

      {/* 5. About Founder Modal */}
      <AboutFounderModal
        isOpen={aboutFounderModalOpen}
        onClose={() => setAboutFounderModalOpen(false)}
        onOpenExplore={() => handleNavigateExplore()}
      />

      {/* 6. Safety Guide Modal */}
      <SafetyGuideModal
        isOpen={safetyGuideModalOpen}
        onClose={() => setSafetyGuideModalOpen(false)}
      />

    </div>
  );
}
