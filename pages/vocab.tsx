import { useEffect, useRef, useState } from "react";
import { ReviewPlan, vocabWords as initialWords } from "../data/sampleData";
import { useAuthGuard } from "../hooks/useAuthGuard";

const VocabPage = () => {
  const { user, initializing } = useAuthGuard();
  const [words, setWords] = useState(initialWords);
  const [reviewPlan, setReviewPlan] = useState<ReviewPlan | null>(null);
  const [handwritingMessage, setHandwritingMessage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const fetchReviewList = async () => {
      const response = await fetch("/api/vocab/reviewList");
      const data = await response.json();
      setReviewPlan(data.plan);
    };
    fetchReviewList();
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setDrawing(true);
    draw(event);
  };

  const endDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.beginPath();
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!drawing || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#2563eb";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.beginPath();
    setHandwritingMessage("已清空，继续练习写字吧！");
  };

  const handleMarkLearned = async (id: number) => {
    const response = await fetch("/api/vocab/markLearned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordId: id }),
    });
    const data = await response.json();
    if (response.ok) {
      setWords((prev) => prev.map((word) => (word.id === id ? { ...word, mastered: true } : word)));
      setHandwritingMessage(data.message);
    }
  };

  if (!user && !initializing) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">词汇学习模块</h1>
        <p className="text-slate-500 text-sm">单词卡片、复习计划、手写练习三位一体。</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {words.map((word) => (
            <div key={word.id} className="bg-white rounded-xl border p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-semibold">{word.word}</p>
                <p className="text-sm text-slate-500">{word.translation} · {word.level}</p>
                <p className="text-xs text-slate-400 mt-1">例句：{word.example}</p>
              </div>
              <button
                onClick={() => handleMarkLearned(word.id)}
                disabled={word.mastered}
                className={`px-4 py-2 rounded-md text-sm ${
                  word.mastered ? "bg-green-100 text-green-600" : "bg-primary text-white"
                }`}
              >
                {word.mastered ? "已掌握" : "标记已掌握"}
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-2">复习计划 API</h3>
            {reviewPlan ? (
              <div className="text-sm text-slate-600 space-y-2">
                <p>?? 日期：{new Date(reviewPlan.date).toLocaleDateString()}</p>
                <p>?? 复习词：{reviewPlan.words.join(", ")}</p>
                <p>?? 提示：{reviewPlan.tip}</p>
              </div>
            ) : (
              <p>加载复习计划...</p>
            )}
          </div>
          <div className="bg-white rounded-xl border p-4 space-y-3">
            <h3 className="font-semibold">手写练习（Canvas 模拟）</h3>
            <canvas
              ref={canvasRef}
              width={320}
              height={200}
              className="border rounded-lg w-full"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
            />
            <div className="flex gap-2">
              <button onClick={clearCanvas} className="flex-1 border rounded-md py-2">清空</button>
              <button
                onClick={() => setHandwritingMessage("练字完成！未来可上传识别。")}
                className="flex-1 bg-secondary text-white rounded-md"
              >
                记录完成
              </button>
            </div>
            {handwritingMessage && <p className="text-xs text-slate-500">{handwritingMessage}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VocabPage;


