import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../lib/db";
import { Star } from "lucide-react";

export function Header() {
    const questLogs = useLiveQuery(() => db.questLogs.toArray());

    const totalExp = questLogs?.reduce((acc, log) => acc + log.earnedExp, 0) || 0;
    const level = Math.floor(totalExp / 100) + 1;
    const nextLevelExp = Math.ceil((totalExp + 1) / 100) * 100;
    const currentLevelExp = totalExp % 100;
    const progress = (currentLevelExp / 100) * 100;

    return (
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-zinc-800 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    SoloQuest
                </h1>
                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-1 text-zinc-100">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>Lv. {level}</span>
                    </div>
                    <div className="flex flex-col w-32">
                        <div className="flex justify-between text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                            <span>経験値</span>
                            <span>{totalExp} / {nextLevelExp}</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
