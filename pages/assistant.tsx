import { FormEvent, useMemo, useState } from "react";
import { assistantModes, AssistantMode } from "../data/aiAssistant";
import { useAuthGuard } from "../hooks/useAuthGuard";

type ConversationEntry = {
  role: "user" | "assistant";
  content: string;
  mode: AssistantMode;
};

const helperHints: Record<AssistantMode, string> = {
  grammar: "说明语法功能，附例句。",
  word_lookup: "提供词条、例句与记忆场景。",
  word_test: "先输入词表，我会生成测试题。",
  scene_dialogue: "描述想练习的场景，如‘在咖啡店点单’。",
  simulated_partner: "告诉我想聊的主题，我会用韩语互动。",
  free_qa: "开放问题，优先解答韩语学习相关内容。",
};

const AssistantPage = () => {
  const { user, initializing } = useAuthGuard();
  const [mode, setMode] = useState<AssistantMode>(assistantModes[0].value);
  const [message, setMessage] = useState("");
  const [wordList, setWordList] = useState("");
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (mode === "word_test") {
      return wordList.trim().length > 0;
    }
    return message.trim().length > 0;
  }, [mode, message, wordList]);

  if (!user && !initializing) {
    return null;
  }

  const parseWordList = () => {
    return wordList
      .split(/\n|,|，|\s+/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    const payload: Record<string, unknown> = {
      mode,
      message: message.trim(),
    };

    let wordsList: string[] = [];
    if (mode === "word_test") {
      const words = parseWordList();
      if (words.length === 0) {
        setError("请至少输入 1 个待检测的单词");
        setLoading(false);
        return;
      }
      payload.words = words;
      wordsList = words;
    }

    const userContent = message.trim() || (mode === "word_test" ? `词表：${wordsList.join(", ")}` : "");
    if (userContent) {
      setConversation((prev) => [...prev, { role: "user", content: userContent, mode }]);
    }

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? "AI 助手暂不可用");
      }
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, mode: data.mode },
      ]);
      setMessage("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI 学习助手</h1>
        <p className="text-slate-500 text-sm">
          支持查语法、查词、单词检测、场景对话、模拟对话者、自由问答六种模式，所有回答严格遵守安全规则并以韩语学习为核心。
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <form className="lg:col-span-1 space-y-4 bg-white rounded-xl border p-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs text-slate-500">选择模式</label>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {assistantModes.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setMode(item.value)}
                  className={`border rounded-md px-3 py-2 text-left ${
                    mode === item.value ? "border-primary bg-primary/10" : "border-slate-200"
                  }`}
                >
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500">提示</label>
            <p className="mt-1 text-sm text-slate-600">{helperHints[mode]}</p>
          </div>

          {mode === "word_test" && (
            <div>
              <label className="text-xs text-slate-500">单词列表（换行或逗号分隔）</label>
              <textarea
                value={wordList}
                onChange={(e) => setWordList(e.target.value)}
                rows={4}
                className="mt-1 w-full border rounded-md p-2 text-sm"
                placeholder="예: 감사하다, 도전, 창의적"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-slate-500">输入内容</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={mode === "word_test" ? 3 : 5}
              className="mt-1 w-full border rounded-md p-2 text-sm"
              placeholder={mode === "scene_dialogue" ? "例如：在机场办理登机" : "请描述你的问题"}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full bg-primary text-white rounded-md py-2 disabled:opacity-60"
          >
            {loading ? "生成中..." : "发送"}
          </button>
          <p className="text-[11px] text-slate-400">
            系统说明：请求会携带指定 mode 与系统提示（详见 README），部署真实模型后即可替换当前示例回复。
          </p>
        </form>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border h-[520px] overflow-y-auto p-4 space-y-4">
            {conversation.length === 0 ? (
              <div className="text-sm text-slate-500">
                暂无对话，选择模式后输入内容即可开始练习。当前版本返回示例回答，后端可无缝替换为真实 AI 服务。
              </div>
            ) : (
              conversation.map((entry, index) => (
                <div key={`${entry.role}-${index}`} className="space-y-2">
                  <p className="text-xs text-slate-400">
                    {entry.role === "user" ? "我" : "AI 助手"} · 模式：{entry.mode}
                  </p>
                  <div
                    className={`rounded-xl border p-3 text-sm whitespace-pre-line ${
                      entry.role === "assistant" ? "bg-slate-50" : "bg-white"
                    }`}
                  >
                    {entry.content}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-600">AI 助手安全守则（摘要）</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>仅在指定模式范围内答复，拒绝无关或敏感请求。</li>
              <li>默认使用简体中文+标准韩语表达，不泄露内部信息。</li>
              <li>如用户询问“你是谁”，统一回应为平台 AI 助手。</li>
              <li>未来接入真实模型时，请使用 README 中的 system prompt 作为系统提示。</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssistantPage;

