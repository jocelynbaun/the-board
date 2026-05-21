'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { exportData } from '@/lib/storage';
import { BoardData } from '@/lib/types';

interface ExportButtonProps {
  data: BoardData;
}

export default function ExportButton({ data }: ExportButtonProps) {
  const [exported, setExported] = useState(false);

  function handleClick() {
    exportData(data);
    setExported(true);
    setTimeout(() => setExported(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Export tasks as JSON"
      className="focus-ring"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        borderRadius: 4,
        padding: 0,
        gap: 4,
      }}
    >
      {exported ? (
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Exported!</span>
      ) : (
        <Download size={16} />
      )}
    </button>
  );
}
