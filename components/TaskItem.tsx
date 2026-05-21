'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, X } from 'lucide-react';
import { Task } from '@/lib/types';

const CAT_CONFIG = {
  work:   { label: 'Work',   dot: '#3B6DD1', bg: '#EBF1FC', text: '#3B6DD1' },
  family: { label: 'Family', dot: '#7C3B9E', bg: '#F0EBFA', text: '#7C3B9E' },
};

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onPromote: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onCategoryChange: (id: string, category: Task['category']) => void;
}

export default function TaskItem({ task, onComplete, onDelete, onPromote, onUpdate, onCategoryChange }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.task);
  const [isHovered, setIsHovered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCategoryMenu) return;
    function handleClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setShowCategoryMenu(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showCategoryMenu]);
  const prefersReducedMotion = useReducedMotion();

  const showActions = prefersReducedMotion ? true : isHovered;

  const startEdit = useCallback(() => {
    if (task.completed) return;
    setEditText(task.task);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [task]);

  const saveEdit = useCallback(() => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }
    onUpdate(task.id, trimmed);
    setIsEditing(false);
  }, [editText, onUpdate, task.id]);

  const cancelEdit = useCallback(() => {
    setEditText(task.task);
    setIsEditing(false);
  }, [task.task]);

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 0',
        paddingLeft: 16,
        paddingRight: 16,
        position: 'relative',
        borderBottom: '1px solid var(--color-task-rule)',
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => !task.completed && onComplete(task.id)}
        aria-label={task.completed ? 'Task completed' : 'Mark task complete'}
        className="focus-ring"
        style={{
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: task.completed ? 'default' : 'pointer',
          flexShrink: 0,
          borderRadius: 4,
          padding: 0,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: `1.5px solid ${task.completed ? 'var(--color-amber)' : 'var(--color-border)'}`,
            background: task.completed ? 'var(--color-amber)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 0.2s, background 0.2s',
          }}
        >
          {task.completed && (
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </button>

      {/* Task text / edit input */}
      <div
        className={isShaking ? 'shake' : ''}
        style={{ flex: 1, minWidth: 0 }}
      >
        {isEditing ? (
          <>
            <label htmlFor={`edit-${task.id}`} className="sr-only">Edit task</label>
            <input
              id={`edit-${task.id}`}
              ref={inputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              onBlur={saveEdit}
              className="focus-ring"
              style={{
                width: '100%',
                fontFamily: 'var(--font-body)',
                fontSize: 17,
                color: 'var(--color-text-primary)',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--color-amber)',
                outline: 'none',
                padding: '2px 0',
              }}
            />
          </>
        ) : (
          <span
            onClick={startEdit}
            role="button"
            tabIndex={task.completed ? -1 : 0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEdit(); }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 17,
              color: task.completed ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
              textDecoration: task.completed ? 'line-through' : 'none',
              cursor: task.completed ? 'default' : 'text',
              display: 'block',
              wordBreak: 'break-word',
            }}
          >
            {task.task}
          </span>
        )}
      </div>

      {/* Category trigger + dropdown */}
      <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setShowCategoryMenu((v) => !v)}
          style={{
            background: 'none',
            border: task.category ? `1px solid ${CAT_CONFIG[task.category].text}` : 'none',
            cursor: 'pointer',
            padding: task.category ? '3px 8px' : '2px 6px',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            backgroundColor: task.category ? CAT_CONFIG[task.category].bg : 'transparent',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: task.category ? CAT_CONFIG[task.category].text : '#B8B3AD',
          }}
        >
          {task.category ? (
            <>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: CAT_CONFIG[task.category].dot, flexShrink: 0 }} />
              {CAT_CONFIG[task.category].label}
            </>
          ) : '+ Category'}
        </button>
        {showCategoryMenu && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 4px)',
            width: 140, background: '#FFFFFF',
            border: '1px solid #E8E4DF', borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 100,
            padding: '4px 0',
          }}>
            {(['work', 'family'] as const).map((cat) => (
              <div
                key={cat}
                onClick={() => { onCategoryChange(task.id, cat); setShowCategoryMenu(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', cursor: 'pointer',
                  fontSize: 14, fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_CONFIG[cat].dot, flexShrink: 0 }} />
                {CAT_CONFIG[cat].label}
                {task.category === cat && <span style={{ marginLeft: 'auto', color: 'var(--color-text-secondary)' }}>✓</span>}
              </div>
            ))}
            <div
              onClick={() => { onCategoryChange(task.id, undefined); setShowCategoryMenu(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', cursor: 'pointer',
                fontSize: 14, fontFamily: 'var(--font-body)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid #D4CFC9', flexShrink: 0 }} />
              None
              {!task.category && <span style={{ marginLeft: 'auto' }}>✓</span>}
            </div>
            {task.category && (
              <>
                <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #E8E4DF' }} />
                <div
                  onClick={() => { onCategoryChange(task.id, undefined); setShowCategoryMenu(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', cursor: 'pointer',
                    fontSize: 12, fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  ✕ Clear
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Promote button */}
      {!task.completed && (
        <div style={{ position: 'relative' }}>
          {showTooltip && (
            <div style={{
              position: 'absolute', bottom: '100%', left: '50%',
              transform: 'translateX(-50%)',
              background: '#1A1814', color: '#FFFFFF',
              fontSize: 12, borderRadius: 8,
              padding: '4px 8px', whiteSpace: 'nowrap',
              pointerEvents: 'none', marginBottom: 4,
            }}>
              Set as Spotlight
            </div>
          )}
          <motion.button
            onClick={() => onPromote(task.id)}
            aria-label="Promote to Spotlight"
            className="focus-ring"
            animate={{ opacity: showActions ? 1 : 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
            onMouseEnter={() => {
              tooltipTimeout.current = setTimeout(() => setShowTooltip(true), 300);
            }}
            onMouseLeave={() => {
              if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
              setShowTooltip(false);
            }}
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              flexShrink: 0,
              borderRadius: 4,
              padding: 0,
            }}
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      )}

      {/* Delete button */}
      <motion.button
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="focus-ring"
        animate={{ opacity: showActions ? 1 : 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
        style={{
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          flexShrink: 0,
          borderRadius: 4,
          padding: 0,
        }}
      >
        <X size={16} />
      </motion.button>
    </motion.div>
  );
}
