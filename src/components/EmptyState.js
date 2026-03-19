'use client';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-8xl mb-6 opacity-50">{icon || '📭'}</div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-2">{title || 'Nothing here yet'}</h3>
      <p className="text-neutral-600 text-center max-w-md mb-8">
        {description || 'There are no items to display at the moment.'}
      </p>
      {action && action}
    </div>
  );
}
