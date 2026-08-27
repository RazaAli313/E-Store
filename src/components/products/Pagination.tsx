import type { JSX } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { getPageWindow } from '#/hooks/products/helpers';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps): JSX.Element | null => {
  if (totalPages <= 1) return null;
  const pages = getPageWindow(currentPage, totalPages);
  const selectPage = (page: number) => () => onPageChange(page);

  return (
    <nav aria-label='Product pages' className='mt-8 flex flex-wrap items-center justify-center gap-1.5'>
      <button
        type='button'
        onClick={selectPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className='flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-800 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-40'
      >
        <ChevronLeft className='h-4 w-4' aria-hidden='true' />
        Prev
      </button>
      {pages.map(item =>
        typeof item === 'number' ? (
          <button
            key={item}
            type='button'
            onClick={selectPage(item)}
            aria-current={item === currentPage ? 'page' : undefined}
            className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
              item === currentPage
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-200 bg-white text-gray-800 hover:border-indigo-300 hover:text-indigo-700'
            }`}
          >
            {item}
          </button>
        ) : (
          <span key={item} aria-hidden='true' className='grid h-10 min-w-7 place-items-center text-gray-500'>
            …
          </span>
        )
      )}
      <button
        type='button'
        onClick={selectPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className='flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-800 transition hover:border-indigo-300 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-40'
      >
        Next
        <ChevronRight className='h-4 w-4' aria-hidden='true' />
      </button>
    </nav>
  );
};

export default Pagination;
