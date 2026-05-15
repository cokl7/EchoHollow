import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getMediationSuggestionsByUserId } from '../db';

const router = express.Router();

router.get('/suggestions', authMiddleware, (req, res) => {
  try {
    const suggestions = getMediationSuggestionsByUserId(req.user!.id);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
