'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Task } from '@/lib/types';

interface DoneZoneProps {
  tasks: Task[];
  onClearDone: () => void;
}

export default function DoneZone({ tasks, onClearDone }: DoneZoneProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  if (tasks.length === 0) return null;

  const listId = 'done-zone-list';

  return (
    <div style={{ marginTop: 32 }}>
      {/* Toggle header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          aria-controls={listId}
          className="focus-ring"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 0',
            minHeight: 44,
            borderRadius: 4,
          }}
        >
          <span>{isExpanded ? '▾' : '▸'} Done</span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              border: '1px solid var(--color-amber)',
              color: 'var(--color-text-secondary)',
              fontSize: 11,
              padding: '0 6px',
            }}
          >
            {tasks.length}
          </span>
        </button>
      </div>

      {/* Expanded list */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={listId}
            key="done-list"
            initial={prefersReducedMotion ? false : { scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              transformOrigin: 'top',
              overflow: 'hidden',
              marginTop: 8,
              background: 'var(--color-done-bg)',
              border: '1px solid var(--color-done-border)',
              borderRadius: 12,
              padding: '12px 16px',
            }}
          >
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
              {tasks.map((t) => (
                <li
                  key={t.id}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'line-through',
                    padding: '4px 0',
                  }}
                >
                  {t.task}
                </li>
              ))}
            </ul>

            {/* Clear confirmation */}
            {!confirming ? (
              <button
                onClick={() => setConfirming(true)}
                className="focus-ring"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'underline',
                  padding: '4px 0',
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Clear all done
              </button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                  minHeight: 44,
                }}
              >
                <span>Clear {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}?</span>
                <button
                  onClick={() => { onClearDone(); setConfirming(false); setIsExpanded(false); }}
                  className="focus-ring"
                  style={{
                    background: 'none',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--color-text-primary)',
                    padding: '4px 12px',
                    borderRadius: 4,
                    minHeight: 44,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="focus-ring"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--color-text-secondary)',
                    padding: '4px 0',
                    minHeight: 44,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
