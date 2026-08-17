import { useState, useEffect } from 'react';
import { Shirt, Scissors, Calendar, Heart } from 'lucide-react';

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

const tabs = [
  { id: 'making', label: '制作记录', icon: Scissors },
  { id: 'outfits', label: '穿搭合集', icon: Shirt },
  { id: 'events', label: '线下活动', icon: Calendar },
  { id: 'care', label: '保养指南', icon: Heart },
];

export default function Fursuit() {
  const [data, setData] = useState<FursuitData | null>(null);
  const [activeTab, setActiveTab] = useState('making');

  useEffect(() => {
    fetch('/api/data/fursuit')
      .then(res => res.json())
      .then(res => setData(res.data));
  }, []);

  if (!data) {
    return <div className="min-h-screen bg-fur-cream flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-fur-cream pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">兽装专栏</h1>
          <p className="text-gray-500">记录兽装制作、穿搭和活动的点点滴滴</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-fur-lightbrown to-fur-peach text-white shadow-md'
                    : 'bg-white/70 text-gray-600 hover:bg-white'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'making' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Scissors className="text-fur-lightbrown" />
              {data.making_process.title}
            </h3>
            <p className="text-gray-600 mb-6">{data.making_process.description}</p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {data.making_process.images.map((image, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={image}
                    alt={`制作过程 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-fur-beige/30 rounded-xl p-4">
                <h4 className="font-medium mb-2">使用材料</h4>
                <div className="flex flex-wrap gap-2">
                  {data.making_process.materials.map((mat, i) => (
                    <span key={i} className="px-2 py-1 bg-white rounded-full text-sm">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-fur-sky/30 rounded-xl p-4">
                <h4 className="font-medium mb-2">制作工期</h4>
                <p className="text-lg font-bold">{data.making_process.duration}</p>
              </div>
              <div className="bg-fur-peach/30 rounded-xl p-4">
                <h4 className="font-medium mb-2">兽装师信息</h4>
                <p>{data.making_process.maker_info}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'outfits' && (
          <div className="space-y-6">
            {data.outfits.map((outfit, index) => (
              <div key={index} className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4">{outfit.title}</h3>
                <p className="text-gray-600 mb-4">{outfit.description}</p>
                
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  {outfit.images.map((image, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={image}
                        alt={`穿搭 ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-500">配饰：</span>
                  {outfit.accessories.map((acc, i) => (
                    <span key={i} className="px-3 py-1 bg-fur-lavender/50 rounded-full text-sm">
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            {data.events.map((event, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={event.images[0]}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600 flex items-center gap-2">
                        <Calendar size={16} className="text-fur-lightbrown" />
                        {event.date}
                      </p>
                      <p className="text-gray-600">📍 {event.location}</p>
                    </div>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-4">
            {data.care_guide.map((guide, index) => (
              <div key={index} className="glass-card p-6">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Heart className="text-fur-peach" />
                  {guide.title}
                </h3>
                <p className="text-gray-600">{guide.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
