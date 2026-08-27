import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import { ArrowLeft, Heart, ShoppingCart, Star } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ROUTES } from '#/constants';
import { useCommerce } from '#/context';
import {
  formatCategory,
  formatPrice,
  getOriginalPrice,
  getSafeImageUrl,
  getStockPresentation,
} from '#/hooks/products/helpers';
import { useProductDetail } from '#/hooks/products/useProductDetail';
import type { ProductDetailData, ProductReview } from '#/types/products/product.types';
import Spinner from './Spinner';
import StateMessage from './StateMessage';
import StoreHeader from './StoreHeader';

interface ProductLocationState {
  listSearch?: string;
}

const stockToneClasses = {
  available: 'bg-emerald-50 text-emerald-700',
  low: 'bg-amber-50 text-amber-700',
  out: 'bg-red-50 text-red-700',
};

interface ProductDetailContentProps {
  product: ProductDetailData;
  backPath: string;
}

const ProductDetailContent = ({ product, backPath }: ProductDetailContentProps): JSX.Element => {
  const { addToCart, toggleWishlist, isWishlisted } = useCommerce();
  const galleryImages = product.images.length > 0 ? product.images : [product.thumbnail];
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const mainImageUrl = getSafeImageUrl(selectedImage);
  const originalPrice = getOriginalPrice(product.price, product.discountPercentage);
  const stock = getStockPresentation(product.stock);
  const wishlisted = isWishlisted(product.id);
  const selectImage = (image: string) => () => setSelectedImage(image);
  const addProductToCart = () => {
    addToCart(product);
    toast.success(`${product.title} added to your cart.`);
  };
  const updateWishlist = () => {
    toggleWishlist(product.id);
    toast.success(
      wishlisted ? `${product.title} removed from your wishlist.` : `${product.title} saved to your wishlist.`
    );
  };

  return (
    <div className='min-h-screen bg-[#f5f6fb] text-gray-900'>
      <StoreHeader />
      <main className='mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8'>
        <Link
          to={backPath}
          className='mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-gray-500 outline-none transition hover:text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2'
        >
          <ArrowLeft className='h-4 w-4' aria-hidden='true' />
          Back to products
        </Link>

        <div className='grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]'>
          <section aria-label='Product gallery'>
            <div className='aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100'>
              {mainImageUrl ? (
                <img src={mainImageUrl} alt={product.title} className='h-full w-full object-cover' />
              ) : (
                <div className='grid h-full place-items-center text-sm text-gray-500'>Image unavailable</div>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className='mt-3 flex gap-2.5 overflow-x-auto pb-1' aria-label='Choose product image'>
                {galleryImages.map((image, index) => {
                  const imageUrl = getSafeImageUrl(image);
                  return (
                    <button
                      key={image}
                      type='button'
                      onClick={selectImage(image)}
                      aria-label={`Show image ${index + 1}`}
                      aria-pressed={image === selectedImage}
                      className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-gray-100 outline-none transition focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                        image === selectedImage ? 'border-indigo-600' : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      {imageUrl && <img src={imageUrl} alt='' className='h-full w-full object-cover' />}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className='self-start rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7'>
            <p className='text-sm font-semibold text-gray-500'>{formatCategory(product.category)}</p>
            <h1 className='mt-1 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl'>{product.title}</h1>
            <p className='mt-2 text-base text-gray-500'>by {product.brand ?? 'Independent'}</p>

            <div className='mt-4 flex flex-wrap items-center gap-2'>
              <span className='flex text-amber-500' aria-label={`${product.rating.toFixed(1)} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className={`h-5 w-5 ${index < Math.round(product.rating) ? 'fill-current' : ''}`} />
                ))}
              </span>
              <span className='font-bold'>{product.rating.toFixed(1)}</span>
              <span className='text-sm text-gray-500'>({product.reviews.length} reviews)</span>
            </div>

            <div className='mt-6 flex flex-wrap items-baseline gap-3'>
              <span className='text-3xl font-extrabold text-gray-950'>{formatPrice(product.price)}</span>
              {originalPrice !== null && (
                <>
                  <span className='text-base text-gray-500 line-through'>{formatPrice(originalPrice)}</span>
                  <span className='rounded-lg bg-red-50 px-2.5 py-1 text-sm font-bold text-red-600'>
                    Save {Math.round(product.discountPercentage ?? 0)}%
                  </span>
                </>
              )}
            </div>

            <div className='mt-5 flex items-center gap-3'>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${stockToneClasses[stock.tone]}`}>
                {stock.label}
              </span>
              <span className='text-sm text-gray-500'>{product.stock} left</span>
            </div>

            <p className='mt-6 text-base leading-7 text-gray-700'>{product.description}</p>

            <div className='mt-7 flex flex-wrap gap-3'>
              <button
                type='button'
                onClick={addProductToCart}
                disabled={product.stock <= 0}
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white outline-none transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <ShoppingCart className='h-5 w-5' aria-hidden='true' />
                {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
              </button>
              <button
                type='button'
                onClick={updateWishlist}
                aria-pressed={wishlisted}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${
                  wishlisted
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-indigo-600 bg-white text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? 'fill-current' : ''}`} aria-hidden='true' />
                {wishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            <dl className='mt-7 grid gap-x-8 gap-y-3 border-t border-gray-200 pt-5 text-sm sm:grid-cols-2'>
              <ProductFact label='Brand' value={product.brand ?? 'Independent'} />
              <ProductFact label='Category' value={formatCategory(product.category)} />
              <ProductFact label='SKU' value={product.sku} />
              <ProductFact label='Shipping' value={product.shippingInformation} />
            </dl>
          </section>
        </div>

        <section className='mt-10' aria-labelledby='reviews-heading'>
          <h2 id='reviews-heading' className='text-xl font-extrabold text-gray-950'>
            Customer reviews
          </h2>
          {product.reviews.length > 0 ? (
            <div className='mt-4 space-y-3'>
              {product.reviews.map(review => (
                <ReviewCard key={`${review.reviewerEmail}-${review.date}`} review={review} />
              ))}
            </div>
          ) : (
            <p className='mt-3 text-sm text-gray-500'>No reviews yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

interface ProductFactProps {
  label: string;
  value: string;
}

const ProductFact = ({ label, value }: ProductFactProps): JSX.Element => (
  <div className='flex items-start justify-between gap-3'>
    <dt className='text-gray-500'>{label}</dt>
    <dd className='text-right font-bold text-gray-900'>{value}</dd>
  </div>
);

const ReviewCard = ({ review }: { review: ProductReview }): JSX.Element => {
  const reviewDate = new Date(review.date);
  const formattedDate = Number.isNaN(reviewDate.getTime())
    ? review.date
    : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(reviewDate);

  return (
    <article className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h3 className='font-bold text-gray-900'>{review.reviewerName}</h3>
          <span className='mt-1 flex text-amber-500' aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} className={`h-4 w-4 ${index < review.rating ? 'fill-current' : ''}`} />
            ))}
          </span>
        </div>
        <time dateTime={review.date} className='text-sm text-gray-500'>
          {formattedDate}
        </time>
      </div>
      <p className='mt-3 leading-6 text-gray-700'>{review.comment}</p>
    </article>
  );
};

const ProductDetail = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, isLoading, isError, isNotFound, refetch } = useProductDetail();
  const listSearch = (location.state as ProductLocationState | null)?.listSearch ?? '';
  const backPath = `${ROUTES.HOME}${listSearch}`;
  const returnToProducts = () => navigate(backPath);
  const retryProductRequest = () => {
    void refetch();
  };

  useEffect(() => {
    if (isError) toast.error('Product details could not be loaded.');
  }, [isError]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#f5f6fb]'>
        <StoreHeader />
        <main>
          <Spinner label='Loading product details...' />
        </main>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className='min-h-screen bg-[#f5f6fb]'>
        <StoreHeader />
        <main>
          <StateMessage
            title='Product not found'
            description='This product does not exist or may no longer be available.'
            actionLabel='Back to products'
            onAction={returnToProducts}
          />
        </main>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className='min-h-screen bg-[#f5f6fb]'>
        <StoreHeader />
        <main>
          <StateMessage
            variant='error'
            title='Product details are unavailable'
            description='Check your connection and try loading this product again.'
            actionLabel='Try again'
            onAction={retryProductRequest}
          />
        </main>
      </div>
    );
  }

  return <ProductDetailContent product={product} backPath={backPath} />;
};

export default ProductDetail;
