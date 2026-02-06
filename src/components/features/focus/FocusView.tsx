import { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { useWakeLock } from '../../../hooks/useWakeLock';
import { Button } from '../../ui/button';
import { CompletionModal } from './CompletionModal';
import { Play, Pause, CheckCircle } from 'lucide-react';
import { playSound } from '../../../lib/sound';

export function FocusView() {
    const { activeTask, endTask } = useStore();
    const { requestWakeLock, releaseWakeLock } = useWakeLock();

    if (!activeTask) return null;

    // Use defaultDuration * 60 for seconds
    const [timeLeft, setTimeLeft] = useState(activeTask.defaultDuration * 60);
    const [isActive, setIsActive] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        requestWakeLock();
        setIsActive(true);
        return () => {
            releaseWakeLock();
        };
    }, [requestWakeLock, releaseWakeLock]);

    useEffect(() => {
        let interval: number;
        if (isActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            playSound.complete(); // Play simple chime
            setShowModal(true);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    // Format time mm:ss
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Progress
    const totalSeconds = activeTask.defaultDuration * 60;
    const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden">
            {/* Background Progress */}
            <div className="absolute inset-0 flex items-end">
                <div
                    className="w-full bg-primary/20 transition-all duration-1000 ease-linear"
                    style={{ height: `${progress}%` }}
                />
            </div>

            <div className="z-10 flex flex-col items-center gap-8 w-full max-w-md px-4">
                <h2 className="text-zinc-400 uppercase tracking-widest text-sm font-semibold text-center">
                    {activeTask.title}
                </h2>

                <div className="text-8xl font-black font-mono tracking-tighter text-white tabular-nums select-none">
                    {timeString}
                </div>

                <div className="flex gap-6">
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-20 h-20 rounded-full border-4 border-zinc-800 bg-black hover:bg-zinc-900 hover:border-zinc-700 transition-all"
                        onClick={() => setIsActive(!isActive)}
                    >
                        {isActive ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
                    </Button>

                    <Button
                        variant="default"
                        size="icon"
                        className="w-20 h-20 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all bg-primary text-black"
                        onClick={() => { setIsActive(false); playSound.complete(); setShowModal(true); }}
                    >
                        <CheckCircle className="w-10 h-10" />
                    </Button>
                </div>

                <Button variant="ghost" className="text-zinc-600 hover:text-red-500 mt-4" onClick={endTask}>
                    撤退する
                </Button>
            </div>

            {showModal && (
                <CompletionModal
                    task={activeTask}
                    duration={Math.ceil((totalSeconds - timeLeft) / 60)}
                    onClose={endTask}
                />
            )}
        </div>
    );
}
