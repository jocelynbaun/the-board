import { BoardData, Task, SpotlightTask } from './types';
import { generateId, getTodayString } from './utils';

const STORAGE_KEY = 'the-board-data';

function getDefaultBoard(): BoardData {
  return {
    spotlight: null,
    list: [],
    last_reset: getTodayString(),
  };
}

export function resetDoneZoneIfNewDay(data: BoardData): BoardData {
  const today = getTodayString();
  if (data.last_reset !== today) {
    const newList = data.list.filter((t) => !t.completed);
    let newSpotlight = data.spotlight;
    if (newSpotlight?.completed) {
      newSpotlight = null;
    }
    return { ...data, list: newList, spotlight: newSpotlight, last_reset: today };
  }
  return data;
}

export function loadBoard(): BoardData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return resetDoneZoneIfNewDay(getDefaultBoard());
    const parsed = JSON.parse(raw) as BoardData;
    return resetDoneZoneIfNewDay(parsed);
  } catch {
    return getDefaultBoard();
  }
}

export function saveBoard(data: BoardData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable — silently fail
  }
}

export function addTask(data: BoardData, text: string, category?: Task['category']): BoardData {
  const task: Task = {
    id: generateId(),
    task: text,
    completed: false,
    created_at: new Date().toISOString(),
    category,
  };
  return { ...data, list: [...data.list, task] };
}

export function updateTask(data: BoardData, id: string, text: string): BoardData {
  return {
    ...data,
    list: data.list.map((t) => (t.id === id ? { ...t, task: text } : t)),
  };
}

export function completeTask(data: BoardData, id: string): BoardData {
  return {
    ...data,
    list: data.list.map((t) =>
      t.id === id
        ? { ...t, completed: true, completed_at: new Date().toISOString() }
        : t
    ),
  };
}

export function deleteTask(data: BoardData, id: string): BoardData {
  return { ...data, list: data.list.filter((t) => t.id !== id) };
}

export function promoteToSpotlight(data: BoardData, id: string): BoardData {
  const task = data.list.find((t) => t.id === id);
  if (!task) return data;
  const spotlight: SpotlightTask = {
    task: task.task,
    completed: false,
    created_at: task.created_at,
  };
  return {
    ...data,
    spotlight,
    list: data.list.filter((t) => t.id !== id),
  };
}

export function setSpotlightText(data: BoardData, text: string): BoardData {
  if (!data.spotlight) {
    const spotlight: SpotlightTask = {
      task: text,
      completed: false,
      created_at: new Date().toISOString(),
    };
    return { ...data, spotlight };
  }
  return { ...data, spotlight: { ...data.spotlight, task: text } };
}

export function completeSpotlight(data: BoardData): BoardData {
  if (!data.spotlight) return data;
  const completedTask: Task = {
    id: generateId(),
    task: data.spotlight.task,
    completed: true,
    created_at: data.spotlight.created_at,
    completed_at: new Date().toISOString(),
  };
  return {
    ...data,
    spotlight: null,
    list: [...data.list, completedTask],
  };
}

export function removeSpotlight(data: BoardData): BoardData {
  if (!data.spotlight) return data;
  const text = data.spotlight.task.trim();
  const alreadyInList = data.list.some((t) => t.task === text);
  if (alreadyInList) {
    return { ...data, spotlight: null };
  }
  const task: Task = {
    id: generateId(),
    task: text,
    completed: false,
    created_at: data.spotlight.created_at,
  };
  return { ...data, spotlight: null, list: [task, ...data.list] };
}

export function clearSpotlight(data: BoardData): BoardData {
  return { ...data, spotlight: null };
}

export function updateTaskCategory(data: BoardData, id: string, category: Task['category']): BoardData {
  return {
    ...data,
    list: data.list.map((t) => t.id === id ? { ...t, category } : t),
  };
}

export function clearDone(data: BoardData): BoardData {
  return { ...data, list: data.list.filter((t) => !t.completed) };
}

export function exportData(data: BoardData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const today = getTodayString();
  const a = document.createElement('a');
  a.href = url;
  a.download = `the-board-${today}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
