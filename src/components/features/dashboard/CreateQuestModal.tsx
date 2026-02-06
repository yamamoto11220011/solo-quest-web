import { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { db, type TaskTag, type TaskDifficulty } from '../../../lib/db';
import { X } from 'lucide-react';

interface CreateQuestModalProps {
    onClose: () => void;
}

export function CreateQuestModal({ onClose }: CreateQuestModalProps) {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(25);
    const [tag, setTag] = useState<TaskTag>('STR');
    const [difficulty, setDifficulty] = useState<TaskDifficulty>('M');

    const handleSubmit = async () => {
        if (!title.trim()) return;

        await db.tasks.add({
            title: title,
            defaultDuration: duration,
            tag: tag,
            difficulty: difficulty,
            isActive: true,
            createdAt: new Date()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm bg-zinc-950 border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">新規クエスト受注</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose} className="-mr-2 h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-400">クエスト名</label>
                        <input
                            className="w-full h-9 rounded-md border border-zinc-800 bg-black px-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:outline-none"
                            placeholder="例: レポート作成、ランニング..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Duration */}
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-400">制限時間 (分)</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[15, 25, 45, 60].map(m => (
                                <button
                                    key={m}
                                    className={`text-xs h-8 rounded border ${duration === m ? 'bg-primary text-black border-primary' : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}
                                    onClick={() => setDuration(m)}
                                >
                                    {m}分
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tag & Difficulty */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-zinc-400">属性 (Tag)</label>
                            <select
                                className="w-full h-9 rounded-md border border-zinc-800 bg-black px-2 text-sm text-white focus:outline-none"
                                value={tag}
                                onChange={(e) => setTag(e.target.value as TaskTag)}
                            >
                                <option value="STR">STR (体力)</option>
                                <option value="INT">INT (知力)</option>
                                <option value="MND">MND (精神)</option>
                                <option value="VIT">VIT (生活)</option>
                                <option value="ETC">ETC (その他)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-zinc-400">ランク</label>
                            <div className="flex bg-black rounded-md border border-zinc-800 p-1 h-9 items-center">
                                {(['S', 'M', 'L'] as TaskDifficulty[]).map((d) => (
                                    <button
                                        key={d}
                                        className={`flex-1 text-xs h-full rounded ${difficulty === d ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-600'}`}
                                        onClick={() => setDifficulty(d)}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button className="w-full font-bold mt-2" onClick={handleSubmit}>
                        Add Quest
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
