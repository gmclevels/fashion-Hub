import { 
  Product, 
  SellerProfile, 
  User, 
  EnquiryMessage, 
  ReportItem, 
  FilterState, 
  AccountType 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SELLERS, 
  INITIAL_USERS 
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'gfh_products_v1',
  SELLERS: 'gfh_sellers_v1',
  USERS: 'gfh_users_v1',
  CURRENT_USER: 'gfh_current_user_v1',
  FAVORITES: 'gfh_favorites_v1',
  ENQUIRIES: 'gfh_enquiries_v1',
  REPORTS: 'gfh_reports_v1',
  FOLLOWED_SELLERS: 'gfh_followed_sellers_v1'
};

// Ensure default data exists
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SELLERS)) {
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(INITIAL_SELLERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FOLLOWED_SELLERS)) {
    localStorage.setItem(STORAGE_KEYS.FOLLOWED_SELLERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default to guest (null)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(null));
  }
}

// Call on import
initStorage();

export const marketplaceStore = {
  // PRODUCTS
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },

  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newProduct, ...products];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    return newProduct;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedProduct = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    products[index] = updatedProduct;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return updatedProduct;
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length !== products.length) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
      return true;
    }
    return false;
  },

  incrementProductViews(id: string): void {
    const products = this.getProducts();
    const prod = products.find(p => p.id === id);
    if (prod) {
      prod.viewsCount = (prod.viewsCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  },

  // SELLERS
  getSellers(): SellerProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SELLERS);
      return data ? JSON.parse(data) : INITIAL_SELLERS;
    } catch {
      return INITIAL_SELLERS;
    }
  },

  getSellerById(id: string): SellerProfile | undefined {
    const sellers = this.getSellers();
    return sellers.find(s => s.id === id || s.userId === id);
  },

  updateSellerProfile(id: string, updates: Partial<SellerProfile>): SellerProfile | null {
    const sellers = this.getSellers();
    const index = sellers.findIndex(s => s.id === id || s.userId === id);
    if (index === -1) return null;

    const updated = {
      ...sellers[index],
      ...updates
    };
    sellers[index] = updated;
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(sellers));
    return updated;
  },

  toggleFollowSeller(sellerId: string): boolean {
    const followed = this.getFollowedSellers();
    const isFollowing = followed.includes(sellerId);
    let next: string[];

    if (isFollowing) {
      next = followed.filter(id => id !== sellerId);
    } else {
      next = [...followed, sellerId];
    }

    localStorage.setItem(STORAGE_KEYS.FOLLOWED_SELLERS, JSON.stringify(next));

    // Update count in seller
    const sellers = this.getSellers();
    const seller = sellers.find(s => s.id === sellerId);
    if (seller) {
      seller.followerCount = Math.max(0, (seller.followerCount || 0) + (isFollowing ? -1 : 1));
      localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(sellers));
    }

    return !isFollowing;
  },

  getFollowedSellers(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOLLOWED_SELLERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isFollowingSeller(sellerId: string): boolean {
    return this.getFollowedSellers().includes(sellerId);
  },

  // AUTH & USERS
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  registerUser(params: {
    fullName: string;
    email: string;
    phoneNumber: string;
    state: string;
    city: string;
    accountType: AccountType;
    businessName?: string;
  }): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === params.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: params.fullName,
      email: params.email,
      phoneNumber: params.phoneNumber,
      state: params.state,
      city: params.city,
      accountType: params.accountType,
      businessName: params.businessName || `${params.fullName}'s Fashion Shop`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // If registered as Seller, create their initial seller profile
    if (params.accountType === 'Seller') {
      const sellers = this.getSellers();
      const newSeller: SellerProfile = {
        id: newUser.id,
        userId: newUser.id,
        businessName: newUser.businessName || `${params.fullName}'s Fashion Shop`,
        sellerName: params.fullName,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        state: params.state,
        city: params.city,
        description: `Welcome to ${newUser.businessName}! Providing quality fashion products and fast delivery across Nigeria.`,
        phone: params.phoneNumber,
        whatsApp: params.phoneNumber,
        isVerified: false,
        rating: 5.0,
        reviewCount: 0,
        followerCount: 0,
        joinedDate: 'October 2026',
        specialties: ['Fashion & Materials']
      };
      sellers.push(newSeller);
      localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(sellers));
    }

    this.setCurrentUser(newUser);
    return newUser;
  },

  loginUser(email: string): User {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('No account found with this email. Please check your credentials or register a new account.');
    }
    this.setCurrentUser(user);
    return user;
  },

  logoutUser(): void {
    this.setCurrentUser(null);
  },

  // FAVORITES
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite(productId: string): boolean {
    const favorites = this.getFavorites();
    const isFav = favorites.includes(productId);
    let next: string[];
    if (isFav) {
      next = favorites.filter(id => id !== productId);
    } else {
      next = [...favorites, productId];
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next));
    return !isFav;
  },

  isFavorite(productId: string): boolean {
    return this.getFavorites().includes(productId);
  },

  // ENQUIRIES
  getEnquiries(): EnquiryMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  sendEnquiry(enquiry: Omit<EnquiryMessage, 'id' | 'createdAt' | 'status'>): EnquiryMessage {
    const enquiries = this.getEnquiries();
    const newEnquiry: EnquiryMessage = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    enquiries.unshift(newEnquiry);
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    return newEnquiry;
  },

  getSellerEnquiries(sellerId: string): EnquiryMessage[] {
    return this.getEnquiries().filter(e => e.sellerId === sellerId);
  },

  updateEnquiryStatus(id: string, status: 'pending' | 'responded' | 'closed'): void {
    const enquiries = this.getEnquiries();
    const match = enquiries.find(e => e.id === id);
    if (match) {
      match.status = status;
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    }
  },

  // REPORTS (Trust & Safety)
  getReports(): ReportItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  submitReport(report: Omit<ReportItem, 'id' | 'createdAt' | 'status'>): ReportItem {
    const reports = this.getReports();
    const newReport: ReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return newReport;
  },

  updateReportStatus(id: string, status: 'pending' | 'resolved' | 'dismissed'): void {
    const reports = this.getReports();
    const match = reports.find(r => r.id === id);
    if (match) {
      match.status = status;
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    }
  },

  // FILTER LOGIC
  filterProducts(filters: FilterState): Product[] {
    let items = this.getProducts();

    if (filters.keyword.trim()) {
      const q = filters.keyword.toLowerCase().trim();
      items = items.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.state.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'all') {
      items = items.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.subcategory && filters.subcategory !== 'all') {
      items = items.filter(p => p.subcategory.toLowerCase() === filters.subcategory.toLowerCase());
    }

    if (filters.gender && filters.gender !== 'all') {
      items = items.filter(p => p.gender.toLowerCase() === filters.gender.toLowerCase() || p.gender === 'Unisex');
    }

    if (filters.ageGroup && filters.ageGroup !== 'all') {
      items = items.filter(p => p.ageGroup.toLowerCase() === filters.ageGroup.toLowerCase());
    }

    if (filters.state && filters.state !== 'all') {
      items = items.filter(p => p.state.toLowerCase() === filters.state.toLowerCase());
    }

    if (filters.city && filters.city !== 'all') {
      items = items.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
    }

    if (filters.condition && filters.condition !== 'all') {
      items = items.filter(p => p.condition.toLowerCase() === filters.condition.toLowerCase());
    }

    if (filters.availability && filters.availability !== 'all') {
      items = items.filter(p => p.availability.toLowerCase() === filters.availability.toLowerCase());
    }

    if (filters.deliveryOnly) {
      items = items.filter(p => p.deliveryAvailable);
    }

    if (typeof filters.minPrice === 'number') {
      items = items.filter(p => p.price >= (filters.minPrice as number));
    }

    if (typeof filters.maxPrice === 'number') {
      items = items.filter(p => p.price <= (filters.maxPrice as number));
    }

    // Sorting
    if (filters.sortBy === 'newest') {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'popular') {
      items.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    }

    return items;
  },

  // RESET TO FACTORY DEMO DATA
  resetToSampleData(): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(INITIAL_SELLERS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.FOLLOWED_SELLERS, JSON.stringify([]));
  }
};
