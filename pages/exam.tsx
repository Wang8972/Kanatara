import { FormEvent, useState } from "react";
import { essayPrompt, mcqQuestions } from "../data/sampleData";
import { useAuthGuard } from "../hooks/useAuthGuard";

const ExamPage = () => {
  const { user, initializing } = useAuthGuard();
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [essay, setEssay] = useState("");
  const [essayFeedback, setEssayFeedback] = useState<string | null>(null);
  const [loadingEssay, setLoadingEssay] = useState(false);

  if (!user && !initializing) {
    return null;
  }

  const handleChoiceSubmit = () => {
    setSubmitted(true);
  };

  const handleEssaySubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoadingEssay(true);
    setEssayFeedback(null);
    const response = await fetch("/api/exam/submitEssay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ essayText: essay, topic: essayPrompt.topic }),
    });
    const data = await response.json();
    setEssayFeedback(data.feedback ?? "获得AI反馈失败");
    setLoadingEssay(false);
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">TOPIK 真题模块</h1>
        <p className="text-slate-500 text-sm">选择题即时校验 + 作文区调用AI批改接口（当前返回模拟数据）。</p>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">选择题演练</h2>
          <button className="px-4 py-2 bg-primary text-white rounded-md" onClick={handleChoiceSubmit}>
            提交答案
          </button>
        </div>
        <div className="space-y-4">
          {mcqQuestions.map((question) => (
            <div key={question.id} className="border rounded-lg p-4">
              <p className="font-medium">{question.id}. {question.question}</p>
              <div className="mt-3 grid sm:grid-cols-2 gap-2">
                {question.options.map((option, index) => (
                  <label key={option} className={`border rounded-md px-3 py-2 text-sm flex items-center gap-2 ${
                    submitted && index === question.answerIndex ? "border-green-400 bg-green-50" : ""
                  }`}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={selectedOptions[question.id] === index}
                      onChange={() =>
                        setSelectedOptions((prev) => ({ ...prev, [question.id]: index }))
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {submitted && (
                <p className="text-xs text-green-600 mt-2">
                  正确答案：{question.options[question.answerIndex]} · {question.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <form className="bg-white rounded-xl border p-6 space-y-4" onSubmit={handleEssaySubmit}>
        <div>
          <h2 className="font-semibold">作文题：{essayPrompt.topic}</h2>
          <p className="text-xs text-slate-500">{essayPrompt.instructions}</p>
        </div>
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          rows={8}
          className="w-full border rounded-lg p-4"
          placeholder="请输入作文内容..."
        />
        <button className="px-4 py-2 bg-secondary text-white rounded-md" disabled={loadingEssay}>
          {loadingEssay ? "AI批改中..." : "提交作文"}
        </button>
        {essayFeedback && (
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-sm">
            <p className="font-medium text-slate-700">AI批改反馈（示例）</p>
            <p className="text-slate-600 mt-2">{essayFeedback}</p>
          </div>
        )}
      </form>
    </section>
  );
};

export default ExamPage;


