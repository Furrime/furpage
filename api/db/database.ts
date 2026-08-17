import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ProfileData {
  id: string;
  name: string;
  species: string;
  gender: string;
  age: number;
  height: number;
  fur_color: string;
  eye_color: string;
  patterns: string;
  accessories: string;
  personality: string;
  likes: string;
  dislikes: string;
  habits: string;
  backstory: string;
  world_view: string;
  taboos: string;
  created_at: string;
}

interface DetailsData {
  id: string;
  profile_id: string;
  paw_pad_color: string;
  tail_description: string;
  horns_description: string;
  wings_description: string;
  scars: string;
  special_marks: string;
  heterochromatic_fur: string;
}

interface ReferenceImageData {
  id: string;
  profile_id: string;
  type: string;
  url: string;
  description: string;
}

interface GalleryData {
  id: string;
  category: string;
  sub_category: string;
  url: string;
  title: string;
  artist: string;
  description: string;
  created_at: string;
}

interface DiaryData {
  id: string;
  category: string;
  title: string;
  content: string;
  author_pov: string;
  created_at: string;
}

interface FriendsData {
  id: string;
  name: string;
  species: string;
  relationship: string;
  avatar_url: string;
  description: string;
  met_date: string;
}

interface MessageData {
  id: string;
  username: string;
  content: string;
  image_url?: string;
  is_sticky: boolean;
  is_approved: boolean;
  created_at: string;
}

interface VisitorsData {
  id: string;
  count: number;
  last_visit: string;
}

interface FursuitData {
  making_process: {
    title: string;
    description: string;
    images: string[];
    materials: string[];
    duration: string;
    maker_info: string;
  };
  outfits: {
    title: string;
    description: string;
    images: string[];
    accessories: string[];
  }[];
  events: {
    title: string;
    date: string;
    location: string;
    images: string[];
    description: string;
  }[];
  care_guide: {
    title: string;
    content: string;
  }[];
}

interface CommissionData {
  price_list: {
    type: string;
    price: number;
    description: string;
    examples: string[];
  }[];
  process: string[];
  payment_methods: string[];
  duration: string;
  revision_rules: string[];
  forbidden_elements: string[];
  queue: {
    id: string;
    customer: string;
    type: string;
    status: string;
    estimated_date: string;
  }[];
}

interface ExtrasData {
  social_links: {
    platform: string;
    url: string;
    icon: string;
  }[];
  timeline: {
    date: string;
    event: string;
    description: string;
    image?: string;
  }[];
  downloads: {
    name: string;
    type: string;
    url: string;
    size: string;
  }[];
  mini_game: {
    questions: {
      question: string;
      options: string[];
      answer: number;
    }[];
    results: {
      score_range: [number, number];
      title: string;
      description: string;
    }[];
  };
}

const defaultProfile: ProfileData = {
  id: '1',
  name: '',
  species: '',
  gender: '',
  age: 0,
  height: 0,
  fur_color: '',
  eye_color: '',
  patterns: '',
  accessories: '',
  personality: '',
  likes: '',
  dislikes: '',
  habits: '',
  backstory: '',
  world_view: '',
  taboos: '',
  created_at: new Date().toISOString().split('T')[0],
};

const defaultDetails: DetailsData = {
  id: '1',
  profile_id: '1',
  paw_pad_color: '',
  tail_description: '',
  horns_description: '',
  wings_description: '',
  scars: '',
  special_marks: '',
  heterochromatic_fur: '',
};

const defaultReferenceImages: ReferenceImageData[] = [];

const defaultGallery: GalleryData[] = [];

const defaultDiary: DiaryData[] = [];

const defaultFriends: FriendsData[] = [];

const defaultMessages: MessageData[] = [];

const defaultVisitors: VisitorsData = {
  id: '1',
  count: 0,
  last_visit: new Date().toISOString(),
};

const defaultFursuit: FursuitData = {
  making_process: {
    title: '',
    description: '',
    images: [],
    materials: [],
    duration: '',
    maker_info: '',
  },
  outfits: [],
  events: [],
  care_guide: [],
};

const defaultCommission: CommissionData = {
  price_list: [],
  process: [],
  payment_methods: [],
  duration: '',
  revision_rules: [],
  forbidden_elements: [],
  queue: [],
};

const defaultExtras: ExtrasData = {
  social_links: [],
  timeline: [],
  downloads: [],
  mini_game: {
    questions: [],
    results: [],
  },
};

function readFile<T>(filename: string, defaultValue: T): T {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return defaultValue;
    }
  } else {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
}

function writeFile<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to write file:', filename, error);
  }
}

export const database = {
  profile: {
    get: (): ProfileData => readFile('profile', defaultProfile),
    update: (data: ProfileData): void => writeFile('profile', data),
  },
  details: {
    get: (): DetailsData => readFile('details', defaultDetails),
    update: (data: DetailsData): void => writeFile('details', data),
  },
  referenceImages: {
    get: (): ReferenceImageData[] => readFile('reference_images', defaultReferenceImages),
    update: (data: ReferenceImageData[]): void => writeFile('reference_images', data),
  },
  gallery: {
    get: (): GalleryData[] => readFile('gallery', defaultGallery),
    update: (data: GalleryData[]): void => writeFile('gallery', data),
  },
  diary: {
    get: (): DiaryData[] => readFile('diary', defaultDiary),
    update: (data: DiaryData[]): void => writeFile('diary', data),
  },
  friends: {
    get: (): FriendsData[] => readFile('friends', defaultFriends),
    update: (data: FriendsData[]): void => writeFile('friends', data),
  },
  messages: {
    get: (): MessageData[] => readFile('messages', defaultMessages),
    create: (data: Omit<MessageData, 'id' | 'created_at'>): MessageData => {
      const messages = readFile('messages', defaultMessages);
      const newMessage: MessageData = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toLocaleString('zh-CN'),
      };
      messages.push(newMessage);
      writeFile('messages', messages);
      return newMessage;
    },
    update: (id: string, data: Partial<MessageData>): void => {
      const messages = readFile('messages', defaultMessages);
      const index = messages.findIndex(m => m.id === id);
      if (index !== -1) {
        messages[index] = { ...messages[index], ...data };
        writeFile('messages', messages);
      }
    },
    delete: (id: string): void => {
      const messages = readFile('messages', defaultMessages);
      const filtered = messages.filter(m => m.id !== id);
      writeFile('messages', filtered);
    },
  },
  visitors: {
    get: (): VisitorsData => readFile('visitors', defaultVisitors),
    increment: (): number => {
      const visitors = readFile('visitors', defaultVisitors);
      visitors.count += 1;
      visitors.last_visit = new Date().toISOString();
      writeFile('visitors', visitors);
      return visitors.count;
    },
  },
  fursuit: {
    get: (): FursuitData => readFile('fursuit', defaultFursuit),
    update: (data: FursuitData): void => writeFile('fursuit', data),
  },
  commission: {
    get: (): CommissionData => readFile('commission', defaultCommission),
    update: (data: CommissionData): void => writeFile('commission', data),
  },
  extras: {
    get: (): ExtrasData => readFile('extras', defaultExtras),
    update: (data: ExtrasData): void => writeFile('extras', data),
  },
};
