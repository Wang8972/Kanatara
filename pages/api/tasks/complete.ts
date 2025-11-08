import type { NextApiRequest, NextApiResponse } from "next";
import { dailyTasks } from "../../../data/sampleData";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ message: "taskId 缺失" });
  }

  const task = dailyTasks.find((item) => item.id === taskId);
  const reward = task?.reward ?? 10;

  return res.status(200).json({
    message: "任务完成",
    taskId,
    reward,
    totalPoints: 120 + reward,
  });
};

export default handler;

