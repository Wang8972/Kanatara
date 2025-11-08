import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "kanatara-dev-secret";

export interface TokenPayload {
  userId: number;
  email: string;
}

export const signToken = (payload: TokenPayload, expiresIn = "7d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};


