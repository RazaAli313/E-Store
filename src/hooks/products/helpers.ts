import type { ProductListItem } from '#/types/products/product.types';

export type PageItem = number | 'ellipsis-left' | 'ellipsis-right';
export type StockTone = 'available' | 'low' | 'out';

export interface StockPresentation {
  label: string;
  tone: StockTone;
}

export const formatCategory = (slug: string): string => {
  return slug
    .split('-')
    .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
};

export const matchesTerm = (product: ProductListItem, term: string): boolean => {
  const searchableText = `${product.title} ${product.brand ?? ''} ${product.description ?? ''}`.toLowerCase();
  return searchableText.includes(term.trim().toLowerCase());
};

export const getOriginalPrice = (price: number, discountPercentage = 0): number | null => {
  if (discountPercentage <= 0 || discountPercentage >= 100) return null;
  return price / (1 - discountPercentage / 100);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
};

export const getSafeImageUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? value : null;
  } catch {
    return null;
  }
};

export const getStockPresentation = (stock: number): StockPresentation => {
  if (stock <= 0) return { label: 'Out of stock', tone: 'out' };
  if (stock < 15) return { label: 'Low stock', tone: 'low' };
  return { label: 'In stock', tone: 'available' };
};

export const getPageWindow = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 4) end = 5;
  if (currentPage >= totalPages - 3) start = totalPages - 4;

  const pages: PageItem[] = [1];
  if (start > 2) pages.push('ellipsis-left');
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push('ellipsis-right');
  pages.push(totalPages);
  return pages;
};
