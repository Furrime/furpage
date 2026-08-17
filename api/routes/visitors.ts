import express, { type Request, type Response } from 'express';
import { database } from '../db/database.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const visitors = database.visitors.get();
  res.json({ success: true, data: visitors });
});

router.post('/', (req: Request, res: Response) => {
  const count = database.visitors.increment();
  res.json({ success: true, data: { count } });
});

export default router;
