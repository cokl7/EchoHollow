import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getUserByInviteCode } from '../db';

const router = express.Router();

router.post('/invite', authMiddleware, (req, res) => {
  try {
    const { email } = req.body;
    res.json({ message: '邀请已发送' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/accept', authMiddleware, (req, res) => {
  try {
    const { inviteCode } = req.body;
    const inviter = getUserByInviteCode(inviteCode);

    if (!inviter) {
      return res.status(400).json({ message: '无效的邀请码' });
    }

    inviter.partnerId = req.user!.id;
    req.user!.partnerId = inviter.id;

    const { passwordHash: _, ...userWithoutPassword } = req.user!;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
