import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getDiaryEntriesByUserId, addDiaryEntry, addMediationSuggestion } from '../db';
import { DiaryEntry } from '../types';
import { analyzeEmotion, generateMediationSuggestions } from '../utils';

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    const entries = getDiaryEntriesByUserId(req.user!.id);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const { content, mood, tags } = req.body;

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      userId: req.user!.id,
      content,
      mood,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDiaryEntry(entry);

    const analysis = analyzeEmotion(content, req.user!.id, entry.id);
    const suggestions = generateMediationSuggestions(req.user!.id, content);
    suggestions.forEach(suggestion => addMediationSuggestion(suggestion));

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
