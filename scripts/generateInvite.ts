import prisma from "../lib/prisma";
import { randomBytes } from "crypto";

const argCode = process.argv[2];
const code = argCode
  ? argCode.toUpperCase()
  : `KANATARA-${randomBytes(3).toString("hex").toUpperCase()}`;

async function main() {
  if (!prisma) {
    console.log("??  DATABASE_URL 未配置，当前仅打印邀请码：", code);
    return;
  }

  const invite = await prisma.inviteCode.create({
    data: { code },
  });

  console.log("? 已生成邀请码：", invite.code);
}

main()
  .catch((error) => {
    console.error("生成邀请码失败", error);
  })
  .finally(async () => {
    await prisma?.$disconnect();
  });

