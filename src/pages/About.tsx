import { useState, useEffect } from 'react';
import { Heart, Code, Palette, Shield, ExternalLink } from 'lucide-react';
import { useProfile } from '../App';

export default function About() {
  const { getDisplayProfile } = useProfile();
  const displayProfile = getDisplayProfile();
  const [siteConfig, setSiteConfig] = useState<{ title: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSiteConfig(data.data.site);
        }
      })
      .catch(() => {});
  }, []);

  const siteTitle = siteConfig?.title || 'furpage™';

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="glass-card p-8 mb-6 text-center">
          <div className="inline-block mb-4">
            {displayProfile?.avatar ? (
              <img
                src={displayProfile.avatar}
                alt={displayProfile.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/50"
              />
            ) : (
              <span className="text-6xl">F</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{siteTitle}</h1>
          <p className="text-gray-600">关于本站</p>
        </div>

        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="text-fur-peach" size={24} />
            关于作者
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl">
              <span className="text-gray-600">项目</span>
              <span className="font-medium text-gray-800">furpage™</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/30 rounded-xl">
              <span className="text-gray-600">开源协议</span>
              <span className="font-medium text-gray-800">MIT License</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Code className="text-fur-lightbrown" size={24} />
            技术栈
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/30 rounded-xl text-center">
              <Code className="w-8 h-8 text-fur-sky mx-auto mb-2" />
              <h3 className="font-medium text-gray-800">前端</h3>
              <p className="text-sm text-gray-600">React 18 + TypeScript + Vite</p>
            </div>
            <div className="p-4 bg-white/30 rounded-xl text-center">
              <Palette className="w-8 h-8 text-fur-peach mx-auto mb-2" />
              <h3 className="font-medium text-gray-800">样式</h3>
              <p className="text-sm text-gray-600">TailwindCSS 3</p>
            </div>
            <div className="p-4 bg-white/30 rounded-xl text-center">
              <Shield className="w-8 h-8 text-fur-mint mx-auto mb-2" />
              <h3 className="font-medium text-gray-800">后端</h3>
              <p className="text-sm text-gray-600">Node.js + Express</p>
            </div>
            <div className="p-4 bg-white/30 rounded-xl text-center">
              <Heart className="w-8 h-8 text-fur-pink mx-auto mb-2" />
              <h3 className="font-medium text-gray-800">主题</h3>
              <p className="text-sm text-gray-600">Furry 毛系马卡龙</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="text-fur-pink" size={24} />
            致谢
          </h2>
          <p className="text-gray-600 leading-relaxed">
            furpage™ 是一个开源的兽圈个人展示站点项目，
            希望能帮助每一位 furry 更好地展示自己和自己的兽设。
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            欢迎在 <a href="https://github.com/Furrime/furpage" target="_blank" rel="noopener noreferrer" className="text-fur-peach underline">GitHub</a> 上提交 Issue 或 Pull Request！
          </p>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ExternalLink className="text-fur-lavender" size={24} />
            更新日志
          </h2>
          <p className="text-gray-600 mb-4">查看近期更新内容：</p>
          <a
            href="/changelog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-fur-peach text-white font-medium rounded-lg hover:opacity-90 transition-all"
          >
            查看更新日志
          </a>
        </div>

        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>furpage™ &copy; {new Date().getFullYear()} | Open Source</p>
        </div>
      </div>
    </div>
  );
}