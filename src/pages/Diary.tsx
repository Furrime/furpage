import { useState, useEffect } from 'react';
import { BookOpen, Calendar, PenLine, ScrollText } from 'lucide-react';

interface DiaryItem {
  id: string;
  category: string;
  title: string;
  content: string;
  author_pov: string;
  created_at: string;
}

const categories = [
  { id: 'all', label: '全部', icon: BookOpen },
  { id: 'event', label: '活动日记', icon: Calendar },
  { id: 'thought', label: '心得随笔', icon: PenLine },
  { id: 'story', label: '小故事', icon: ScrollText },
];

export default function Diary() {
  const [items, setItems] = useState<DiaryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch('/api/data/diary')
      .then(res => res.json())
      .then(res => setItems(res.data));
  }, []);

  const filteredItems = items.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-fur-cream pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">日常随笔</h1>
          <p className="text-gray-500">记录生活中的点点滴滴</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-fur-lightbrown to-fur-peach text-white shadow-md'
                    : 'bg-white/70 text-gray-600 hover:bg-white'
                }`}
              >
                <Icon size={18} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {filteredItems.map((item) => (
            <div key={item.id} className="glass-card p-6 hover:scale-[1.02] transition-transform">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{item.created_at}</span>
                    <span className="px-2 py-0.5 bg-fur-lavender/50 rounded-full text-xs">
                      {item.author_pov === 'OC' ? 'OC视角' : '本人视角'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">暂无随笔～</p>
          </div>
        )}
      </div>
    </div>
  );
}
