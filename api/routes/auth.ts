import express from 'express';
import { getUserByEmail, addUser } from '../db';
import { generateToken, hashPassword, verifyPassword, generateInviteCode } from '../utils';
import { User } from '../types';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    const token = generateToken(user.id);
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: '该邮箱已被注册' });
    }

    const passwordHash = await hashPassword(password);
    const user: User = {
      id: Date.now().toString(),
      email,
      passwordHash,
      name,
      inviteCode: generateInviteCode(),
      subscriptionTier: 'free',
      createdAt: new Date().toISOString(),
    };

    addUser(user);

    const token = generateToken(user.id);
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
