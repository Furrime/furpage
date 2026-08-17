import { useState, useEffect } from 'react';
import { Calendar, Check, Sparkles, Bug, Trash2, Music, MessageSquare } from 'lucide-react';
import { useProfile } from '../App';

export default function Changelog() {
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

  const changelog = [
    {
      version: 'v1.0',
      date: '2026年7月10日',
      type: 'release',
      items: [
        { icon: Sparkles, type: 'feature', text: '新增多兽设管理功能，支持添加多个兽设并切换显示' },
        { icon: Sparkles, type: 'feature', text: '新增关于页面，展示作者信息和技术栈' },
        { icon: Sparkles, type: 'feature', text: '新增更新日志页面，记录版本更新内容' },
        { icon: Sparkles, type: 'feature', text: '新增匿名问答功能，访客可匿名提问' },
        { icon: Sparkles, type: 'feature', text: '新增管理后台，支持配置所有图片、文字和功能开关' },
        { icon: Sparkles, type: 'feature', text: '新增自定义背景功能，支持颜色、渐变和图片背景' },
        { icon: Sparkles, type: 'feature', text: '新增日期显示，每周五显示"毛五"' },
        { icon: Bug, type: 'fix', text: '修复管理后台保存按钮被功能键覆盖的问题' },
        { icon: Bug, type: 'fix', text: '修复主页文字在浅色背景下不可见的问题' },
        { icon: Bug, type: 'fix', text: '修复兽设头像在证件风卡片中不同步的问题' },
        { icon: Trash2, type: 'remove', text: '移除默认帖子数据，初始为空' },
        { icon: Trash2, type: 'remove', text: '移除所有"TRAE SOLO"标识' },
        { icon: Trash2, type: 'remove', text: '移除消息推送功能' },
        { icon: Trash2, type: 'remove', text: '移除彩蛋/小游戏页面' },
        { icon: Trash2, type: 'remove', text: '移除背景音乐功能' },
        { icon: Trash2, type: 'remove', text: '移除留言板初始示例数据' },
        { icon: Check, type: 'update', text: '优化首页布局，添加半透明背景层提升文字可读性' },
        { icon: Check, type: 'update', text: '优化管理后台界面，添加返回首页和修改密码功能' },
        { icon: Check, type: 'update', text: '优化页面标题显示，支持选择显示兽设名称' },
        { icon: Check, type: 'update', text: '优化页脚文字，改为网站标题和欢迎语' },
        { icon: Check, type: 'update', text: '优化空状态处理，未填写信息显示"这只兽很懒，还没有填写"' },
        { icon: Check, type: 'update', text: '优化兽设档案卡片，移除"花纹""瞳色""配饰"字段' },
        { icon: Check, type: 'update', text: '将"证件风兽设卡"改为"兽身份证"' },
      ]
    }
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'feature': return 'text-fur-peach';
      case 'fix': return 'text-fur-mint';
      case 'remove': return 'text-red-400';
      case 'update': return 'text-fur-sky';
      default: return 'text-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'feature': return '新功能';
      case 'fix': return '修复';
      case 'remove': return '移除';
      case 'update': return '优化';
      default: return '';
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-fur-peach/10';
      case 'fix': return 'bg-fur-mint/10';
      case 'remove': return 'bg-red-50';
      case 'update': return 'bg-fur-sky/10';
      default: return 'bg-gray-50';
    }
  };

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
              <span className="text-6xl">🦊</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{siteTitle}</h1>
          <p className="text-gray-600">更新日志</p>
        </div>

        {changelog.map((version) => (
          <div key={version.version} className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-fur-peach/20 text-fur-peach font-bold rounded-full text-sm">
                  {version.version}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{version.date}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-fur-mint/20 text-fur-mint font-medium rounded-full text-sm">
                正式版
              </span>
            </div>

            <div className="space-y-3">
              {version.items.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-xl ${getTypeBg(item.type)}`}
                >
                  <item.icon className={`w-5 h-5 mt-0.5 ${getIconColor(item.type)} flex-shrink-0`} />
                  <div className="flex-1">
                    <p className="text-gray-800">{item.text}</p>
                    <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded ${getTypeBg(item.type)} ${getIconColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>furpage™ &copy; {new Date().getFullYear()} | Open Source</p>
        </div>
      </div>
    </div>
  );
}