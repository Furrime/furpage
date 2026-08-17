import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { database } from '../db/database.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_FILE = path.join(__dirname, '../db/data/config.json');

function getConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    } catch {
      return null;
    }
  }
  return null;
}

router.get('/profile', (req: Request, res: Response) => {
  const config = getConfig();
  if (config) {
    const profiles = config.profiles || [];
    const activeProfileId = config.activeProfileId || '';
    const details = config.details || database.details.get();
    res.json({ success: true, data: { profiles, activeProfileId, details } });
  } else {
    const profile = database.profile.get();
    const details = database.details.get();
    res.json({ success: true, data: { 
      profiles: [{ ...profile, id: '1' }], 
      activeProfileId: '1', 
      details 
    } });
  }
});

router.get('/gallery', (req: Request, res: Response) => {
  const config = getConfig();
  if (config && config.gallery && config.gallery.length > 0) {
    const gallery = config.gallery.map((item: any) => ({
      id: item.id,
      category: item.category,
      sub_category: item.sub_category,
      url: item.url,
      title: item.title,
      artist: item.artist || '',
      description: item.description || '',
      created_at: item.created_at || new Date().toLocaleDateString('zh-CN'),
    }));
    res.json({ success: true, data: gallery });
  } else {
    res.json({ success: true, data: [] });
  }
});

router.get('/fursuit', (req: Request, res: Response) => {
  const config = getConfig();
  if (config && config.fursuit && config.fursuit.length > 0) {
    const fursuit = {
      making_process: config.fursuit.find((item: any) => item.type === 'making') || {
        title: '',
        description: '',
        images: [],
        materials: [],
        duration: '',
        maker_info: '',
      },
      outfits: config.fursuit.filter((item: any) => item.type === 'outfit').map((item: any) => ({
        title: item.title,
        description: item.description,
        images: item.images || [],
        accessories: [],
      })),
      events: config.fursuit.filter((item: any) => item.type === 'event').map((item: any) => ({
        title: item.title,
        date: item.date || '',
        location: '',
        images: item.images || [],
        description: item.description,
      })),
      care_guide: [],
    };
    res.json({ success: true, data: fursuit });
  } else {
    res.json({ success: true, data: {
      making_process: { title: '', description: '', images: [], materials: [], duration: '', maker_info: '' },
      outfits: [],
      events: [],
      care_guide: [],
    }});
  }
});

router.get('/diary', (req: Request, res: Response) => {
  const config = getConfig();
  if (config && config.diary && config.diary.length > 0) {
    const diary = config.diary.map((item: any) => ({
      id: item.id,
      category: '',
      title: item.title,
      content: item.content,
      author_pov: '本人',
      created_at: item.date || new Date().toLocaleDateString('zh-CN'),
    }));
    res.json({ success: true, data: diary });
  } else {
    res.json({ success: true, data: [] });
  }
});

router.get('/friends', (req: Request, res: Response) => {
  const config = getConfig();
  if (config && config.friends && config.friends.length > 0) {
    const friends = config.friends.map((item: any) => ({
      id: item.id,
      name: item.name,
      species: item.species,
      relationship: '',
      avatar_url: item.avatar,
      description: item.description,
      met_date: '',
    }));
    res.json({ success: true, data: friends });
  } else {
    res.json({ success: true, data: [] });
  }
});

router.get('/commission', (req: Request, res: Response) => {
  const config = getConfig();
  if (config && config.commission) {
    const commission = {
      price_list: config.commission.price_list || config.commission.map((item: any) => ({
        type: item.type,
        price: item.price,
        description: item.description,
        examples: item.example ? [item.example] : [],
      })),
      process: config.commission.process || [],
      payment_methods: config.commission.payment_methods || [],
      duration: config.commission.duration || '',
      revision_rules: config.commission.revision_rules || [],
      forbidden_elements: config.commission.forbidden_elements || [],
      queue: [],
    };
    res.json({ success: true, data: commission });
  } else {
    res.json({ success: true, data: {
      price_list: [],
      process: [],
      payment_methods: [],
      duration: '',
      revision_rules: [],
      forbidden_elements: [],
      queue: [],
    }});
  }
});

router.get('/extras', (req: Request, res: Response) => {
  const config = getConfig();
  if (config && config.extras) {
    res.json({ success: true, data: config.extras });
  } else {
    res.json({ success: true, data: {
      social_links: [],
      timeline: [],
      downloads: [],
      mini_game: { questions: [], results: [] },
    }});
  }
});

export default router;
