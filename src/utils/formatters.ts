import { PriceType } from '../types';

export function formatNaira(amount: number, priceType?: PriceType): string {
  const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount);

  // Replace standard NGN code or symbol with ₦ symbol cleanly
  const cleanNaira = formatted.replace('NGN', '₦').trim();

  if (!priceType || priceType === 'Fixed price') {
    return cleanNaira;
  }

  if (priceType === 'Price per yard') {
    return `${cleanNaira} / yard`;
  }
  if (priceType === 'Price per piece') {
    return `${cleanNaira} / piece`;
  }
  if (priceType === 'Price per bundle') {
    return `${cleanNaira} / bundle`;
  }
  if (priceType === 'Price per pair') {
    return `${cleanNaira} / pair`;
  }
  if (priceType === 'Negotiable') {
    return `${cleanNaira} (Negotiable)`;
  }

  return cleanNaira;
}

export function formatRelativeDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Recently';
  }
}

export function generateWhatsAppLink(
  phone: string, 
  productName: string, 
  productPrice: number,
  location?: string
): string {
  // Clean phone number to international format for Nigeria (+234)
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '234' + cleaned.substring(1);
  } else if (!cleaned.startsWith('234')) {
    cleaned = '234' + cleaned;
  }

  const message = encodeURIComponent(
    `Hello! I found your listing "${productName}" (${formatNaira(productPrice)}) ${
      location ? `in ${location} ` : ''
    }on GERALD FASHION HUB. Is this item still available for purchase?`
  );

  return `https://wa.me/${cleaned}?text=${message}`;
}
