import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../lib/db";
import { generateWeeklyReport } from "../../../lib/gemini";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { useStore } from "../../../store/useStore";
import { ArrowLeft, Loader2, Key } from "lucide-react";

export function WeeklyReport() {
    const { setView } = useStore();
    const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
    const [report, setReport] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Get logs from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = useLiveQuery(() =>
        db.questLogs.where('completedAt').above(sevenDaysAgo).toArray()
    );

    const handleGenerate = async () => {
        setLoading(true);
        setError("");

        // Mock Report Logic
        if (!apiKey) {
            setTimeout(() => {
                const mockReport = `## 模擬戦況報告
これはAPIキー未設定時のサンプル出力です。

**分析対象ログ数**: ${logs?.length || 0} 件

## 戦術分析
貴官の過去7日間の活動を確認した。
APIキーが設定されていないため、参謀本部からの詳細な分析は提供できないが、
${logs?.length ? 'クエストの達成自体は確認できている。悪くない。' : 'まだ成果が挙がっていないようだな。戦場に出ろ。'}

## 次なる指令
1. 右上の設定からGemini APIキーを入力せよ。
2. さもなくば、直感のみで突き進め。

以上だ。`;
                setReport(mockReport);
                setLoading(false);
            }, 1000);
            return;
        }

        if (!logs || logs.length === 0) {
            setError("直近7日間のクエストログが見つかりません。まずは任務を遂行してください。");
            setLoading(false);
            return;
        }

        localStorage.setItem("gemini_api_key", apiKey);

        try {
            const result = await generateWeeklyReport(apiKey, logs);
            setReport(result);
        } catch (err) {
            setError("レポートの生成に失敗しました。APIキーまたはネットワークを確認してください。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="icon" onClick={() => setView('dashboard')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-bold">週間戦況報告</h2>
            </div>

            <Card className="border-zinc-800 bg-zinc-950">
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-wider text-zinc-500">
                        通信設定 (Gemini API)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-400">APIキー</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                                <input
                                    type="password"
                                    className="w-full h-9 rounded-md border border-zinc-800 bg-black pl-9 pr-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:outline-none"
                                    placeholder="API Keyを入力 (任意)"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleGenerate} disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "分析開始"}
                            </Button>
                        </div>
                        <p className="text-[10px] text-zinc-600">
                            キーはブラウザ内にのみ保存されます。入力がない場合はサンプル分析を実行します。
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-xs">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {report && (
                <Card className="border-zinc-800 bg-zinc-900/30">
                    <CardContent className="p-6 prose prose-invert prose-sm max-w-none">
                        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                            {report}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
