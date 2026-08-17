import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_PASSWORD_FILE = path.join(__dirname, '../db/data/admin_password.json');
const CONFIG_FILE = path.join(__dirname, '../db/data/config.json');

function getAdminPassword(): string {
  if (fs.existsSync(ADMIN_PASSWORD_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(ADMIN_PASSWORD_FILE, 'utf-8'));
      return data.password || process.env.ADMIN_PASSWORD || 'admin123';
    } catch {
      return process.env.ADMIN_PASSWORD || 'admin123';
    }
  }
  return '';
}

function setAdminPassword(password: string): void {
  fs.writeFileSync(ADMIN_PASSWORD_FILE, JSON.stringify({ password }, null, 2), 'utf-8');
}

const ADMIN_PASSWORD = getAdminPassword();

const defaultConfig = {
  site: {
    title: 'furpage™',
    subtitle: '',
    favicon: '',
    background: '',
    backgroundType: 'color' as const,
    backgroundColor: '#FFF8F0',
    useProfileName: false,
    displayProfileId: '',
  },
  profiles: [
    {
      id: '1',
      name: '',
      species: '',
      gender: '',
      age: 0,
      height: 0,
      fur_color: '',
      personality: '',
      likes: [],
      dislikes: [],
      bio: '',
      avatar: '',
      gallery: [],
      habits: '',
      backstory: '',
      world_view: '',
      taboos: '',
      created_at: '',
    },
  ],
  activeProfileId: '1',
  details: {
    paw_pad_color: '',
    tail_description: '',
    horns_description: '',
    wings_description: '',
    scars: '',
    special_marks: '',
    heterochromatic_fur: '',
  },
  home: {
    carousel: [],
    intro: '',
  },
  gallery: [],
  fursuit: [],
  diary: [],
  friends: [],
  commission: {
    price_list: [],
    process: ['私信咨询', '确认需求', '支付定金', '开始绘制', '提交初稿', '修改调整', '支付尾款', '交付成品'],
    payment_methods: ['微信支付', '支付宝'],
    duration: '7-14天',
    revision_rules: ['初稿可修改2次', '细节调整不限'],
    forbidden_elements: ['NSFW内容', '暴力血腥'],
  },
  features: {
    home: true,
    profile: true,
    gallery: true,
    fursuit: true,
    diary: true,
    friends: true,
    guestbook: true,
    commission: true,
    extras: false,
    qna: true,
    details: true,
  },
};

router.get('/init-status', (req, res) => {
  const passwordSet = getAdminPassword() !== '';
  const configExists = fs.existsSync(CONFIG_FILE);
  res.json({
    success: true,
    data: {
      passwordSet,
      configExists,
      initialized: passwordSet && configExists,
    },
  });
});

router.post('/init', (req, res) => {
  const { password, config } = req.body;
  if (!password || password.length < 4) {
    return res.json({ success: false, message: '密码长度至少4位' });
  }
  
  try {
    setAdminPassword(password);
    if (config) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    }
    res.json({ success: true, message: '初始化成功' });
  } catch (error) {
    console.error('Failed to initialize:', error);
    res.json({ success: false, message: '初始化失败' });
  }
});

router.post('/login', (req, res) => {
  const { password } = req.body;
  const currentPassword = getAdminPassword();
  
  if (!currentPassword) {
    return res.json({ success: false, message: '管理员密码尚未设置，请先进行初始化' });
  }
  
  if (password === currentPassword) {
    res.json({ success: true, message: '登录成功' });
  } else {
    res.json({ success: false, message: '密码错误' });
  }
});

router.get('/config', (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      res.json({ success: true, data: config });
    } else {
      res.json({ success: true, data: defaultConfig });
    }
  } catch (error) {
    console.error('Failed to read config:', error);
    res.json({ success: true, data: defaultConfig });
  }
});

router.put('/config', (req, res) => {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ success: true, message: '配置保存成功' });
  } catch (error) {
    console.error('Failed to save config:', error);
    res.json({ success: false, message: '保存失败' });
  }
});

router.post('/change-password', (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const currentPassword = getAdminPassword();
  
  if (!currentPassword) {
    return res.json({ success: false, message: '管理员密码尚未设置，请先进行初始化' });
  }
  
  if (oldPassword !== currentPassword) {
    return res.json({ success: false, message: '旧密码错误' });
  }
  
  if (!newPassword || newPassword.length < 4) {
    return res.json({ success: false, message: '新密码长度至少4位' });
  }
  
  if (newPassword !== confirmPassword) {
    return res.json({ success: false, message: '两次输入的密码不一致' });
  }
  
  try {
    setAdminPassword(newPassword);
    res.json({ success: true, message: '密码修改成功' });
  } catch (error) {
    console.error('Failed to change password:', error);
    res.json({ success: false, message: '密码修改失败' });
  }
});

export default router;
