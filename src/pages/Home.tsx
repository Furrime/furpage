import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Image, Shirt, BookOpen, Users, MessageSquare, Palette, Sparkles } from 'lucide-react';
import { useProfile } from '../App';

const quickNavItems = [
  { path: '/profile', label: '兽设档案', icon: User, color: 'from-fur-lightbrown to-fur-peach' },
  { path: '/gallery', label: '作品图库', icon: Image, color: 'from-fur-sky to-fur-mint' },
  { path: '/fursuit', label: '兽装专栏', icon: Shirt, color: 'from-fur-pink to-fur-softpink' },
  { path: '/diary', label: '日常随笔', icon: BookOpen, color: 'from-fur-lavender to-fur-graypurple' },
  { path: '/friends', label: '亲友墙', icon: Users, color: 'from-fur-mint to-fur-sky' },
  { path: '/guestbook', label: '留言板', icon: MessageSquare, color: 'from-fur-peach to-fur-pink' },
];

interface HomeConfig {
  site: {
    title: string;
    subtitle: string;
    useProfileName: boolean;
  };
  home: {
    carousel: { id: string; url: string; title: string }[];
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
  diary: { id: string; title: string; date: string; image: string }[];
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { getActiveProfile, getDisplayProfile } = useProfile();

  useEffect(() => {
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConfig(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const images = config?.home?.carousel?.filter(item => item.url) || [];
    if (images.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [config?.home?.carousel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-fur-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fur-peach border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  const activeProfile = getActiveProfile();
  const displayProfile = getDisplayProfile();
  const heroImages = config?.home?.carousel?.filter((item: { url: string }) => item.url)?.map((item: { url: string }) => item.url) || [];
  
  let siteTitle = config?.site?.title || 'furpage™';
  if (config?.site?.useProfileName && displayProfile?.name) {
    siteTitle = displayProfile.name;
  }
  const siteSubtitle = config?.site?.subtitle || '欢迎来到我的个人站点～';

  return (
    <div className="min-h-screen bg-fur bg-fur-cream">
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <div className="text-center bg-black/20 backdrop-blur-sm rounded-2xl px-8 py-6">
            <div className="inline-block mb-4">
              {displayProfile?.avatar ? (
                <img
                  src={displayProfile.avatar}
                  alt={displayProfile.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/50 animate-wiggle"
                />
              ) : (
                <span className="text-6xl animate-wiggle">🦊</span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800 gradient-text drop-shadow-lg">
              {siteTitle}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-2">
              {siteSubtitle}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              {displayProfile?.name && (
                <span>{displayProfile.species || '未知物种'} | {displayProfile.gender || '未知性别'} | {displayProfile.personality || '暂无介绍'}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-6 gradient-text">关于我</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {activeProfile?.avatar ? (
                    <img
                      src={activeProfile.avatar}
                      alt={activeProfile.name}
                      className="w-16 h-16 rounded-full object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fur-lightbrown to-fur-peach flex items-center justify-center shadow-lg">
                      <span className="text-3xl">🦊</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{activeProfile?.name || '这只兽很懒，还没有填写名字~'}</h3>
                    <p className="text-sm text-gray-500">
                      {activeProfile?.species ? `物种：${activeProfile.species}` : ''}
                      {activeProfile?.species && activeProfile?.age ? ' | ' : ''}
                      {activeProfile?.age ? `${activeProfile.age}岁` : ''}
                      {!activeProfile?.species && !activeProfile?.age ? '这只兽很懒，还没有填写基本信息~' : ''}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {activeProfile?.bio || '这只兽很懒，还没有填写个人简介~'}
                </p>
                <div className="space-y-2">
                  {activeProfile?.likes && activeProfile.likes.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-fur-lightbrown">❤️</span>
                      <span>喜欢：{activeProfile.likes.join('、')}</span>
                    </div>
                  )}
                  {activeProfile?.dislikes && activeProfile.dislikes.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-fur-peach">💔</span>
                      <span>讨厌：{activeProfile.dislikes.join('、')}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  {activeProfile?.avatar ? (
                    <img
                      src={activeProfile.avatar}
                      alt={activeProfile.name}
                      className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-white"
                    />
                  ) : (
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-fur-lightbrown to-fur-peach flex items-center justify-center shadow-xl border-4 border-white">
                      <span className="text-6xl">🦊</span>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-fur-peach to-fur-pink rounded-full p-3 shadow-lg animate-float">
                    <span className="text-xl">✨</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 gradient-text">快捷导航</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group glass-card p-6 text-center hover:scale-105 transition-all duration-300"
                >
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 gradient-text">最近动态</h2>
          {config?.diary && config.diary.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {config.diary.slice(0, 3).map((item: { id: string; title: string; date: string; image: string }) => (
                <Link to="/diary" key={item.id} className="glass-card p-6 hover:scale-105 transition-transform group">
                  <div className="h-32 mb-4 rounded-xl overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-fur-peach/30 to-fur-sky/30 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-fur-peach/50" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-fur-peach/20 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-fur-peach" />
              </div>
              <p className="text-gray-500">这只兽很懒，还没有发布动态~</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}