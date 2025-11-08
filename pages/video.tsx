import { useState } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";

const VideoPage = () => {
  const { user, initializing } = useAuthGuard();
  const [recording, setRecording] = useState(false);
  const [score, setScore] = useState<string | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);

  if (!user && !initializing) {
    return null;
  }

  const toggleRecording = () => {
    setRecording((prev) => !prev);
    setScore(null);
  };

  const handleEvaluate = async () => {
    setLoadingScore(true);
    const response = await fetch("/api/video/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clip: "movie_clip_01" }),
    });
    const data = await response.json();
    setScore(data.result);
    setLoadingScore(false);
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">视频跟读模块</h1>
        <p className="text-slate-500 text-sm">观看韩语影视短片，模拟录音并调用发音评分接口。</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <video controls className="w-full rounded-xl border">
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
        </video>
        <div className="bg-white rounded-xl border p-4 space-y-4">
          <h3 className="font-semibold">跟读工具</h3>
          <p className="text-sm text-slate-500">
            点击下方按钮模拟录音流程，未来将接入浏览器音频流与AI语音评测。
          </p>
          <button
            onClick={toggleRecording}
            className={`w-full py-3 rounded-md text-white ${recording ? "bg-red-500" : "bg-primary"}`}
          >
            {recording ? "停止录音" : "开始录音"}
          </button>
          <button
            onClick={handleEvaluate}
            disabled={loadingScore}
            className="w-full py-3 rounded-md border border-primary text-primary"
          >
            {loadingScore ? "AI评分中..." : "发音评估"}
          </button>
          {score && (
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm">
              <p className="font-semibold">评分结果</p>
              <p className="text-slate-600">{score}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoPage;


