import type { JSX } from 'react';

import { PackageSearch, TriangleAlert } from 'lucide-react';

interface StateMessageProps {
  title: string;
  description: string;
  variant?: 'empty' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}

const StateMessage = ({
  title,
  description,
  variant = 'empty',
  actionLabel,
  onAction,
}: StateMessageProps): JSX.Element => {
  const Icon = variant === 'error' ? TriangleAlert : PackageSearch;

  return (
    <section className='grid min-h-[44vh] place-items-center text-center'>
      <div className='max-w-md'>
        <span className='mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600'>
          <Icon className='h-8 w-8' aria-hidden='true' />
        </span>
        <h2 className='mt-4 text-xl font-bold text-gray-900'>{title}</h2>
        <p className='mt-2 text-sm leading-6 text-gray-500'>{description}</p>
        {actionLabel && onAction && (
          <button
            type='button'
            onClick={onAction}
            className='mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2'
          >
            {actionLabel}
          </button>
        )}
      </div>
    </section>
  );
};

export default StateMessage;
