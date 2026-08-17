import express, { type Request, type Response } from 'express';
import { database } from '../db/database.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const messages = database.messages.get();
  const approvedMessages = messages.filter(m => m.is_approved).sort((a, b) => {
    if (a.is_sticky && !b.is_sticky) return -1;
    if (!a.is_sticky && b.is_sticky) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  res.json({ success: true, data: approvedMessages });
});

router.post('/', (req: Request, res: Response) => {
  const { username, content, image_url } = req.body;
  if (!username || !content) {
    return res.status(400).json({ success: false, error: '缺少必要参数' });
  }
  const newMessage = database.messages.create({
    username,
    content,
    image_url,
    is_sticky: false,
    is_approved: true,
  });
  res.json({ success: true, data: newMessage });
});

router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_sticky, is_approved } = req.body;
  database.messages.update(id, { is_sticky, is_approved });
  res.json({ success: true });
});

router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  database.messages.delete(id);
  res.json({ success: true });
});

export default router;
