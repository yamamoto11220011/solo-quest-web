import Dexie, { type EntityTable } from 'dexie';

// --- Types ---
export type TaskTag = 'STR' | 'INT' | 'MND' | 'VIT' | 'DEX' | 'AGI' | 'ETC';
export type TaskDifficulty = 'S' | 'M' | 'L';

export interface Task {
    id: number; // auto-increment
    title: string;
    defaultDuration: number; // minutes
    tag: TaskTag;
    difficulty: TaskDifficulty;
    isActive: boolean;
    createdAt: Date;
}

export interface QuestLog {
    id: number; // auto-increment
    taskId: number; // Refers to tasks.id
    title: string; // Snapshot of title (in case task is deleted)
    completedAt: Date;
    durationMinutes: number;
    earnedExp: number;
    tag?: TaskTag; // Added in v2
    reflection?: string; // 日記・反省
    aiFeedback?: string; // AIコメント
}

// --- Constants ---
export const TAG_LABELS: Record<TaskTag, string> = {
    STR: '体力 (STR)',
    INT: '知力 (INT)',
    MND: 'メンタル (MND)',
    VIT: '生活 (VIT)',
    DEX: '技巧 (DEX)',
    AGI: '瞬発力 (AGI)',
    ETC: 'その他'
};

// --- Database Class ---
export class SoloQuestDB extends Dexie {
    tasks!: EntityTable<Task, 'id'>;
    questLogs!: EntityTable<QuestLog, 'id'>;

    constructor() {
        super('SoloQuestDB');

        this.version(1).stores({
            tasks: '++id, tag, isActive',
            questLogs: '++id, taskId, completedAt'
        });

        // Version 2: Add tag to questLogs for easier stats aggregation
        this.version(2).stores({
            questLogs: '++id, taskId, completedAt, tag'
        }).upgrade(() => {
            // Migration logic if needed
        });
    }
}

// Singleton instance
export const db = new SoloQuestDB();

// --- Utility Functions (Future Use) ---
export const exportData = async () => {
    // TODO: Implement JSON export
};

export const importData = async (_jsonData: string) => {
    // TODO: Implement JSON import
    console.log("Import not implemented", _jsonData);
};
