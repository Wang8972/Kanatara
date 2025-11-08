import type { NextApiRequest, NextApiResponse } from "next";

// TODO: 与语音评测服务对接（科大讯飞/自研模型等）
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const score = Math.floor(80 + Math.random() * 15);
  return res.status(200).json({
    result: `得分：${score}/100 · 发音清晰，重音稍需加强`,
  });
};

export default handler;

