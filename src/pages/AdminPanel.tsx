import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '@/store/adminStore';
import { LogOut, Save, Upload, Image, Type, ToggleLeft, ToggleRight, Palette, Settings, User, Camera, Heart, BookOpen, MessageCircle, DollarSign, Sparkles, Users, PenTool, Home, Shirt, Trash2, Plus, Lock, X, Music, Share2, Calendar, Download } from 'lucide-react';

interface CarouselItem {
  id: string;
  url: string;
  title: string;
}

interface GalleryItem {
  id: string;
  category: string;
  sub_category: string;
  url: string;
  title: string;
}

interface FursuitItem {
  id: string;
  type: string;
  title: string;
  description: string;
  images: string[];
}

interface DiaryItem {
  id: string;
  date: string;
  title: string;
  content: string;
  image: string;
}

interface FriendItem {
  id: string;
  name: string;
  species: string;
  avatar: string;
  description: string;
}

interface CommissionItem {
  id: string;
  type: string;
  price: number;
  description: string;
  example: string;
}

interface ProfileData {
  id: string;
  name: string;
  species: string;
  gender: string;
  age: number;
  height: number;
  fur_color: string;
  personality: string;
  likes: string[];
  dislikes: string[];
  bio: string;
  avatar: string;
  gallery: string[];
  habits: string;
  backstory: string;
  world_view: string;
  taboos: string;
  created_at: string;
}

interface ConfigData {
  site: {
    title: string;
    subtitle: string;
    favicon: string;
    background: string;
    backgroundType: 'color' | 'image' | 'gradient';
    backgroundColor: string;
    useProfileName: boolean;
    displayProfileId: string;
  };
  profiles: ProfileData[];
  activeProfileId: string;
  details: {
    paw_pad_color: string;
    tail_description: string;
    horns_description: string;
    wings_description: string;
    scars: string;
    special_marks: string;
    heterochromatic_fur: string;
  };
  home: {
    carousel: CarouselItem[];
    intro: string;
    music: {
      enabled: boolean;
      type: 'netease' | 'upload';
      neteaseId: string;
      audioUrl: string;
      title: string;
      artist: string;
    };
  };
  gallery: GalleryItem[];
  fursuit: FursuitItem[];
  diary: DiaryItem[];
  friends: FriendItem[];
  commission: CommissionItem[];
  extras: {
    social_links: { platform: string; url: string; icon: string }[];
    timeline: { date: string; event: string; description: string; image?: string }[];
    downloads: { name: string; type: string; url: string; size: string }[];
    mini_game: {
      questions: { question: string; options: string[]; answer: number }[];
      results: { score_range: [number, number]; title: string; description: string }[];
    };
  };
  features: {
    home: boolean;
    profile: boolean;
    gallery: boolean;
    fursuit: boolean;
    diary: boolean;
    friends: boolean;
    guestbook: boolean;
    commission: boolean;
    extras: boolean;
    qna: boolean;
    details: boolean;
  };
}

interface QnaQuestion {
  id: string;
  content: string;
  answer?: string;
  is_answered: boolean;
  created_at: string;
}

interface GuestbookMessage {
  id: string;
  username: string;
  content: string;
  created_at: string;
}

export default function AdminPanel() {
  const { isLoggedIn, logout } = useAdminStore();
  const navigate = useNavigate();
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [activeTab, setActiveTab] = useState('site');
  const [saving, setSaving] = useState(false);
  const [qnaQuestions, setQnaQuestions] = useState<QnaQuestion[]>([]);
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessage[]>([]);
  const [newMessageUsername, setNewMessageUsername] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }
    fetchConfig();
    fetchQna();
    fetchMessages();
  }, [isLoggedIn, navigate]);

  const fetchQna = async () => {
    try {
      const response = await fetch('/api/qna');
      const data = await response.json();
      if (data.success) {
        setQnaQuestions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch QNA:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      if (data.success) {
        setGuestbookMessages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const answerQuestion = async (id: string, answer: string) => {
    if (!answer?.trim()) return;
    try {
      const response = await fetch(`/api/qna/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answer.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        fetchQna();
        alert('回答成功！');
      }
    } catch (error) {
      alert('回答失败，请重试');
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('确定要删除这个问题吗？')) return;
    try {
      const response = await fetch(`/api/qna/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchQna();
        alert('删除成功！');
      }
    } catch (error) {
      alert('删除失败，请重试');
    }
  };

  const postMessage = async () => {
    if (!newMessageUsername.trim() || !newMessageContent.trim()) return;
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newMessageUsername.trim(),
          content: newMessageContent.trim(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNewMessageUsername('');
        setNewMessageContent('');
        fetchMessages();
        alert('留言发布成功！');
      }
    } catch (error) {
      alert('发布失败，请重试');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('确定要删除这条留言吗？')) return;
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchMessages();
        alert('删除成功！');
      }
    } catch (error) {
      alert('删除失败，请重试');
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    if (!oldPassword.trim()) {
      setPasswordError('请输入旧密码');
      return;
    }
    if (!newPassword.trim() || newPassword.length < 4) {
      setPasswordError('新密码长度至少4位');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('两次输入的密码不一致');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: oldPassword.trim(),
          newPassword: newPassword.trim(),
          confirmPassword: confirmPassword.trim(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('密码修改成功！请重新登录');
        setShowChangePassword(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        logout();
      } else {
        setPasswordError(data.message);
      }
    } catch (error) {
      setPasswordError('密码修改失败，请重试');
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/config');
      const data = await response.json();
      if (data.success) {
        const completeConfig = {
          site: {
            title: '',
            subtitle: '',
            favicon: '',
            background: '',
            backgroundType: 'color' as const,
            backgroundColor: '#FFF8F0',
            useProfileName: true,
            ...data.data.site,
          },
          profiles: (data.data.profiles || []) as ProfileData[],
          activeProfileId: data.data.activeProfileId || '',
          details: {
            paw_pad_color: '',
            tail_description: '',
            horns_description: '',
            wings_description: '',
            scars: '',
            special_marks: '',
            heterochromatic_fur: '',
            ...data.data.details,
          },
          home: {
            carousel: [] as CarouselItem[],
            intro: '',
            music: {
              enabled: false,
              type: 'netease' as const,
              neteaseId: '',
              audioUrl: '',
              title: '',
              artist: '',
            },
            ...data.data.home,
          },
          gallery: [] as GalleryItem[],
          fursuit: [] as FursuitItem[],
          diary: [] as DiaryItem[],
          friends: [] as FriendItem[],
          commission: [] as CommissionItem[],
          extras: {
            social_links: [],
            timeline: [],
            downloads: [],
            mini_game: { questions: [], results: [] },
            ...data.data.extras,
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
            extras: true,
            qna: true,
            details: true,
            ...data.data.features,
          },
        };
        setConfig(completeConfig);
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const response = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      if (data.success) {
        alert('配置保存成功！');
      }
    } catch (error) {
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (path: string, value: any) => {
    if (!config) return;
    const keys = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    let current: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
  };

  const handleImageUpload = async (path: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleInputChange(path, base64);
    };
    reader.readAsDataURL(file);
  };

  const handleToggle = (path: string) => {
    if (!config) return;
    const keys = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    let current: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    const key = keys[keys.length - 1];
    current[key] = !current[key];
    setConfig(newConfig);
  };

  const addCarouselItem = () => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.home.carousel.push({
      id: Date.now().toString(),
      url: '',
      title: '',
    });
    setConfig(newConfig);
  };

  const removeCarouselItem = (id: string) => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.home.carousel = newConfig.home.carousel.filter(item => item.id !== id);
    setConfig(newConfig);
  };

  const addGalleryItem = () => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.gallery.push({
      id: Date.now().toString(),
      category: '',
      sub_category: '',
      url: '',
      title: '',
    });
    setConfig(newConfig);
  };

  const removeGalleryItem = (id: string) => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.gallery = newConfig.gallery.filter(item => item.id !== id);
    setConfig(newConfig);
  };

  const addFursuitItem = () => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.fursuit.push({
      id: Date.now().toString(),
      type: '',
      title: '',
      description: '',
      images: [],
    });
    setConfig(newConfig);
  };

  const removeFursuitItem = (id: string) => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.fursuit = newConfig.fursuit.filter(item => item.id !== id);
    setConfig(newConfig);
  };

  const addFursuitImage = (itemId: string) => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    const item = newConfig.fursuit.find(i => i.id === itemId);
    if (item) {
      item.images.push('');
    }
    setConfig(newConfig);
  };

  const removeFursuitImage = (itemId: string, index: number) => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    const item = newConfig.fursuit.find(i => i.id === itemId);
    if (item) {
      item.images.splice(index, 1);
    }
    setConfig(newConfig);
  };

  const addDiaryItem = () => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.diary.push({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('zh-CN'),
      title: '',
      content: '',
      image: '',
    });
    setConfig(newConfig);
  };

  const removeDiaryItem = (id: string) => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.diary = newConfig.diary.filter(item => item.id !== id);
    setConfig(newConfig);
  };

  const addFriendItem = () => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.friends.push({
      id: Date.now().toString(),
      name: '',
      species: '',
      avatar: '',
      description: '',
    });
    setConfig(newConfig);
  };

  const removeFriendItem = (id: string) => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.friends = newConfig.friends.filter(item => item.id !== id);
    setConfig(newConfig);
  };

  const addCommissionItem = () => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.commission.push({
      id: Date.now().toString(),
      type: '',
      price: 0,
      description: '',
      example: '',
    });
    setConfig(newConfig);
  };

  const removeCommissionItem = (id: string) => {
    if (!config) return;
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    newConfig.commission = newConfig.commission.filter(item => item.id !== id);
    setConfig(newConfig);
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fur-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fur-peach border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">加载配置中...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'site', label: '站点设置', icon: Settings },
    { id: 'profile', label: '兽设档案', icon: User },
    { id: 'home', label: '首页配置', icon: Home },
    { id: 'gallery', label: '作品图库', icon: Image },
    { id: 'fursuit', label: '兽装专栏', icon: Shirt },
    { id: 'diary', label: '日常随笔', icon: BookOpen },
    { id: 'friends', label: '亲友墙', icon: Users },
    { id: 'commission', label: '约稿专区', icon: DollarSign },
    { id: 'qna', label: '问答管理', icon: MessageCircle },
    { id: 'guestbook', label: '留言管理', icon: PenTool },
    { id: 'features', label: '功能开关', icon: ToggleRight },
  ];

  return (
    <div className="min-h-screen bg-fur-cream flex flex-col">
      <header className="glass-card fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {config?.profiles?.find(p => p.id === config.activeProfileId)?.avatar || config?.profiles?.[0]?.avatar ? (
            <img
              src={config.profiles.find(p => p.id === config.activeProfileId)?.avatar || config.profiles[0]?.avatar}
              alt="头像"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 bg-fur-peach rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <h1 className="text-xl font-bold text-gray-800">管理后台</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="px-3 py-2 bg-fur-mint text-white font-medium rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
            title="返回首页"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">返回首页</span>
          </button>
          <button
            onClick={() => setShowChangePassword(true)}
            className="px-3 py-2 bg-fur-lavender text-white font-medium rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
            title="修改密码"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">修改密码</span>
          </button>
          <button
            onClick={logout}
            className="px-3 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
            title="退出登录"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">退出登录</span>
          </button>
        </div>
      </header>

      <div className="pt-24 pb-24 max-w-7xl mx-auto p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-fur-peach text-white shadow-md'
                    : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="glass-card rounded-2xl p-6">
          {activeTab === 'site' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-fur-peach" />
                站点基础设置
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Type className="w-4 h-4" />
                    站点标题
                  </label>
                  <input
                    type="text"
                    value={config.site.title}
                    onChange={(e) => handleInputChange('site.title', e.target.value)}
                    className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Type className="w-4 h-4" />
                    站点副标题
                  </label>
                  <input
                    type="text"
                    value={config.site.subtitle}
                    onChange={(e) => handleInputChange('site.subtitle', e.target.value)}
                    className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Palette className="w-4 h-4" />
                    背景类型
                  </label>
                  <select
                    value={config.site.backgroundType}
                    onChange={(e) => handleInputChange('site.backgroundType', e.target.value)}
                    className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                  >
                    <option value="color">纯色</option>
                    <option value="image">图片</option>
                    <option value="gradient">渐变</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Palette className="w-4 h-4" />
                    背景颜色
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.site.backgroundColor}
                      onChange={(e) => handleInputChange('site.backgroundColor', e.target.value)}
                      className="w-12 h-10 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={config.site.backgroundColor}
                      onChange={(e) => handleInputChange('site.backgroundColor', e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <ToggleRight className="w-4 h-4" />
                    网站标题使用兽设名字
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">关闭（使用站点标题）</span>
                    <button
                      onClick={() => handleToggle('site.useProfileName')}
                      className={`w-14 h-7 rounded-full transition-colors ${
                        config.site.useProfileName ? 'bg-fur-peach' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        config.site.useProfileName ? 'translate-x-8' : 'translate-x-1'
                      }`}></span>
                    </button>
                    <span className="text-sm text-gray-500">开启（使用兽设名）</span>
                  </div>
                </div>

                {config.profiles.length > 1 && (
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      显示兽设（多兽设时指定）
                    </label>
                    <select
                      value={config.site.displayProfileId}
                      onChange={(e) => handleInputChange('site.displayProfileId', e.target.value)}
                      className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                    >
                      <option value="">默认（使用活动兽设）</option>
                      {config.profiles.map((profile: ProfileData) => (
                        <option key={profile.id} value={profile.id}>
                          {profile.name || '未命名'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Image className="w-4 h-4" />
                    背景图片
                  </label>
                  <div className="border-2 border-dashed border-fur-pink/30 rounded-lg p-4 text-center hover:border-fur-peach/50 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('site.background', e)}
                      className="hidden"
                      id="bg-upload"
                    />
                    <label htmlFor="bg-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-fur-peach mx-auto mb-2" />
                      <p className="text-sm text-gray-500">点击上传背景图片</p>
                    </label>
                    {config.site.background && (
                      <img
                        src={config.site.background}
                        alt="背景预览"
                        className="mt-4 max-h-40 mx-auto rounded-lg object-contain"
                      />
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Camera className="w-4 h-4" />
                    网站图标
                  </label>
                  <div className="border-2 border-dashed border-fur-pink/30 rounded-lg p-4 text-center hover:border-fur-peach/50 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('site.favicon', e)}
                      className="hidden"
                      id="favicon-upload"
                    />
                    <label htmlFor="favicon-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-fur-peach mx-auto mb-2" />
                      <p className="text-sm text-gray-500">点击上传网站图标</p>
                    </label>
                    {config.site.favicon && (
                      <img
                        src={config.site.favicon}
                        alt="图标预览"
                        className="mt-4 w-16 h-16 mx-auto rounded-lg object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-fur-peach" />
                  兽设档案配置
                </h2>
                <button
                  onClick={() => {
                    const newProfile: ProfileData = {
                      id: Date.now().toString(),
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
                      created_at: new Date().toISOString().split('T')[0],
                    };
                    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                    newConfig.profiles.push(newProfile);
                    if (!newConfig.activeProfileId) {
                      newConfig.activeProfileId = newProfile.id;
                    }
                    setConfig(newConfig);
                  }}
                  className="px-4 py-2 bg-fur-peach text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  添加兽设
                </button>
              </div>

              {config.profiles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">还没有兽设，点击上方按钮添加</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {config.profiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                          newConfig.activeProfileId = p.id;
                          setConfig(newConfig);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                          config.activeProfileId === p.id
                            ? 'bg-fur-peach text-white shadow-lg'
                            : 'bg-white/50 text-gray-600 hover:bg-fur-peach/20'
                        }`}
                      >
                        {p.avatar ? (
                          <img src={p.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 bg-fur-lightbrown rounded-full flex items-center justify-center text-xs">
                            {p.name?.[0] || '?'}
                          </div>
                        )}
                        <span>{p.name || '未命名'}</span>
                        {config.activeProfileId === p.id && (
                          <span className="text-xs">✓</span>
                        )}
                        {config.profiles.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles = newConfig.profiles.filter(profile => profile.id !== p.id);
                              if (newConfig.activeProfileId === p.id) {
                                newConfig.activeProfileId = newConfig.profiles[0]?.id || '';
                              }
                              setConfig(newConfig);
                            }}
                            className="ml-1 text-red-400 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const activeProfile = config.profiles.find(p => p.id === config.activeProfileId) || config.profiles[0];
                    if (!activeProfile) return null;
                    const profileIndex = config.profiles.indexOf(activeProfile);

                    return (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            名字
                          </label>
                          <input
                            type="text"
                            value={activeProfile.name}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].name = e.target.value;
                              setConfig(newConfig);
                            }}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          />
                        </div>
                        
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            物种
                          </label>
                          <input
                            type="text"
                            value={activeProfile.species}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].species = e.target.value;
                              setConfig(newConfig);
                            }}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          />
                        </div>
                        
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            性别
                          </label>
                          <input
                            type="text"
                            value={activeProfile.gender}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].gender = e.target.value;
                              setConfig(newConfig);
                            }}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          />
                        </div>
                        
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            年龄
                          </label>
                          <input
                            type="number"
                            value={activeProfile.age}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].age = parseInt(e.target.value) || 0;
                              setConfig(newConfig);
                            }}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          />
                        </div>
                        
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            身高 (cm)
                          </label>
                          <input
                            type="number"
                            value={activeProfile.height}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].height = parseInt(e.target.value) || 0;
                              setConfig(newConfig);
                            }}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          />
                        </div>
                        
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Palette className="w-4 h-4" />
                            毛色
                          </label>
                          <input
                            type="text"
                            value={activeProfile.fur_color}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].fur_color = e.target.value;
                              setConfig(newConfig);
                            }}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            性格描述
                          </label>
                          <textarea
                            value={activeProfile.personality}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].personality = e.target.value;
                              setConfig(newConfig);
                            }}
                            rows={3}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                            placeholder="这只兽很懒，还没有填写性格描述~"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            个人简介
                          </label>
                          <textarea
                            value={activeProfile.bio}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].bio = e.target.value;
                              setConfig(newConfig);
                            }}
                            rows={4}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                            placeholder="这只兽很懒，还没有填写个人简介~"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Heart className="w-4 h-4" />
                            喜好（用逗号分隔）
                          </label>
                          <input
                            type="text"
                            value={activeProfile.likes.join(', ')}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].likes = e.target.value.split(/[,，]/).map(s => s.trim()).filter(s => s);
                              setConfig(newConfig);
                            }}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                            placeholder="例如：画画, 游戏, 音乐"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Heart className="w-4 h-4" />
                            讨厌（用逗号分隔）
                          </label>
                          <input
                            type="text"
                            value={activeProfile.dislikes.join(', ')}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].dislikes = e.target.value.split(/[,，]/).map(s => s.trim()).filter(s => s);
                              setConfig(newConfig);
                            }}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                            placeholder="例如：孤独, 雨天"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Camera className="w-4 h-4" />
                            头像
                          </label>
                          <div className="border-2 border-dashed border-fur-pink/30 rounded-lg p-4 text-center hover:border-fur-peach/50 transition-all">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                                    newConfig.profiles[profileIndex].avatar = ev.target?.result as string;
                                    setConfig(newConfig);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                              id={`avatar-upload-${activeProfile.id}`}
                            />
                            <label htmlFor={`avatar-upload-${activeProfile.id}`} className="cursor-pointer">
                              <Upload className="w-8 h-8 text-fur-peach mx-auto mb-2" />
                              <p className="text-sm text-gray-500">点击上传头像</p>
                            </label>
                            {activeProfile.avatar && (
                              <img
                                src={activeProfile.avatar}
                                alt="头像预览"
                                className="mt-4 w-24 h-24 mx-auto rounded-full object-cover"
                              />
                            )}
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Image className="w-4 h-4" />
                            参考图集
                          </label>
                          <div className="space-y-4">
                            {activeProfile.gallery.map((img, imgIndex) => (
                              <div key={imgIndex} className="flex items-center gap-4">
                                <div className="flex-1 border-2 border-dashed border-fur-pink/30 rounded-lg p-3 text-center hover:border-fur-peach/50 transition-all">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                          const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                                          newConfig.profiles[profileIndex].gallery[imgIndex] = ev.target?.result as string;
                                          setConfig(newConfig);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="hidden"
                                    id={`profile-gallery-${activeProfile.id}-${imgIndex}`}
                                  />
                                  <label htmlFor={`profile-gallery-${activeProfile.id}-${imgIndex}`} className="cursor-pointer">
                                    {img ? (
                                      <img src={img} alt={`图片${imgIndex+1}`} className="max-h-24 mx-auto rounded-lg object-contain" />
                                    ) : (
                                      <>
                                        <Upload className="w-6 h-6 text-fur-peach mx-auto mb-1" />
                                        <p className="text-sm text-gray-500">点击上传图片</p>
                                      </>
                                    )}
                                  </label>
                                </div>
                                <button
                                  onClick={() => {
                                    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                                    newConfig.profiles[profileIndex].gallery.splice(imgIndex, 1);
                                    setConfig(newConfig);
                                  }}
                                  className="p-2 text-red-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                                newConfig.profiles[profileIndex].gallery.push('');
                                setConfig(newConfig);
                              }}
                              className="w-full py-3 border-2 border-dashed border-fur-pink/30 rounded-lg text-fur-peach hover:border-fur-peach/50 transition-all flex items-center justify-center gap-2"
                            >
                              <Plus className="w-5 h-5" />
                              添加图片
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            习惯
                          </label>
                          <textarea
                            value={activeProfile.habits}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].habits = e.target.value;
                              setConfig(newConfig);
                            }}
                            rows={2}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                            placeholder="这只兽很懒，还没有填写~"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            背景故事
                          </label>
                          <textarea
                            value={activeProfile.backstory}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].backstory = e.target.value;
                              setConfig(newConfig);
                            }}
                            rows={3}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                            placeholder="这只兽很懒，还没有填写~"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            世界观
                          </label>
                          <textarea
                            value={activeProfile.world_view}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].world_view = e.target.value;
                              setConfig(newConfig);
                            }}
                            rows={3}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                            placeholder="这只兽很懒，还没有填写~"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Type className="w-4 h-4" />
                            禁忌
                          </label>
                          <textarea
                            value={activeProfile.taboos}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.profiles[profileIndex].taboos = e.target.value;
                              setConfig(newConfig);
                            }}
                            rows={2}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                            placeholder="这只兽很懒，还没有填写~"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-fur-lightbrown" />
                            细节设定
                          </h3>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">爪垫颜色</label>
                              <input
                                type="text"
                                value={config.details.paw_pad_color}
                                onChange={(e) => handleInputChange('details.paw_pad_color', e.target.value)}
                                className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                                placeholder="例如：粉色"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">尾巴描述</label>
                              <input
                                type="text"
                                value={config.details.tail_description}
                                onChange={(e) => handleInputChange('details.tail_description', e.target.value)}
                                className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                                placeholder="例如：蓬松的大尾巴"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">角描述</label>
                              <input
                                type="text"
                                value={config.details.horns_description}
                                onChange={(e) => handleInputChange('details.horns_description', e.target.value)}
                                className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                                placeholder="例如：无"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">翅膀描述</label>
                              <input
                                type="text"
                                value={config.details.wings_description}
                                onChange={(e) => handleInputChange('details.wings_description', e.target.value)}
                                className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                                placeholder="例如：无"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">伤疤描述</label>
                              <input
                                type="text"
                                value={config.details.scars}
                                onChange={(e) => handleInputChange('details.scars', e.target.value)}
                                className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                                placeholder="例如：无"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">特殊标记</label>
                              <input
                                type="text"
                                value={config.details.special_marks}
                                onChange={(e) => handleInputChange('details.special_marks', e.target.value)}
                                className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                                placeholder="例如：左耳有一个小缺口"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}

          {activeTab === 'home' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Home className="w-5 h-5 text-fur-peach" />
                首页配置
              </h2>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Type className="w-4 h-4" />
                  首页介绍
                </label>
                <textarea
                  value={config.home.intro}
                  onChange={(e) => handleInputChange('home.intro', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                  placeholder="这只兽很懒，还没有填写首页介绍~"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Image className="w-4 h-4" />
                    轮播图片
                  </label>
                  <button
                    onClick={addCarouselItem}
                    className="px-4 py-1 bg-fur-peach text-white text-sm rounded-lg hover:opacity-90 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    添加
                  </button>
                </div>
                <div className="space-y-4">
                  {config.home.carousel.map((item, index) => (
                    <div key={item.id} className="p-4 bg-white/30 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">轮播图 {index + 1}</span>
                        <button
                          onClick={() => removeCarouselItem(item.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-sm text-gray-600 mb-1 block">图片</label>
                          <div className="border-2 border-dashed border-fur-pink/30 rounded-lg p-3 text-center hover:border-fur-peach/50 transition-all">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                                    newConfig.home.carousel[index].url = ev.target?.result as string;
                                    setConfig(newConfig);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                              id={`carousel-img-${index}`}
                            />
                            <label htmlFor={`carousel-img-${index}`} className="cursor-pointer">
                              {item.url ? (
                                <img src={item.url} alt={`轮播图${index+1}`} className="max-h-32 mx-auto rounded-lg object-contain" />
                              ) : (
                                <>
                                  <Upload className="w-6 h-6 text-fur-peach mx-auto mb-1" />
                                  <p className="text-sm text-gray-500">点击上传图片</p>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">标题</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                              newConfig.home.carousel[index].title = e.target.value;
                              setConfig(newConfig);
                            }}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                            placeholder="图片标题"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Image className="w-5 h-5 text-fur-peach" />
                作品图库配置
              </h2>
              
              <button
                onClick={addGalleryItem}
                className="w-full py-3 border-2 border-dashed border-fur-pink/30 rounded-lg text-fur-peach hover:border-fur-peach/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加作品
              </button>
              
              <div className="space-y-4">
                {config.gallery.map((item) => (
                  <div key={item.id} className="p-4 bg-white/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">{item.title || '未命名作品'}</span>
                      <button
                        onClick={() => removeGalleryItem(item.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-600 mb-1 block">图片</label>
                        <div className="border-2 border-dashed border-fur-pink/30 rounded-lg p-3 text-center hover:border-fur-peach/50 transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                                  const galleryItem = newConfig.gallery.find(i => i.id === item.id);
                                  if (galleryItem) galleryItem.url = ev.target?.result as string;
                                  setConfig(newConfig);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id={`gallery-img-${item.id}`}
                          />
                          <label htmlFor={`gallery-img-${item.id}`} className="cursor-pointer">
                            {item.url ? (
                              <img src={item.url} alt={item.title} className="max-h-32 mx-auto rounded-lg object-contain" />
                            ) : (
                              <>
                                <Upload className="w-6 h-6 text-fur-peach mx-auto mb-1" />
                                <p className="text-sm text-gray-500">点击上传图片</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">标题</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const galleryItem = newConfig.gallery.find(i => i.id === item.id);
                            if (galleryItem) galleryItem.title = e.target.value;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          placeholder="作品标题"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">分类</label>
                        <select
                          value={item.category}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const galleryItem = newConfig.gallery.find(i => i.id === item.id);
                            if (galleryItem) galleryItem.category = e.target.value;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                        >
                          <option value="">选择分类</option>
                          <option value="oc_illustration">OC插画</option>
                          <option value="fursuit_photo">兽装实拍</option>
                          <option value="emoji">表情包</option>
                          <option value="fanart">同人作品</option>
                          <option value="sketch">手绘草稿</option>
                        </select>
                      </div>
                      <div className="md:col-span-4">
                        <label className="text-sm text-gray-600 mb-1 block">子分类</label>
                        <input
                          type="text"
                          value={item.sub_category}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const galleryItem = newConfig.gallery.find(i => i.id === item.id);
                            if (galleryItem) galleryItem.sub_category = e.target.value;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          placeholder="例如：commission, personal, gift"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fursuit' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Shirt className="w-5 h-5 text-fur-peach" />
                兽装专栏配置
              </h2>
              
              <button
                onClick={addFursuitItem}
                className="w-full py-3 border-2 border-dashed border-fur-pink/30 rounded-lg text-fur-peach hover:border-fur-peach/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加兽装内容
              </button>
              
              <div className="space-y-4">
                {config.fursuit.map((item) => (
                  <div key={item.id} className="p-4 bg-white/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">{item.title || '未命名内容'}</span>
                      <button
                        onClick={() => removeFursuitItem(item.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">类型</label>
                        <select
                          value={item.type}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const fursuitItem = newConfig.fursuit.find(i => i.id === item.id);
                            if (fursuitItem) fursuitItem.type = e.target.value;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                        >
                          <option value="">选择类型</option>
                          <option value="making">制作记录</option>
                          <option value="outfit">穿搭合集</option>
                          <option value="event">线下活动</option>
                          <option value="care">保养指南</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">标题</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const fursuitItem = newConfig.fursuit.find(i => i.id === item.id);
                            if (fursuitItem) fursuitItem.title = e.target.value;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          placeholder="内容标题"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">描述</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => {
                          const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                          const fursuitItem = newConfig.fursuit.find(i => i.id === item.id);
                          if (fursuitItem) fursuitItem.description = e.target.value;
                          setConfig(newConfig);
                        }}
                        rows={3}
                        className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                        placeholder="这只兽很懒，还没有填写描述~"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-600">图片</label>
                        <button
                          onClick={() => addFursuitImage(item.id)}
                          className="px-3 py-1 bg-fur-peach text-white text-sm rounded-lg hover:opacity-90 transition-all flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          添加图片
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {item.images.map((img, index) => (
                          <div key={index} className="relative">
                            <div className="border-2 border-dashed border-fur-pink/30 rounded-lg p-2 text-center hover:border-fur-peach/50 transition-all">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                                      const fursuitItem = newConfig.fursuit.find(i => i.id === item.id);
                                      if (fursuitItem) fursuitItem.images[index] = ev.target?.result as string;
                                      setConfig(newConfig);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                                id={`fursuit-img-${item.id}-${index}`}
                              />
                              <label htmlFor={`fursuit-img-${item.id}-${index}`} className="cursor-pointer">
                                {img ? (
                                  <img src={img} alt={`图片${index+1}`} className="max-h-24 mx-auto rounded-lg object-contain" />
                                ) : (
                                  <>
                                    <Upload className="w-5 h-5 text-fur-peach mx-auto mb-1" />
                                    <p className="text-xs text-gray-500">点击上传</p>
                                  </>
                                )}
                              </label>
                            </div>
                            <button
                              onClick={() => removeFursuitImage(item.id, index)}
                              className="absolute -top-1 -right-1 p-1 bg-red-400 text-white rounded-full hover:bg-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'diary' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-fur-peach" />
                日常随笔配置
              </h2>
              
              <button
                onClick={addDiaryItem}
                className="w-full py-3 border-2 border-dashed border-fur-pink/30 rounded-lg text-fur-peach hover:border-fur-peach/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加随笔
              </button>
              
              <div className="space-y-4">
                {config.diary.map((item) => (
                  <div key={item.id} className="p-4 bg-white/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">{item.title || '未命名随笔'}</span>
                      <button
                        onClick={() => removeDiaryItem(item.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">日期</label>
                        <input
                          type="text"
                          value={item.date}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const diaryItem = newConfig.diary.find(i => i.id === item.id);
                            if (diaryItem) diaryItem.date = e.target.value;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          placeholder="YYYY-MM-DD"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">标题</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const diaryItem = newConfig.diary.find(i => i.id === item.id);
                            if (diaryItem) diaryItem.title = e.target.value;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          placeholder="随笔标题"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">图片</label>
                        <div className="border-2 border-dashed border-fur-pink/30 rounded-lg p-2 text-center hover:border-fur-peach/50 transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                                  const diaryItem = newConfig.diary.find(i => i.id === item.id);
                                  if (diaryItem) diaryItem.image = ev.target?.result as string;
                                  setConfig(newConfig);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id={`diary-img-${item.id}`}
                          />
                          <label htmlFor={`diary-img-${item.id}`} className="cursor-pointer">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="max-h-16 mx-auto rounded-lg object-contain" />
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-fur-peach mx-auto mb-1" />
                                <p className="text-xs text-gray-500">点击上传</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">内容</label>
                      <textarea
                        value={item.content}
                        onChange={(e) => {
                          const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                          const diaryItem = newConfig.diary.find(i => i.id === item.id);
                          if (diaryItem) diaryItem.content = e.target.value;
                          setConfig(newConfig);
                        }}
                        rows={4}
                        className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                        placeholder="这只兽很懒，还没有写内容~"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-fur-peach" />
                亲友墙配置
              </h2>
              
              <button
                onClick={addFriendItem}
                className="w-full py-3 border-2 border-dashed border-fur-pink/30 rounded-lg text-fur-peach hover:border-fur-peach/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加亲友
              </button>
              
              <div className="space-y-4">
                {config.friends.map((item) => (
                  <div key={item.id} className="p-4 bg-white/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">{item.name || '未命名亲友'}</span>
                      <button
                        onClick={() => removeFriendItem(item.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">头像</label>
                        <div className="border-2 border-dashed border-fur-pink/30 rounded-lg p-2 text-center hover:border-fur-peach/50 transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                                  const friendItem = newConfig.friends.find(i => i.id === item.id);
                                  if (friendItem) friendItem.avatar = ev.target?.result as string;
                                  setConfig(newConfig);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id={`friend-avatar-${item.id}`}
                          />
                          <label htmlFor={`friend-avatar-${item.id}`} className="cursor-pointer">
                            {item.avatar ? (
                              <img src={item.avatar} alt={item.name} className="w-16 h-16 mx-auto rounded-full object-cover" />
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-fur-peach mx-auto mb-1" />
                                <p className="text-xs text-gray-500">点击上传</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">名字</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const friendItem = newConfig.friends.find(i => i.id === item.id);
                            if (friendItem) friendItem.name = e.target.value;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          placeholder="名字"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">物种</label>
                        <input
                          type="text"
                          value={item.species}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const friendItem = newConfig.friends.find(i => i.id === item.id);
                            if (friendItem) friendItem.species = e.target.value;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          placeholder="物种"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="text-sm text-gray-600 mb-1 block">描述</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const friendItem = newConfig.friends.find(i => i.id === item.id);
                            if (friendItem) friendItem.description = e.target.value;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          placeholder="这只兽很懒，还没有填写描述~"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'commission' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-fur-peach" />
                约稿专区配置
              </h2>
              
              <button
                onClick={addCommissionItem}
                className="w-full py-3 border-2 border-dashed border-fur-pink/30 rounded-lg text-fur-peach hover:border-fur-peach/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加约稿项目
              </button>
              
              <div className="space-y-4">
                {config.commission.map((item) => (
                  <div key={item.id} className="p-4 bg-white/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">{item.type || '未命名项目'}</span>
                      <button
                        onClick={() => removeCommissionItem(item.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">类型</label>
                        <input
                          type="text"
                          value={item.type}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const commissionItem = newConfig.commission.find(i => i.id === item.id);
                            if (commissionItem) commissionItem.type = e.target.value;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          placeholder="例如：头像、半身、全身"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">价格</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const commissionItem = newConfig.commission.find(i => i.id === item.id);
                            if (commissionItem) commissionItem.price = parseInt(e.target.value) || 0;
                            setConfig(newConfig);
                          }}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                          placeholder="0"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-600 mb-1 block">例图</label>
                        <div className="border-2 border-dashed border-fur-pink/30 rounded-lg p-2 text-center hover:border-fur-peach/50 transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                                  const commissionItem = newConfig.commission.find(i => i.id === item.id);
                                  if (commissionItem) commissionItem.example = ev.target?.result as string;
                                  setConfig(newConfig);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id={`commission-img-${item.id}`}
                          />
                          <label htmlFor={`commission-img-${item.id}`} className="cursor-pointer">
                            {item.example ? (
                              <img src={item.example} alt={item.type} className="max-h-20 mx-auto rounded-lg object-contain" />
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-fur-peach mx-auto mb-1" />
                                <p className="text-xs text-gray-500">点击上传例图</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                      <div className="md:col-span-4">
                        <label className="text-sm text-gray-600 mb-1 block">描述</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
                            const commissionItem = newConfig.commission.find(i => i.id === item.id);
                            if (commissionItem) commissionItem.description = e.target.value;
                            setConfig(newConfig);
                          }}
                          rows={3}
                          className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                          placeholder="这只兽很懒，还没有填写描述~"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          

          {activeTab === 'features' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ToggleRight className="w-5 h-5 text-fur-peach" />
                功能开关
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: 'home', label: '首页', icon: Home },
                  { key: 'profile', label: '兽设档案', icon: User },
                  { key: 'gallery', label: '作品图库', icon: Image },
                  { key: 'fursuit', label: '兽装专栏', icon: Shirt },
                  { key: 'diary', label: '日常随笔', icon: BookOpen },
                  { key: 'friends', label: '亲友墙', icon: Users },
                  { key: 'guestbook', label: '留言板', icon: MessageCircle },
                  { key: 'commission', label: '约稿专区', icon: DollarSign },
                  { key: 'extras', label: '小游戏', icon: Sparkles },
                  { key: 'qna', label: '问答', icon: PenTool },
                  { key: 'details', label: '细节设定', icon: Camera },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.key}
                      className="flex items-center justify-between p-4 bg-white/30 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-fur-peach/30 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-fur-peach" />
                        </div>
                        <span className="font-medium text-gray-700">{feature.label}</span>
                      </div>
                      <button
                        onClick={() => handleToggle(`features.${feature.key}`)}
                        className={`w-12 h-6 rounded-full transition-all ${
                          config?.features?.[feature.key as keyof typeof config.features]
                            ? 'bg-fur-mint'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${
                            config?.features?.[feature.key as keyof typeof config.features]
                              ? 'translate-x-6'
                              : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'qna' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-fur-peach" />
                问答管理
              </h2>
              
              <div className="space-y-4">
                {qnaQuestions.length === 0 ? (
                  <div className="text-center py-8 bg-white/30 rounded-xl">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">还没有问答，快来提问吧~</p>
                  </div>
                ) : (
                  qnaQuestions.map((item) => (
                    <div key={item.id} className="p-4 bg-white/30 rounded-xl space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">{item.content}</p>
                          <p className="text-gray-400 text-xs mt-1">{item.created_at}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.is_answered 
                            ? 'bg-fur-mint/30 text-green-600' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {item.is_answered ? '已回答' : '待回答'}
                        </span>
                      </div>
                      
                      {!item.is_answered && (
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600 mb-1 block">回答内容</label>
                          <textarea
                            value={item.answer || ''}
                            onChange={(e) => {
                              setQnaQuestions(qnaQuestions.map(q => 
                                q.id === item.id ? { ...q, answer: e.target.value } : q
                              ));
                            }}
                            rows={3}
                            className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                            placeholder="输入你的回答..."
                          />
                          <button
                            onClick={() => answerQuestion(item.id, item.answer)}
                            disabled={!item.answer?.trim()}
                            className="px-4 py-2 bg-fur-mint text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            提交回答
                          </button>
                        </div>
                      )}
                      
                      {item.is_answered && item.answer && (
                        <div className="p-3 bg-fur-lavender/30 rounded-lg border-l-4 border-fur-graypurple">
                          <p className="text-gray-700">{item.answer}</p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => deleteQuestion(item.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'guestbook' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-fur-peach" />
                留言管理
              </h2>
              
              <div className="p-4 bg-white/30 rounded-xl">
                <h3 className="text-sm font-medium text-gray-700 mb-3">发布新留言</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">昵称</label>
                    <input
                      type="text"
                      value={newMessageUsername}
                      onChange={(e) => setNewMessageUsername(e.target.value)}
                      className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                      placeholder="输入昵称"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">内容</label>
                    <textarea
                      value={newMessageContent}
                      onChange={(e) => setNewMessageContent(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                      placeholder="输入留言内容..."
                    />
                  </div>
                </div>
                <button
                  onClick={postMessage}
                  disabled={!newMessageUsername.trim() || !newMessageContent.trim()}
                  className="mt-4 px-6 py-2 bg-fur-peach text-white font-medium rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  发布留言
                </button>
              </div>
              
              <div className="space-y-4">
                {guestbookMessages.length === 0 ? (
                  <div className="text-center py-8 bg-white/30 rounded-xl">
                    <PenTool className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">还没有留言，快来发布第一条留言吧~</p>
                  </div>
                ) : (
                  guestbookMessages.map((item) => (
                    <div key={item.id} className="p-4 bg-white/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-fur-peach/30 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-fur-peach" />
                          </div>
                          <span className="font-medium text-gray-700">{item.username}</span>
                        </div>
                        <button
                          onClick={() => deleteMessage(item.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-600">{item.content}</p>
                      <p className="text-gray-400 text-xs">{item.created_at}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        <footer className="fixed bottom-0 left-0 right-0 glass-card px-6 py-4 flex items-center justify-center shadow-lg z-50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-fur-peach to-fur-softpink text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg"
          >
            <Save className="w-5 h-5" />
            {saving ? '保存中...' : '保存配置'}
          </button>
        </footer>
      </div>

      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-fur-lavender" />
                修改密码
              </h3>
              <button
                onClick={() => setShowChangePassword(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">旧密码</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                  placeholder="请输入当前密码"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                  placeholder="请输入新密码（至少4位）"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                  placeholder="再次输入新密码"
                />
              </div>
              
              {passwordError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {passwordError}
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:opacity-90 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 py-2 bg-fur-lavender text-white font-medium rounded-lg hover:opacity-90 transition-all"
                >
                  确认修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}