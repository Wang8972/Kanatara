import type { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { wordId } = req.body;
  if (!wordId) {
    return res.status(400).json({ message: "wordId 缺失" });
  }

  return res.status(200).json({
    success: true,
    wordId,
    message: "已同步至掌握记录（示例数据，等待与MySQL联动）",
  });
};

export default handler;

