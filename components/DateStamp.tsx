'use client';

import { formatDateStamp } from '@/lib/utils';

export default function DateStamp() {
  const label = formatDateStamp(new Date());

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        right: 24,
        top: '50%',
        transform: 'rotate(90deg)',
        transformOrigin: 'center center',
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: 13,
        color: 'var(--color-text-secondary)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    >
      {label}
    </div>
  );
}
