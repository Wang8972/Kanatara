import type { NextApiRequest, NextApiResponse } from "next";
import { reviewPlan } from "../../../data/sampleData";

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ plan: reviewPlan });
};

export default handler;

