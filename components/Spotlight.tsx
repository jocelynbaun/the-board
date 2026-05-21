'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SpotlightTask } from '@/lib/types';

interface SpotlightProps {
  spotlight: SpotlightTask | null;
  onSave: (text: string) => void;
  onComplete: () => void;
  onRemove: () => void;
  onClear: () => void;
}

export default function Spotlight({ spotlight, onSave, onComplete, onRemove, onClear }: SpotlightProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [spotlight?.task, autoResize]);

  const isCompleted = spotlight?.completed ?? false;
  const isEmpty = !spotlight || !spotlight.task;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'var(--color-spotlight-bg)',
        border: isEmpty ? '1px dashed #C4A8F5' : '1px solid var(--color-spotlight-border)',
        borderLeft: isEmpty ? '3px dashed #C4A8F5' : '3px solid #C4A8F5',
        boxShadow: 'var(--spotlight-glow)',
        borderRadius: 12,
        padding: '24px 24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.12em',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Spotlight
        </p>
        {spotlight && (
          <button
            onClick={onRemove}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
            }}
          >
            Remove
          </button>
        )}
      </div>

      <label htmlFor="spotlight-textarea" className="sr-only">
        Spotlight task
      </label>
      <textarea
        id="spotlight-textarea"
        ref={textareaRef}
        value={spotlight?.task ?? ''}
        placeholder="What's the one thing that would make today feel complete?"
        readOnly={isCompleted}
        onChange={(e) => {
          onSave(e.target.value);
          autoResize();
        }}
        onInput={autoResize}
        rows={1}
        className="focus-ring"
        style={{
          width: '100%',
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 400,
          color: isCompleted ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
          textDecoration: isCompleted ? 'line-through' : 'none',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          overflow: 'hidden',
          lineHeight: 1.5,
          padding: 0,
          cursor: isCompleted ? 'default' : 'text',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
        }}
      >
        {/* Complete checkbox */}
        <button
          onClick={() => !isCompleted && onComplete()}
          aria-label={isCompleted ? 'Spotlight completed' : 'Mark spotlight complete'}
          className="focus-ring"
          style={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: isCompleted ? 'default' : 'pointer',
            marginLeft: -12,
            borderRadius: 4,
            padding: 0,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: `1.5px solid ${isCompleted ? 'var(--color-amber)' : 'var(--color-border)'}`,
              background: isCompleted ? 'var(--color-amber)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            {isCompleted && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </button>

        {/* Clear link */}
        {spotlight && !isCompleted && (
          <button
            onClick={onClear}
            className="focus-ring"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'var(--color-text-secondary)',
              textDecoration: 'underline',
              padding: '4px 8px',
              borderRadius: 4,
            }}
          >
            Clear
          </button>
        )}
      </div>
    </motion.div>
  );
}
