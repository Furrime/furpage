import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Lock, Save, ArrowRight } from 'lucide-react';

interface ConfigData {
  site: {
    title: string;
    subtitle: string;
    favicon: string;
    background: string;
    backgroundType: 'color' | 'image' | 'gradient';
    backgroundColor: string;
    useProfileName: boolean;
  };
  profiles: {
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
  }[];
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
    carousel: { id: string; url: string; title: string }[];
    intro: string;
  };
  gallery: { id: string; category: string; sub_category: string; url: string; title: string }[];
  fursuit: { id: string; type: string; title: string; description: string; images: string[] }[];
  diary: { id: string; date: string; title: string; content: string; image: string }[];
  friends: { id: string; name: string; species: string; avatar: string; description: string }[];
  commission: { id: string; type: string; price: number; description: string; example: string }[];
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
  };
}

export default function AdminInit() {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [config, setConfig] = useState<ConfigData>({
    site: {
      title: '',
      subtitle: '',
      favicon: '',
      background: '',
      backgroundType: 'color',
      backgroundColor: '#FFF8F0',
      useProfileName: false,
    },
    profiles: [{
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
      created_at: new Date().toISOString(),
    }],
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
    commission: [],
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
    },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkInitStatus();
  }, []);

  const checkInitStatus = async () => {
    try {
      const response = await fetch('/api/admin/init-status');
      const data = await response.json();
      if (data.success && data.data.initialized) {
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Failed to check init status:', error);
    }
  };

  const handleSubmit = async () => {
    if (step === 1) {
      if (!password || password.length < 4) {
        setError('密码长度至少4位');
        return;
      }
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }
      setError('');
      setStep(2);
    } else {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, config }),
        });
        const data = await response.json();
        if (data.success) {
          navigate('/admin/login');
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('初始化失败，请重试');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (path: string, value: any) => {
    const keys = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(config)) as ConfigData;
    let current: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
  };

  const handleImageUpload = (path: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleInputChange(path, base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fur-cream p-4">
      <div className="glass-card w-full max-w-2xl p-8 rounded-3xl shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-fur-peach rounded-full mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">首次部署初始化</h2>
          <p className="text-gray-500 text-sm">设置登录密码并完成初始配置</p>
          
          <div className="flex justify-center gap-2 mt-4">
            <div className={`w-3 h-3 rounded-full transition-all ${step === 1 ? 'bg-fur-peach' : 'bg-gray-300'}`} />
            <div className={`w-3 h-3 rounded-full transition-all ${step === 2 ? 'bg-fur-peach' : 'bg-gray-300'}`} />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="p-4 bg-fur-peach/10 rounded-xl">
              <h3 className="font-medium text-fur-peach mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                设置登录密码
              </h3>
              <p className="text-sm text-gray-500">请设置一个安全的登录密码，用于登录管理后台</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-fur-pink/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-fur-peach/50 transition-all"
                placeholder="请输入登录密码（至少4位）"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-fur-pink/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-fur-peach/50 transition-all"
                placeholder="再次输入密码"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-fur-peach to-fur-softpink text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              下一步
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <div className="p-4 bg-fur-mint/10 rounded-xl">
              <h3 className="font-medium text-fur-mint mb-2">基本站点配置（可选）</h3>
              <p className="text-sm text-gray-500">您可以在这里设置站点的基本信息，也可以后续在管理后台中修改</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">站点标题</label>
                <input
                  type="text"
                  value={config.site.title}
                  onChange={(e) => handleInputChange('site.title', e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                  placeholder="站点标题"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">站点副标题</label>
                <input
                  type="text"
                  value={config.site.subtitle}
                  onChange={(e) => handleInputChange('site.subtitle', e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                  placeholder="站点副标题"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">兽设名称</label>
                <input
                  type="text"
                  value={config.profiles[0]?.name}
                  onChange={(e) => handleInputChange('profiles.0.name', e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                  placeholder="兽设名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">物种</label>
                <input
                  type="text"
                  value={config.profiles[0]?.species}
                  onChange={(e) => handleInputChange('profiles.0.species', e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-fur-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-fur-peach/50"
                  placeholder="物种"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">背景颜色</label>
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

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                上一步
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-fur-peach to-fur-softpink text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? '初始化中...' : '完成初始化'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
