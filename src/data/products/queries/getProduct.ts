import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { apiEndpoints, GET, queryKeys } from '#/constants';
import { performRequest } from '#/services/apiClient';
import type { ProductDetailQueryOptions } from '#/types/products/api.types';
import type { ProductDetailData } from '#/types/products/product.types';

export const useGetProduct = (
  id: number,
  options: ProductDetailQueryOptions = {}
): UseQueryResult<ProductDetailData, Error> => {
  return useQuery({
    queryKey: [queryKeys.PRODUCT_DETAIL, id],
    queryFn: ({ signal }) =>
      performRequest<ProductDetailData>({
        method: GET,
        url: apiEndpoints.productDetail(id),
        config: { signal },
      }),
    enabled: Number.isFinite(id),
    ...options,
  });
};
