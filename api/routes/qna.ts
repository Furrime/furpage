import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QNA_FILE = path.join(__dirname, '../db/data/qna.json');

interface Question {
  id: string;
  content: string;
  answer?: string;
  is_answered: boolean;
  created_at: string;
}

router.get('/', (req, res) => {
  try {
    if (fs.existsSync(QNA_FILE)) {
      const qna = JSON.parse(fs.readFileSync(QNA_FILE, 'utf-8'));
      res.json({ success: true, data: qna });
    } else {
      res.json({ success: true, data: [] });
    }
  } catch (error) {
    console.error('Failed to read QNA:', error);
    res.json({ success: true, data: [] });
  }
});

router.post('/', (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.json({ success: false, message: '请输入问题内容' });
    }

    let qna: Question[];
    if (fs.existsSync(QNA_FILE)) {
      qna = JSON.parse(fs.readFileSync(QNA_FILE, 'utf-8'));
    } else {
      qna = [];
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      content: content.trim(),
      is_answered: false,
      created_at: new Date().toLocaleString('zh-CN'),
    };

    qna.unshift(newQuestion);
    fs.writeFileSync(QNA_FILE, JSON.stringify(qna, null, 2), 'utf-8');

    res.json({ success: true, message: '提问成功', data: newQuestion });
  } catch (error) {
    console.error('Failed to add question:', error);
    res.json({ success: false, message: '提交失败' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    let qna: Question[];
    if (fs.existsSync(QNA_FILE)) {
      qna = JSON.parse(fs.readFileSync(QNA_FILE, 'utf-8'));
    } else {
      qna = [];
    }

    const questionIndex = qna.findIndex((q) => q.id === id);
    if (questionIndex === -1) {
      return res.json({ success: false, message: '问题不存在' });
    }

    qna[questionIndex] = {
      ...qna[questionIndex],
      answer,
      is_answered: true,
    };

    fs.writeFileSync(QNA_FILE, JSON.stringify(qna, null, 2), 'utf-8');
    res.json({ success: true, message: '回答成功', data: qna[questionIndex] });
  } catch (error) {
    console.error('Failed to answer question:', error);
    res.json({ success: false, message: '回答失败' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    let qna: Question[];
    if (fs.existsSync(QNA_FILE)) {
      qna = JSON.parse(fs.readFileSync(QNA_FILE, 'utf-8'));
    } else {
      qna = [];
    }

    const filteredQna = qna.filter((q) => q.id !== id);
    fs.writeFileSync(QNA_FILE, JSON.stringify(filteredQna, null, 2), 'utf-8');

    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Failed to delete question:', error);
    res.json({ success: false, message: '删除失败' });
  }
});

export default router;
