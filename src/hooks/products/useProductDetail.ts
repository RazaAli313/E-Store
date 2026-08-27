import { useParams } from 'react-router-dom';

import { useGetProduct } from '#/data/products/queries/getProduct';
import { ApiRequestError } from '#/services/apiRequestError';

export const useProductDetail = () => {
  const { id } = useParams();
  const productId = Number(id);
  const isValidId = Number.isFinite(productId) && productId > 0;
  const query = useGetProduct(productId, { enabled: isValidId });
  const isNotFound = !isValidId || (query.error instanceof ApiRequestError && query.error.statusCode === 404);

  return {
    productId,
    product: query.data,
    isLoading: query.isLoading,
    isError: query.isError && !isNotFound,
    isNotFound,
    refetch: query.refetch,
  };
};
