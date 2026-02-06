import { create } from 'zustand'
import type { Task } from '../lib/db'

type View = 'dashboard' | 'focus' | 'analysis';

interface AppState {
    view: View;
    activeTask: Task | null;
    setView: (view: View) => void;
    startTask: (task: Task) => void;
    endTask: () => void;
}

export const useStore = create<AppState>((set) => ({
    view: 'dashboard',
    activeTask: null,
    setView: (view) => set({ view }),
    startTask: (task) => set({ view: 'focus', activeTask: task }),
    endTask: () => set({ view: 'dashboard', activeTask: null }),
}))
