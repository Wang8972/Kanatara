import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { inviteCodePool } from "../../../data/sampleData";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: "缺少邀请码" });
  }
  const normalizedCode = String(code).trim().toUpperCase();

  try {
    if (!prisma) {
      const valid = inviteCodePool.includes(normalizedCode);
      return res.status(200).json({ valid });
    }

    const record = await prisma.inviteCode.findFirst({
      where: { code: normalizedCode, isActive: true },
    });

    return res.status(200).json({ valid: Boolean(record) });
  } catch (error) {
    return res.status(500).json({ message: "邀请码校验失败", error: (error as Error).message });
  }
};

export default handler;

