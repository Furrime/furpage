import { useState, useEffect } from 'react';
import { Users, Heart, Sparkles } from 'lucide-react';

interface FriendItem {
  id: string;
  name: string;
  species: string;
  relationship: string;
  avatar_url: string;
  description: string;
  met_date: string;
}

const relationshipColors: Record<string, string> = {
  '亲友': 'bg-fur-mint/50 text-fur-mint',
  '搭档': 'bg-fur-sky/50 text-fur-sky',
  'CP': 'bg-fur-peach/50 text-fur-peach',
  '崽': 'bg-fur-pink/50 text-fur-pink',
  '家长': 'bg-fur-lavender/50 text-fur-lavender',
};

export default function Friends() {
  const [friends, setFriends] = useState<FriendItem[]>([]);

  useEffect(() => {
    fetch('/api/data/friends')
      .then(res => res.json())
      .then(res => setFriends(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-fur-cream pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">亲友墙</h1>
          <p className="text-gray-500">感谢遇见每一个可爱的你</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {friends.map((friend) => (
            <div key={friend.id} className="glass-card p-6 text-center hover:scale-105 transition-transform">
              <div className="relative mb-4">
                <img
                  src={friend.avatar_url}
                  alt={friend.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${relationshipColors[friend.relationship] || 'bg-fur-beige/50 text-gray-600'}`}>
                  {friend.relationship}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1">{friend.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{friend.species}</p>
              <p className="text-gray-600 text-sm mb-3">{friend.description}</p>
              <p className="text-xs text-gray-400">相识于 {friend.met_date}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="text-fur-peach" size={24} fill="currentColor" />
            <h2 className="text-xl font-bold">感谢板块</h2>
            <Heart className="text-fur-peach" size={24} fill="currentColor" />
          </div>
          <p className="text-gray-600 mb-4">
            感谢所有赠图、无偿、陪伴我的兽友们～❤️
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-fur-peach/30 rounded-full text-sm">感谢画师A的赠图</span>
            <span className="px-3 py-1 bg-fur-mint/30 rounded-full text-sm">感谢亲友B的陪伴</span>
            <span className="px-3 py-1 bg-fur-sky/30 rounded-full text-sm">感谢兽装师的用心制作</span>
            <span className="px-3 py-1 bg-fur-lavender/30 rounded-full text-sm">感谢每一位支持我的人</span>
          </div>
        </div>

        <div className="glass-card p-8 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-fur-lightbrown" size={24} />
            <h2 className="text-xl font-bold">贴贴合集</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-fur-peach/20 to-fur-sky/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-fur-peach/50" />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-fur-mint/20 to-fur-lavender/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-fur-mint/50" />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-fur-pink/20 to-fur-peach/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-fur-pink/50" />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-fur-sky/20 to-fur-mint/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-fur-sky/50" />
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">这只兽很懒，还没有添加贴贴图片~</p>
        </div>
      </div>
    </div>
  );
}
