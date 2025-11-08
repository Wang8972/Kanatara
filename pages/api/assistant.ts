import type { NextApiRequest, NextApiResponse } from "next";
import { AssistantMode, aiSystemPrompt, assistantModes } from "../../data/aiAssistant";

const allowedModes = assistantModes.map((mode) => mode.value);

type HandlerResponse = {
  reply: string;
  mode: AssistantMode;
  notice: string;
};

const buildGrammarReply = (message: string): string => {
  return [
    **功能说明**：针对你提到的“”，此语法常用于表达因果或强调句义，请结合上下文理解。,
    "**形式结构**：动词词干 + 지만 / 名词 + 이지만；如遇以元音结尾时保持原形，不需要额外元音。",
    "**使用场景与注意事项**：常见于书面或正式口语，可用于对比或让步句；若要提升礼貌度，可在句尾添加 요。",
    "**例句**：\n1. 한국어는 어렵지만 재미있어요. — 韩语虽然难，但很有趣。\n2. 날씨가 춥지만 산책을 했어요. — 天气很冷，但我去散步了。\n3. 학생이지만 회사에서 일해요. — 虽然是学生，但也在公司工作。",
  ].join("\n\n");
};

const buildWordLookupReply = (message: string): string => {
  return [
    **词条**： / 감사하다（感到感谢）/ 动词,
    "**例句**：\n1. 도움에 감사합니다. — 感谢您的帮助。\n2. 항상 부모님께 감사해요. — 我一直心怀感激父母。\n3. 그 말이 정말 감사해요. — 你的那句话让我很感激。",
    "**记忆场景**：想象自己在课堂结束后向老师说 ‘오늘 수업에 진심으로 감사해요’，让情境帮助巩固单词。",
  ].join("\n\n");
};

const buildWordTestReply = (words: string[] | undefined, message: string): string => {
  if (!words || words.length === 0) {
    return "请先提供需要检测的韩文或中文单词列表（5~10 个最佳），我会基于列表生成韩译中 / 中译韩测试题。";
  }

  const limited = words.slice(0, 5);
  const questions = limited
    .map((word, index) => {
      const isEven = index % 2 === 0;
      if (isEven) {
        return ${index + 1}. 韩译中： → ______;
      }
      return ${index + 1}. 中译韩： → ______;
    })
    .join("\n");

  return [
    收到你的词表（ 项），以下是本轮记忆检测。请按照编号作答，可以直接回复“1. 答案; 2. 答案 …”。,
    questions,
    "作答后我会提供正确答案与讲评，并给出常见错误提示。",
  ].join("\n\n");
};

const buildSceneDialogueReply = (message: string): string => {
  return [
    **场景：**,
    "A: 안녕하세요, 주문 도와드릴까요?\n   你好，请问需要点什么？",
    "B: 아이스 아메리카노 한 잔 주세요.\n   请给我一杯冰美式。",
    "A: 알겠습니다. 이름이 어떻게 되세요?\n   好的，请问您的名字？",
    "B: 김지우예요. 여기서 마실게요.\n   叫金智宇。我在店里喝。",
    "A: 잠시만 기다려 주세요. 곧 나옵니다.\n   请稍等，马上就好。",
  ].join("\n\n");
};

const buildSimulatedPartnerReply = (message: string): string => {
  return [
    "안녕하세요! 오늘 기분이 어때요? (你好，今天感觉如何？)",
    혹시  에 대해 한국어로 한 문장 말해 볼래요? (试着用韩语围绕这个主题说一句吧),
    "네 문장을 보내주면 자연스러운 표현으로 고쳐 드릴게요. 화이팅!",
  ].join("\n");
};

const buildFreeQaReply = (message: string): string => {
  return [
    关于“”的建议如下：,
    "- 先用韩文关键词列出提纲，再逐句扩写，可减少语法错误。",
    "- 每天安排 10 分钟跟读，利用 Kanatara 的视频模块＋录音功能巩固发音。",
    "- 若遇到语法盲区，可随时切换到查语法模式深入了解。",
  ].join("\n");
};

const handler = (req: NextApiRequest, res: NextApiResponse<HandlerResponse | { message: string }>) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { mode, message, words } = req.body as {
    mode?: AssistantMode;
    message?: string;
    words?: string[];
  };

  if (!mode || !allowedModes.includes(mode)) {
    return res.status(400).json({ message: "mode 参数不合法" });
  }

  if (!message && mode !== "word_test") {
    return res.status(400).json({ message: "请输入用户提问内容" });
  }

  let reply = "";

  switch (mode) {
    case "grammar":
      reply = buildGrammarReply(message ?? "该语法");
      break;
    case "word_lookup":
      reply = buildWordLookupReply(message ?? "感到感谢");
      break;
    case "word_test":
      reply = buildWordTestReply(words, message ?? "");
      break;
    case "scene_dialogue":
      reply = buildSceneDialogueReply(message ?? "在咖啡店点单");
      break;
    case "simulated_partner":
      reply = buildSimulatedPartnerReply(message ?? "오늘 기분");
      break;
    case "free_qa":
    default:
      reply = buildFreeQaReply(message ?? "韩语学习");
      break;
  }

  return res.status(200).json({
    reply,
    mode,
    notice: "当前为示例回应，部署真实模型时请使用 aiSystemPrompt 作为系统提示",
  });
};

export default handler;
