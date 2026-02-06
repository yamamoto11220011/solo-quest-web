import { useState, useEffect } from 'react';
import { db } from '../../../lib/db';
import type { Task } from '../../../lib/db';
import { Button } from '../../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Star } from 'lucide-react';
import { playSound } from '../../../lib/sound';

interface CompletionModalProps {
    task: Task;
    duration: number; // minutes
    onClose: () => void;
}

export function CompletionModal({ task, duration, onClose }: CompletionModalProps) {
    const [reflection, setReflection] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        playSound.levelUp();
    }, []);

    const calculateExp = () => {
        let multiplier = 1.0;
        if (task.difficulty === 'S') multiplier = 1.0;
        if (task.difficulty === 'M') multiplier = 1.5;
        if (task.difficulty === 'L') multiplier = 2.0;
        return Math.floor(duration * 10 * multiplier);
    };

    const earnedExp = calculateExp();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await db.questLogs.add({
                taskId: task.id,
                title: task.title,
                completedAt: new Date(),
                durationMinutes: duration,
                earnedExp: earnedExp,
                tag: task.tag,
                reflection: reflection,
            });
            onClose();
        } catch (error) {
            console.error("Failed to save log", error);
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm bg-zinc-950 border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    </div>
                    <CardTitle className="text-xl text-primary">クエスト完了！</CardTitle>
                    <p className="text-zinc-400 text-sm">"{task.title}" を攻略しました</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-center gap-8 text-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                        <div>
                            <div className="text-xs text-zinc-500 uppercase">時間</div>
                            <div className="text-lg font-mono font-bold text-white">{duration}分</div>
                        </div>
                        <div>
                            <div className="text-xs text-zinc-500 uppercase">獲得経験値</div>
                            <div className="text-lg font-mono font-bold text-yellow-500">+{earnedExp}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 ml-1">冒険日誌 (振り返り)</label>
                        <textarea
                            className="w-full min-h-[80px] rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="学んだことや、今の気持ちを記録しましょう"
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="ghost" onClick={onClose} disabled={isSaving} className="flex-1">
                            破棄
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving} className="flex-1 font-bold">
                            {isSaving ? '保存中...' : '報酬を受け取る'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
