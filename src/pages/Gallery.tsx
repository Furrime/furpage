import { useState, useEffect } from 'react';
import { Download, Camera, Heart } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: string;
  sub_category: string;
  url: string;
  title: string;
  artist: string;
  description: string;
  created_at: string;
}

const categories = [
  { id: 'all', label: '全部', icon: '📷' },
  { id: 'oc_illustration', label: 'OC插画', icon: '🎨' },
  { id: 'fursuit', label: '兽装实拍', icon: '🧥' },
  { id: 'emoji', label: '表情包', icon: '😊' },
  { id: 'fanart', label: '同人合拍', icon: '🤝' },
  { id: 'sketch', label: '手绘草稿', icon: '✏️' },
];

const subCategories: Record<string, string[]> = {
  oc_illustration: ['约稿', '无偿', '互绘', '赠图'],
  fursuit: ['外出', '室内', '局部细节'],
  emoji: ['静态', '动态'],
  fanart: ['贴贴图', '双人OC'],
  sketch: ['线稿', '速写', '扫描稿'],
};

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch('/api/data/gallery')
      .then(res => res.json())
      .then(res => setItems(res.data));
  }, []);

  const filteredItems = items.filter(item => {
    if (activeCategory === 'all') return true;
    if (item.category !== activeCategory) return false;
    if (!activeSubCategory) return true;
    return item.sub_category === activeSubCategory;
  });

  return (
    <div className="min-h-screen bg-fur-cream pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">作品图库</h1>
          <p className="text-gray-500">分类管理，清晰整洁</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setActiveSubCategory('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-fur-lightbrown to-fur-peach text-white shadow-md'
                  : 'bg-white/70 text-gray-600 hover:bg-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {activeCategory !== 'all' && subCategories[activeCategory] && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <button
              onClick={() => setActiveSubCategory('')}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                !activeSubCategory
                  ? 'bg-fur-beige text-fur-lightbrown'
                  : 'bg-white/50 text-gray-500'
              }`}
            >
              全部
            </button>
            {subCategories[activeCategory].map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubCategory(sub)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  activeSubCategory === sub
                    ? 'bg-fur-beige text-fur-lightbrown'
                    : 'bg-white/50 text-gray-500'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group glass-card overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => {
                setSelectedImage(item.url);
                setSelectedItem(item);
              }}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm font-medium truncate">{item.title}</p>
                    <p className="text-white/70 text-xs truncate">画师：{item.artist}</p>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm truncate">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">暂无作品～</p>
          </div>
        )}
      </div>

      {selectedImage && selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedImage(null);
            setSelectedItem(null);
          }}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
            <div className="flex-1 p-4 md:p-0">
              <img
                src={selectedImage}
                alt={selectedItem.title}
                className="w-full h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="md:w-80 p-6 flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-2">{selectedItem.title}</h3>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">画师：</span>{selectedItem.artist}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">分类：</span>{selectedItem.category}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">日期：</span>{selectedItem.created_at}
                </p>
              </div>
              <p className="text-gray-600 mb-6">{selectedItem.description}</p>
              <div className="flex gap-3">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-fur-lightbrown to-fur-peach text-white rounded-full font-medium hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(selectedImage, '_blank');
                  }}
                >
                  <Download size={18} />
                  保存原图
                </button>
                <button
                  className="px-4 py-2 bg-fur-peach/30 text-fur-peach rounded-full font-medium hover:bg-fur-peach/50 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
