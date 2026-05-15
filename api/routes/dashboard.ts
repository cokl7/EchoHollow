import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getDiaryEntriesByUserId, getMediationSuggestionsByUserId } from '../db';

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    const entries = getDiaryEntriesByUserId(req.user!.id);
    const suggestions = getMediationSuggestionsByUserId(req.user!.id);

    const happyCount = entries.filter(e => e.mood === 'happy').length;
    const totalEntries = entries.length || 1;
    const positiveRatio = happyCount / totalEntries;

    const emotionTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      emotionTrend.push({
        date: date.toISOString().split('T')[0],
        score: 70 + Math.random() * 20,
      });
    }

    const dashboardData = {
      relationshipHealth: Math.floor(70 + Math.random() * 20),
      emotionTrend,
      positiveRatio,
      recentSuggestions: suggestions.slice(0, 3),
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
