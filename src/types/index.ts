/**
 * DRESSÉ – Fashion & Evening Dress Rental
 * Core Data Models & Type Definitions
 */

export type UserRole = 'member' | 'admin';

export interface User {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  createdAt: string;
}

export interface Category {
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  itemCount?: number;
}

export interface Size {
  sizeId: string;
  name: string; // e.g. 'XS', 'S', 'M', 'L', 'XL', 'Free Size'
  description: string;
  bust?: string; // in inches e.g. "32-34"
  waist?: string; // in inches e.g. "24-26"
  hip?: string; // in inches e.g. "34-36"
  length?: string; // in inches e.g. "58"
}

export interface ProductSize {
  productSizeId: string;
  productId: string;
  sizeId: string;
  sizeName: string;
  quantity: number; // total stock
}

export interface Product {
  productId: string;
  productCode: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  color: string;
  colorHex?: string;
  rentalPrice: number; // Rental fee per day in THB
  depositPrice: number; // Security deposit in THB
  images: string[];
  isActive: boolean;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  sizes: {
    sizeId: string;
    sizeName: string;
    quantity: number;
  }[];
  fabric?: string;
  rating?: number;
  rentalCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | 'pending_payment' // Waiting for user to upload bank slip
  | 'payment_review'  // Slip uploaded, waiting for admin approval
  | 'confirmed'       // Payment approved, ready for fitting/dispatch
  | 'in_rental'       // Dress currently with customer
  | 'returned'        // Dress returned, pending inspection & refund
  | 'completed'       // Returned, inspected, deposit refunded
  | 'cancelled'       // Cancelled by user
  | 'rejected';       // Payment or order rejected by admin

export interface Booking {
  bookingId: string;
  bookingCode: string; // e.g. DRS-202611-0012
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  rentalDays: number;
  subtotal: number;
  discount: number;
  deposit: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BookingDetail {
  detailId: string;
  bookingId: string;
  productId: string;
  productName: string;
  productCode: string;
  productImage: string;
  sizeId: string;
  sizeName: string;
  quantity: number;
  rentalPrice: number; // snapshot per day
  depositPrice: number; // snapshot deposit
  rentalDays: number;
  lineTotal: number;
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface Payment {
  paymentId: string;
  bookingId: string;
  bookingCode: string;
  userId: string;
  amount: number;
  paymentMethod: 'bank_transfer';
  slipUrl: string; // Base64 or Storage URL
  paymentStatus: PaymentStatus;
  transferBank?: string;
  transferTime?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectReason?: string;
  createdAt: string;
}

export type ReturnCondition = 'good' | 'minor_damage' | 'major_damage' | 'dirty';
export type ReturnStatus = 'pending_inspection' | 'inspected' | 'refunded' | 'completed';

export interface RentalReturn {
  returnId: string;
  bookingId: string;
  bookingCode: string;
  actualReturnDate: string;
  expectedReturnDate: string;
  returnCondition: ReturnCondition;
  lateDays: number;
  lateFee: number;
  damageFee: number;
  depositRefund: number;
  status: ReturnStatus;
  notes?: string;
  processedBy?: string;
  processedAt?: string;
}

export interface Review {
  reviewId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  productName?: string;
  bookingId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Promotion {
  promotionId: string;
  code: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 15 for 15% or 500 for 500 THB
  minSpend?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Favorite {
  userId: string;
  productIds: string[];
  updatedAt: string;
}

export interface FilterState {
  search: string;
  categoryId: string;
  sizeId: string;
  color: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'popular' | 'newest';
}

export interface TestResultItem {
  id: string;
  name: string;
  category: string;
  status: 'passed' | 'failed' | 'running' | 'idle';
  message: string;
  durationMs?: number;
}
