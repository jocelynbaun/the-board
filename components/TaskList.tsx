'use client';

import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TaskItem from './TaskItem';
import { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  onAdd: (text: string, category?: Task['category']) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onPromote: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onCategoryChange: (id: string, category: Task['category']) => void;
}

const ADD_CAT_OPTIONS = [
  { value: undefined as Task['category'],  label: 'None',   dot: null,      selBg: '#FFFFFF', selBorder: '#D4CFC9', selText: 'var(--color-text-primary)' },
  { value: 'work' as Task['category'],     label: 'Work',   dot: '#3B6DD1', selBg: '#EBF1FC', selBorder: '#3B6DD1', selText: '#3B6DD1' },
  { value: 'family' as Task['category'],   label: 'Family', dot: '#7C3B9E', selBg: '#F0EBFA', selBorder: '#7C3B9E', selText: '#7C3B9E' },
];

export default function TaskList({ tasks, onAdd, onComplete, onDelete, onPromote, onUpdate, onCategoryChange }: TaskListProps) {
  const [inputValue, setInputValue] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [filter, setFilter] = useState<'all' | 'work' | 'family'>('all');
  const [inputFocused, setInputFocused] = useState(false);
  const [newCategory, setNewCategory] = useState<'work' | 'family' | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTasks = tasks.filter((t) => !t.completed && (filter === 'all' || t.category === filter));

  const handleAdd = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }
    onAdd(trimmed, newCategory);
    setInputValue('');
    setNewCategory(undefined);
  }, [inputValue, onAdd]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'work', 'family'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`pill pill-${cat}${filter === cat ? ' selected' : ''}`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <ul
        aria-live="polite"
        aria-label="Task list"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        <AnimatePresence mode="popLayout">
          {activeTasks.length === 0 && (
            <motion.li
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--color-text-secondary)',
                padding: '8px 0',
                fontStyle: 'italic',
              }}
            >
              Nothing on the list yet. Add something.
            </motion.li>
          )}
          {activeTasks.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TaskItem
                task={task}
                onComplete={onComplete}
                onDelete={onDelete}
                onPromote={onPromote}
                onUpdate={onUpdate}
                onCategoryChange={onCategoryChange}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Add input */}
      <div
        className={isShaking ? 'shake' : ''}
        style={{ marginTop: 16, display: 'flex', alignItems: 'center' }}
      >
        <label htmlFor="add-task-input" className="sr-only">Add new task</label>
        <input
          id="add-task-input"
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setTimeout(() => setInputFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
            if (e.key === 'Escape') { setInputValue(''); inputRef.current?.blur(); }
          }}
          placeholder="Add a task..."
          className="focus-ring"
          style={{
            flex: 1,
            fontFamily: 'var(--font-body)',
            fontSize: 17,
            color: 'var(--color-text-primary)',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--color-border)',
            outline: 'none',
            padding: '8px 16px',
          }}
        />
      </div>
      {inputFocused && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {ADD_CAT_OPTIONS.map((opt) => {
            const isSelected = opt.value === newCategory;
            return (
              <button
                key={opt.label}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setNewCategory(opt.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: 20,
                  fontSize: 12, fontFamily: 'var(--font-body)',
                  border: `1px solid ${isSelected ? opt.selBorder : '#D4CFC9'}`,
                  cursor: 'pointer',
                  background: isSelected ? opt.selBg : '#FAF9F6',
                  color: isSelected ? opt.selText : 'var(--color-text-secondary)',
                }}
              >
                {isSelected && opt.dot && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                )}
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
