import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, TAG_LABELS } from "../../../lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { useStore } from "../../../store/useStore";
import { Play, Plus, Trash2 } from "lucide-react";
import { CreateQuestModal } from "./CreateQuestModal";
import type { TaskTag, Task } from "../../../lib/db";

export function Dashboard() {
    const tasks = useLiveQuery(() => db.tasks.filter(t => t.isActive).toArray());
    const logs = useLiveQuery(() => db.questLogs.toArray());
    const { startTask } = useStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm("このクエストを破棄しますか？")) {
            await db.tasks.update(id, { isActive: false });
        }
    };

    // Calculate Stats
    const stats = logs?.reduce((acc, log) => {
        const tag = log.tag || 'ETC';
        acc[tag] = (acc[tag] || 0) + log.earnedExp;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="flex flex-col gap-4 p-4 pb-20 w-full max-w-md mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold tracking-tight">クエストボード</h2>
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-zinc-500" onClick={() => (useStore.getState().setView('analysis'))}>
                        参謀本部
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" /> Add
                    </Button>
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateQuestModal onClose={() => setIsCreateModalOpen(false)} />
            )}

            {/* Stats Matrix */}
            <div className="grid grid-cols-5 gap-2 mb-2">
                {(['STR', 'INT', 'MND', 'VIT', 'ETC'] as TaskTag[]).map((tag) => (
                    <div key={tag} className="flex flex-col items-center p-2 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                        <span className="text-[10px] font-bold text-zinc-500 whitespace-nowrap scale-90">{tag}</span>
                        <span className="text-sm font-mono font-bold text-primary">
                            {stats?.[tag] || 0}
                        </span>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                {Object.entries(tasks?.reduce((acc, task) => {
                    const tag = task.tag || 'ETC';
                    if (!acc[tag]) acc[tag] = [];
                    acc[tag].push(task);
                    return acc;
                }, {} as Record<string, Task[]>) || {}).map(([tag, groupTasks]) => (
                    <div key={tag}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                                {TAG_LABELS[tag as TaskTag] || tag}
                            </span>
                            <div className="h-[1px] flex-1 bg-zinc-900"></div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {groupTasks.map((task: Task) => (
                                <Card
                                    key={task.id}
                                    className="cursor-pointer hover:bg-zinc-900 transition-all border-zinc-800 group active:scale-95 relative"
                                    onClick={() => startTask(task)}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 w-6 h-6 text-zinc-600 hover:text-red-500 hover:bg-zinc-800 z-10"
                                        onClick={(e) => handleDelete(e, task.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>

                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                                        <CardTitle className="text-sm font-medium leading-none max-w-[85%] truncate">
                                            {task.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <div className="flex justify-between items-center text-xs text-zinc-500 mt-2">
                                            <span className="font-mono text-zinc-600">RANK <span className="text-zinc-300">{task.difficulty}</span></span>
                                            <div className="flex items-center gap-1 text-primary">
                                                <Play className="w-3 h-3 fill-primary" />
                                                <span>{task.defaultDuration} min</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

                {tasks?.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-zinc-800 rounded-lg">
                        <p className="text-zinc-500 text-sm mb-2">現在進行中のクエストはありません</p>
                        <Button variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(true)}>Add your first quest</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
