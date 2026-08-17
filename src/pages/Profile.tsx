import { useState, useEffect } from 'react';
import { Download, Heart, Star, Shield, Camera, FileImage, ChevronRight, X } from 'lucide-react';
import { useProfile } from '../App';

interface ProfileItem {
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
  habits: string;
  backstory: string;
  world_view: string;
  taboos: string;
  created_at: string;
  avatar?: string;
  bio?: string;
  gallery?: string[];
}

interface DetailsData {
  paw_pad_color: string;
  tail_description: string;
  horns_description: string;
  wings_description: string;
  scars: string;
  special_marks: string;
  heterochromatic_fur: string;
}

export default function Profile() {
  const [details, setDetails] = useState<DetailsData | null>(null);
  const [features, setFeatures] = useState<{ details: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { profiles, activeProfileId, selectedProfileId, setSelectedProfileId, getActiveProfile } = useProfile();

  useEffect(() => {
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          if (res.data.details) {
            setDetails(res.data.details);
          }
          if (res.data.features) {
            setFeatures(res.data.features);
          }
        }
      });
  }, []);

  if (!profiles || profiles.length === 0) {
    return (
      <div className="min-h-screen bg-fur-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fur-peach border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  const selectedProfile = getActiveProfile();

  const tabs = [
    { id: 'basic', label: '基础信息' },
    ...(features?.details !== false ? [{ id: 'details', label: '细节设定' }] : []),
    { id: 'personality', label: '性格喜好' },
    { id: 'worldview', label: '世界观' },
    { id: 'references', label: '参考图集' },
  ];

  const getDateText = () => {
    const today = new Date();
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const dayOfWeek = days[today.getDay()];
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    
    if (today.getDay() === 5) {
      return `${dateStr} 星期${dayOfWeek} 🦊 毛五快乐！`;
    }
    return `${dateStr} 星期${dayOfWeek}`;
  };

  if (!selectedProfile) {
    return (
      <div className="min-h-screen bg-fur-cream flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4">🦊</span>
          <p className="text-gray-500">还没有兽设，快去创建一个吧~</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fur-cream pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">兽设档案</h1>
          <p className="text-gray-500 text-sm">{getDateText()}</p>
        </div>

        <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-bold mb-4 text-gray-700">🐾 我的兽设</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => setSelectedProfileId(profiles.length === 1 ? null : profile.id)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedProfileId === profile.id || (!selectedProfileId && profile.id === activeProfileId)
                      ? 'border-fur-peach bg-fur-peach/10 shadow-lg'
                      : 'border-fur-beige/50 bg-white/50 hover:border-fur-pink hover:shadow-md'
                  }`}
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-fur-lightbrown to-fur-peach flex items-center justify-center">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">🦊</span>
                    )}
                  </div>
                  <h4 className="font-bold text-center text-gray-800">{profile.name || '未命名'}</h4>
                  <p className="text-xs text-center text-gray-500">{profile.species || '未知物种'}</p>
                  {profiles.length > 1 && (
                    <div className="flex items-center justify-center mt-2">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {selectedProfile.avatar ? (
                <img
                  src={selectedProfile.avatar}
                  alt={selectedProfile.name}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover shadow-xl border-4 border-white"
                />
              ) : (
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl bg-gradient-to-br from-fur-lightbrown to-fur-peach flex items-center justify-center shadow-xl border-4 border-white">
                  <span className="text-6xl">🦊</span>
                </div>
              )}
              <div className="absolute -top-3 -right-3 bg-gradient-to-br from-fur-lightbrown to-fur-peach rounded-full p-2 shadow-lg">
                <span className="text-xl">🦊</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">{selectedProfile.name || '这只兽很懒，还没有填写名字~'}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {selectedProfile.species && <span className="px-3 py-1 bg-fur-beige/50 rounded-full text-sm">{selectedProfile.species}</span>}
                {selectedProfile.gender && <span className="px-3 py-1 bg-fur-peach/50 rounded-full text-sm">{selectedProfile.gender}</span>}
                {selectedProfile.age && <span className="px-3 py-1 bg-fur-sky/50 rounded-full text-sm">{selectedProfile.age}岁</span>}
                {selectedProfile.height && <span className="px-3 py-1 bg-fur-lavender/50 rounded-full text-sm">{selectedProfile.height}cm</span>}
                {!selectedProfile.species && !selectedProfile.gender && !selectedProfile.age && !selectedProfile.height && (
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-500">这只兽很懒，还没有填写基本信息~</span>
                )}
              </div>
              <p className="text-gray-600">{selectedProfile.personality || '这只兽很懒，还没有填写性格描述~'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-fur-lightbrown to-fur-peach text-white shadow-md'
                  : 'bg-white/70 text-gray-600 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'basic' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileImage className="text-fur-lightbrown" />
              基础信息
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-fur-beige/30 rounded-xl p-4">
                <h4 className="font-medium mb-2 text-fur-lightbrown">毛色</h4>
                <p>{selectedProfile.fur_color || '这只兽很懒，还没有填写~'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Camera className="text-fur-lightbrown" />
              细节设定
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-fur-pink/30 rounded-xl p-4">
                <h4 className="font-medium mb-2 text-fur-pink">爪垫颜色</h4>
                <p>{details?.paw_pad_color || '这只兽很懒，还没有填写~'}</p>
              </div>
              <div className="bg-fur-lightbrown/30 rounded-xl p-4">
                <h4 className="font-medium mb-2 text-fur-lightbrown">尾巴</h4>
                <p>{details?.tail_description || '这只兽很懒，还没有填写~'}</p>
              </div>
              <div className="bg-fur-lavender/30 rounded-xl p-4">
                <h4 className="font-medium mb-2 text-fur-lavender">角</h4>
                <p>{details?.horns_description || '无'}</p>
              </div>
              <div className="bg-fur-sky/30 rounded-xl p-4">
                <h4 className="font-medium mb-2 text-fur-sky">翅膀</h4>
                <p>{details?.wings_description || '无'}</p>
              </div>
              <div className="bg-fur-peach/30 rounded-xl p-4">
                <h4 className="font-medium mb-2 text-fur-peach">伤疤</h4>
                <p>{details?.scars || '无'}</p>
              </div>
              <div className="bg-fur-mint/30 rounded-xl p-4">
                <h4 className="font-medium mb-2 text-fur-mint">特殊标记</h4>
                <p>{details?.special_marks || '无'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personality' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Heart className="text-fur-peach" />
              性格 & 喜好
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Star className="text-yellow-500" fill="currentColor" />
                  喜欢
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.likes && selectedProfile.likes.length > 0 ? (
                    selectedProfile.likes.map((item: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-fur-mint/50 rounded-full text-sm">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-500">
                      这只兽很懒，还没有填写喜欢的事物~
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <span>💔</span>
                  讨厌
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.dislikes && selectedProfile.dislikes.length > 0 ? (
                    selectedProfile.dislikes.map((item: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-fur-peach/50 rounded-full text-sm">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-500">
                      这只兽很懒，还没有填写讨厌的事物~
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 bg-fur-beige/30 rounded-xl p-4">
              <h4 className="font-medium mb-2">小习惯</h4>
              <p>{selectedProfile.habits || '这只兽很懒，还没有填写~'}</p>
            </div>
          </div>
        )}

        {activeTab === 'worldview' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="text-fur-lightbrown" />
              世界观
            </h3>
            <div className="bg-fur-lavender/30 rounded-xl p-4 mb-4">
              <h4 className="font-medium mb-2">身份设定</h4>
              <p>{selectedProfile.world_view || '这只兽很懒，还没有填写~'}</p>
            </div>
            <div className="bg-fur-sky/30 rounded-xl p-4 mb-4">
              <h4 className="font-medium mb-2">角色背景故事</h4>
              <p>{selectedProfile.backstory || '这只兽很懒，还没有填写~'}</p>
            </div>
            <div className="bg-fur-peach/30 rounded-xl p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="text-red-500" />
                禁忌 & 设定红线
              </h4>
              <p>{selectedProfile.taboos || '这只兽很懒，还没有填写~'}</p>
            </div>
          </div>
        )}

        {activeTab === 'references' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Camera className="text-fur-lightbrown" />
              参考图集
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(selectedProfile.gallery || []).map((url, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(url)}
                >
                  <div className="aspect-square rounded-xl overflow-hidden shadow-lg mb-2">
                    <img
                      src={url}
                      alt={`参考图${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm text-center font-medium">参考图{index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card p-6 mt-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Download className="text-fur-lightbrown" />
            兽身份证
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-64 h-80 bg-gradient-to-br from-fur-beige to-fur-cream rounded-xl p-4 shadow-xl border-4 border-fur-lightbrown/30">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-fur-lightbrown to-fur-peach flex items-center justify-center overflow-hidden">
                    {selectedProfile.avatar ? (
                      <img
                        src={selectedProfile.avatar}
                        alt={selectedProfile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🦊</span>
                    )}
                  </div>
                  <h4 className="font-bold text-lg">{selectedProfile.name || '未命名'}</h4>
                  <p className="text-sm text-gray-500">
                    {selectedProfile.species || '未知物种'} | {selectedProfile.gender || '未知性别'}
                  </p>
                  <div className="mt-4 space-y-2 text-left">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">年龄</span>
                      <span>{selectedProfile.age}岁</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">身高</span>
                      <span>{selectedProfile.height}cm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">毛色</span>
                      <span>{selectedProfile.fur_color}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="预览"
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}