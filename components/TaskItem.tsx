'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, X } from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onPromote: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export default function TaskItem({ task, onComplete, onDelete, onPromote, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.task);
  const [isHovered, setIsHovered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
