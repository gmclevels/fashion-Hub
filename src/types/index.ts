export type CategoryType = 
  | 'Fashion Materials'
  | 'Clothing'
  | 'Shoes'
  | 'Bags'
  | 'Accessories';

export type PriceType = 
  | 'Fixed price'
  | 'Negotiable'
  | 'Price per yard'
  | 'Price per piece'
  | 'Price per bundle'
  | 'Price per pair';

export type Condition = 'New' | 'Used';

export type Gender = 'Male' | 'Female' | 'Unisex';

export type AgeGroup = 'Baby' | 'Children' | 'Teen' | 'Adult';

export type AvailabilityStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Sold Out';

export type AccountType = 'Customer' | 'Seller' | 'Admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  city: string;
  accountType: AccountType;
  createdAt: string;
  avatarUrl?: string;
  businessName?: string;
}

export interface SellerProfile {
  id: string; // matches user id
  userId: string;
  businessName: string;
  sellerName: string;
  avatarUrl: string;
  state: string;
  city: string;
  description: string;
  phone: string;
  whatsApp: string;
  isVerified: boolean; // Platform verification badge
  rating: number;
  reviewCount: number;
  followerCount: number;
  joinedDate: string;
  specialties: string[];
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerBusinessName: string;
  sellerPhone: string;
  sellerWhatsApp: string;
  isSellerVerified: boolean;
  name: string;
  category: CategoryType;
  subcategory: string;
  description: string;
  price: number;
  priceType: PriceType;
  quantity: number;
  condition: Condition;
  gender: Gender;
  ageGroup: AgeGroup;
  size?: string;
  color?: string;
  material?: string;
  brand?: string;
  state: string;
  city: string;
  deliveryAvailable: boolean;
  images: string[];
  availability: AvailabilityStatus;
  isFeatured?: boolean;
  viewsCount: number;
  isSampleListing?: boolean; // clearly marks sample listings per requirement 22
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryMessage {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SellerReview {
  id: string;
  sellerId: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ReportItem {
  id: string;
  type: 'product' | 'seller';
  targetId: string;
  targetName: string;
  reporterName: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface FilterState {
  keyword: string;
  category: string;
  subcategory: string;
  gender: string;
  ageGroup: string;
  state: string;
  city: string;
  minPrice: number | '';
  maxPrice: number | '';
  condition: string;
  availability: string;
  deliveryOnly: boolean;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}
