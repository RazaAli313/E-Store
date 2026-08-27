import { isAxiosError } from 'axios';
import { useParams } from 'react-router-dom';

import { useGetProduct } from '#/data/products/queries/getProduct';

export const useProductDetail = () => {
  const { id } = useParams();
  const productId = Number(id);
  const isValidId = Number.isFinite(productId) && productId > 0;
  const query = useGetProduct(productId, { enabled: isValidId });
  const isNotFound = !isValidId || (isAxiosError(query.error) && query.error.response?.status === 404);

  return {
    productId,
    product: query.data,
    isLoading: query.isLoading,
    isError: query.isError && !isNotFound,
    isNotFound,
    refetch: query.refetch,
  };
};
