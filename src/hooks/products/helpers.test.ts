import { describe, expect, it } from 'vitest';

import { getOriginalPrice, getPageWindow, getSafeImageUrl, getStockPresentation } from './helpers';

describe('product helpers', () => {
  it('derives the original price from a discount', () => {
    expect(getOriginalPrice(80, 20)).toBe(100);
  });

  it('returns no original price when there is no valid discount', () => {
    expect(getOriginalPrice(80, 0)).toBeNull();
    expect(getOriginalPrice(80, 100)).toBeNull();
  });

  it('allows HTTPS image URLs', () => {
    expect(getSafeImageUrl('https://example.com/product.jpg')).toBe('https://example.com/product.jpg');
  });

  it('blocks script and data image URLs', () => {
    expect(getSafeImageUrl('javascript:alert(1)')).toBeNull();
    expect(getSafeImageUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
  });

  it('builds a compact page window around the current page', () => {
    expect(getPageWindow(6, 12)).toEqual([1, 'ellipsis-left', 5, 6, 7, 'ellipsis-right', 12]);
  });

  it('classifies zero inventory as out of stock', () => {
    expect(getStockPresentation(0)).toEqual({ label: 'Out of stock', tone: 'out' });
  });
});
