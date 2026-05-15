import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getTreeholePosts, addTreeholePost } from '../db';
import { TreeholePost } from '../types';

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    const posts = getTreeholePosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    const post: TreeholePost = {
      id: Date.now().toString(),
      userId: req.user!.id,
      content,
      isAnonymous,
      createdAt: new Date().toISOString(),
    };

    addTreeholePost(post);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;
