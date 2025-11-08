import type { NextApiRequest, NextApiResponse } from "next";

// TODO: 接入真实 AI 批改接口，当前仅返回模拟反馈
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { essayText, topic } = req.body;
  if (!essayText) {
    return res.status(400).json({ message: "作文内容不能为空" });
  }

  const randomScore = Math.floor(75 + Math.random() * 20);
  return res.status(200).json({
    score: randomScore,
    feedback: `评分 ${randomScore}/100 · 语法稳健，建议在“${topic ?? "该题"}”中加入更多细节示例。`,
  });
};

export default handler;

