import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";
import { signToken } from "../../../utils/auth";

const demoUser = {
  email: "demo@kanatara.com",
  password: "kanatara123",
  inviteCode: "KANATARA-2025",
  points: 180,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "邮箱与密码必填" });
  }

  try {
    if (!prisma) {
      if (email === demoUser.email && password === demoUser.password) {
        const token = signToken({ userId: 1, email });
        return res.status(200).json({
          user: { email, inviteCode: demoUser.inviteCode, points: demoUser.points, token },
        });
      }
      return res.status(401).json({ message: "演示账号：demo@kanatara.com / kanatara123" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { points: true, inviteCode: true },
    });

    if (!user) {
      return res.status(401).json({ message: "账号不存在" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "密码错误" });
    }

    const token = signToken({ userId: user.id, email });

    return res.status(200).json({
      user: {
        email,
        inviteCode: user.inviteCode?.code,
        points: user.points?.total ?? 0,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "登录失败", error: (error as Error).message });
  }
};

export default handler;

