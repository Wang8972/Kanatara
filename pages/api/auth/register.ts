import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";
import { inviteCodePool } from "../../../data/sampleData";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, inviteCode } = req.body;
  if (!email || !password || !inviteCode) {
    return res.status(400).json({ message: "邮箱、密码、邀请码均为必填" });
  }

  const normalizedInviteCode = String(inviteCode).trim().toUpperCase();

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    if (!prisma) {
      if (!inviteCodePool.includes(normalizedInviteCode)) {
        return res.status(400).json({ message: "邀请码无效（示例池验证失败）" });
      }
      return res.status(201).json({
        message: "注册成功（演示环境未连接数据库）",
        user: { email, inviteCode: normalizedInviteCode, passwordHash },
      });
    }

    const invite = await prisma.inviteCode.findFirst({
      where: { code: normalizedInviteCode, isActive: true },
    });

    if (!invite) {
      return res.status(400).json({ message: "邀请码不可用或已失效" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "邮箱已被注册" });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        inviteCode: { connect: { id: invite.id } },
        points: { create: {} },
      },
    });

    await prisma.inviteCode.update({
      where: { id: invite.id },
      data: { isActive: false },
    });

    return res.status(201).json({ message: "注册成功", userId: newUser.id });
  } catch (error) {
    return res.status(500).json({ message: "注册失败", error: (error as Error).message });
  }
};

export default handler;

