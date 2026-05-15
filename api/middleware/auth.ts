import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils';
import { getUserById } from '../db';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyToken(token);
    const user = getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: '无效的认证令牌' });
  }
};
