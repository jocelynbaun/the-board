'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  loadBoard,
  saveBoard,
  addTask,
  updateTask,
  completeTask,
  deleteTask,
  promoteToSpotlight,
  setSpotlightText,
  completeSpotlight,
  removeSpotlight,
  clearSpotlight,
  clearDone,
  exportData,
} from '@/lib/storage';
import { BoardData, Task } from '@/lib/types';
import Spotlight from '@/components/Spotlight';
import TaskList from '@/components/TaskList';
import DoneZone from '@/components/DoneZone';
import DateStamp from '@/components/DateStamp';
import ExportButton from '@/components/ExportButton';
import RabbitCelebration from '@/components/RabbitCelebration';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [board, setBoard] = useState<BoardData>({ spotlight: null, list: [], last_reset: '' });
  const [showRabbit, setShowRabbit] = useState(false);

  useEffect(() => {
    setBoard(loadBoard());
    setIsMounted(true);
  }, []);

  const mutate = useCallback((fn: (prev: BoardData) => BoardData) => {
    setBoard((prev) => {
      const next = fn(prev);
      saveBoard(next);
      return next;
    });
  }, []);

  const handleAddTask = useCallback((text: string, category?: Task['category']) => {
    mutate((prev) => addTask(prev, text, category));
  }, [mutate]);

  const handleUpdateTask = useCallback((id: string, text: string) => {
    mutate((prev) => updateTask(prev, id, text));
  }, [mutate]);

  const handleCompleteTask = useCallback((id: string) => {
    mutate((prev) => completeTask(prev, id));
  }, [mutate]);

  const handleDeleteTask = useCallback((id: string) => {
    mutate((prev) => deleteTask(prev, id));
  }, [mutate]);

  const handlePromote = useCallback((id: string) => {
    mutate((prev) => promoteToSpotlight(prev, id));
  }, [mutate]);

  const handleSpotlightSave = useCallback((text: string) => {
    mutate((prev) => setSpotlightText(prev, text));
  }, [mutate]);

  const handleSpotlightComplete = useCallback(() => {
    mutate((prev) => completeSpotlight(prev));
    setShowRabbit(true);
  }, [mutate]);

  const handleSpotlightRemove = useCallback(() => {
    mutate((prev) => removeSpotlight(prev));
  }, [mutate]);

  const handleSpotlightClear = useCallback(() => {
    mutate((prev) => clearSpotlight(prev));
  }, [mutate]);

  const handleClearDone = useCallback(() => {
    mutate((prev) => clearDone(prev));
  }, [mutate]);

  const handleExport = useCallback(() => {
    exportData(board);
  }, [board]);

  if (!isMounted) return null;

  const doneTasks = board.list.filter((t) => t.completed);

  return (
    <div className="page-wrapper">
      <DateStamp />

      {/* Ripped legal pad SVG — fixed right margin decoration */}
      <svg
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: 2,
          pointerEvents: 'none',
          height: '100vh',
          width: 170,
          transform: 'rotate(2.5deg)',
          transformOrigin: 'top right',
        }}
        viewBox="0 0 170 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Torn left edge — organic, irregular path; right edge flush at x=170 */}
        <path
          d="
            M 52,0
            L 170,0
            L 170,1000
            L 48,1000
            C 51,982 44,971 55,958
            C 63,948 38,937 50,922
            C 59,910 42,897 54,883
            C 64,871 36,860 49,845
            C 58,833 40,820 53,807
            C 62,796 37,783 51,768
            C 61,756 39,743 52,729
            C 63,717 41,704 55,690
            C 65,678 38,665 50,650
            C 60,637 37,624 52,610
            C 63,598 40,585 54,571
            C 65,559 39,546 51,531
            C 61,519 36,506 50,492
            C 62,480 40,467 53,452
            C 64,440 38,427 51,413
            C 62,401 37,388 52,374
            C 63,362 41,349 55,335
            C 66,323 39,310 53,296
            C 64,284 38,271 51,257
            C 62,245 36,232 50,218
            C 61,206 39,193 54,179
            C 65,167 40,154 52,140
            C 63,128 37,115 51,101
            C 62,89 38,76 53,62
            C 64,50 41,37 55,23
            C 60,14 50,6 52,0
            Z
          "
          fill="#FEF3C7"
        />
        {/* Horizontal ruled lines */}
        {Array.from({ length: 42 }, (_, i) => (i + 1) * 24).map((y) => (
          <line key={y} x1="58" y1={y} x2="168" y2={y} stroke="#D4C96A" strokeWidth="1" opacity="0.15" />
        ))}
        {/* Pink margin line ~28px from right edge */}
        <line x1="142" y1="0" x2="142" y2="1000" stroke="#F9A8A8" strokeWidth="1" opacity="0.2" />
      </svg>

      <AnimatePresence>
        {showRabbit && (
          <RabbitCelebration onDismiss={() => setShowRabbit(false)} />
        )}
      </AnimatePresence>

      <main
        style={{
          position: 'relative',
          zIndex: 3,
          marginLeft: 'clamp(16px, 4vw, 64px)',
          maxWidth: 900,
          padding: '48px 24px 64px',
        }}
      >
        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 32,
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            The Board
          </h1>
          <ExportButton data={board} />
        </header>

        {/* Spotlight zone */}
        <section aria-label="Spotlight" style={{ marginBottom: 32 }}>
          <Spotlight
            spotlight={board.spotlight}
            onSave={handleSpotlightSave}
            onComplete={handleSpotlightComplete}
            onRemove={handleSpotlightRemove}
            onClear={handleSpotlightClear}
          />
        </section>

        {/* Divider */}
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid var(--color-border)',
            marginBottom: 32,
          }}
        />

        {/* Task list */}
        <section aria-label="Tasks">
          <TaskList
            tasks={board.list}
            onAdd={handleAddTask}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onPromote={handlePromote}
            onUpdate={handleUpdateTask}
          />
        </section>

        {/* Done zone */}
        <DoneZone tasks={doneTasks} onClearDone={handleClearDone} />
      </main>
    </div>
  );
}
