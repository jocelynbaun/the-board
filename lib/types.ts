export interface Task {
  id: string;
  task: string;
  completed: boolean;
  created_at: string;
  completed_at?: string;
  category?: 'work' | 'family';
}

export interface SpotlightTask {
  task: string;
  completed: boolean;
  created_at: string;
  completed_at?: string;
}

export interface BoardData {
  spotlight: SpotlightTask | null;
  list: Task[];
  last_reset: string;
}
