import type { UseQueryResult } from '@tanstack/react-query';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { apiEndpoints, GET, queryKeys } from '#/constants';
import { performRequest } from '#/services/apiClient';
import type { SearchProductsQueryParams, UseGetProductsProps } from '#/types/products/api.types';
import type { ProductsResponse } from '#/types/products/product.types';

export const useSearchProducts = ({
  params,
  options = {},
}: UseGetProductsProps<SearchProductsQueryParams>): UseQueryResult<ProductsResponse, Error> => {
  return useQuery({
    queryKey: [queryKeys.PRODUCT_SEARCH, params],
    queryFn: ({ signal }) =>
      performRequest<ProductsResponse, undefined, SearchProductsQueryParams>({
        method: GET,
        url: apiEndpoints.PRODUCTS_SEARCH,
        params,
        config: { signal },
      }),
    placeholderData: keepPreviousData,
    ...options,
  });
};
