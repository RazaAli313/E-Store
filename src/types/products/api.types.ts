import type { UseQueryOptions } from '@tanstack/react-query';

import type { ProductDetailData, ProductListItem, ProductsResponse } from './product.types';

export interface ProductsQueryParams extends Record<string, unknown> {
  limit: number;
  skip: number;
  select: string;
}

export interface SearchProductsQueryParams extends ProductsQueryParams {
  q: string;
}

export interface UseGetProductsProps<TParams extends ProductsQueryParams = ProductsQueryParams> {
  params: TParams;
  options?: Omit<UseQueryOptions<ProductsResponse, Error>, 'queryKey' | 'queryFn'>;
}

export interface UseGetCategoryProductsProps {
  slug: string;
  options?: Omit<UseQueryOptions<ProductsResponse, Error>, 'queryKey' | 'queryFn'>;
}

export type ProductDetailQueryOptions = Omit<UseQueryOptions<ProductDetailData, Error>, 'queryKey' | 'queryFn'>;

export interface UseProductsResult {
  products: ProductListItem[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isEmpty: boolean;
  refetch: () => void;
  q: string;
  category: string;
  page: number;
  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  goToPage: (page: number) => void;
  clearFilters: () => void;
}
