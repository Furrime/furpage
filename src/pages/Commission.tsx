import { useState, useEffect } from 'react';
import { Palette, Clock, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

interface CommissionData {
  price_list: {
    type: string;
    price: number;
    description: string;
    examples: string[];
  }[];
  process: string[];
  payment_methods: string[];
  duration: string;
  revision_rules: string[];
  forbidden_elements: string[];
  queue: {
    id: string;
    customer: string;
    type: string;
    status: string;
    estimated_date: string;
  }[];
}

const statusColors: Record<string, string> = {
  '绘制中': 'bg-fur-sky/50 text-fur-sky',
  '排队中': 'bg-fur-lavender/50 text-fur-lavender',
  '已完成': 'bg-fur-mint/50 text-fur-mint',
};

export default function Commission() {
  const [data, setData] = useState<CommissionData | null>(null);
  const [activePriceType, setActivePriceType] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/data/commission')
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
          <h1 className="text-3xl font-bold gradient-text mb-2">约稿专区</h1>
          <p className="text-gray-500">清晰的约稿模板，圈内刚需</p>
        </div>

        <div className="glass-card p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Palette className="text-fur-lightbrown" />
            价目表
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.price_list.map((item, index) => (
              <div
                key={index}
                className={`glass-card p-4 cursor-pointer transition-all ${
                  activePriceType === item.type ? 'ring-2 ring-fur-lightbrown' : 'hover:scale-105'
                }`}
                onClick={() => setActivePriceType(activePriceType === item.type ? null : item.type)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">{item.type}</h4>
                  <span className="text-fur-peach font-bold">{item.price}元</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                {activePriceType === item.type && item.examples.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">例图：</p>
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={item.examples[0]}
                        alt={`${item.type}例图`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="text-fur-lightbrown" />
              约稿流程
            </h3>
            <div className="space-y-2">
              {data.process.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-fur-lightbrown/20 flex items-center justify-center text-fur-lightbrown text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-600">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard className="text-fur-lightbrown" />
              支付方式
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.payment_methods.map((method, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-fur-beige/50 rounded-full text-sm font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
            <div className="mt-4 p-4 bg-fur-sky/30 rounded-xl">
              <p className="text-sm">
                <span className="font-medium">工期：</span>{data.duration}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="text-fur-mint" />
              修改规则
            </h3>
            <ul className="space-y-2">
              {data.revision_rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <CheckCircle size={16} className="text-fur-mint flex-shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="text-fur-peach" />
              禁忌元素
            </h3>
            <ul className="space-y-2">
              {data.forbidden_elements.map((element, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <AlertCircle size={16} className="text-fur-peach flex-shrink-0 mt-0.5" />
                  <span>{element}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">排单进度</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-fur-beige">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">客户</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">类型</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">状态</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">预计完成</th>
                </tr>
              </thead>
              <tbody>
                {data.queue.map((item) => (
                  <tr key={item.id} className="border-b border-fur-beige/50">
                    <td className="py-3 px-4 text-sm">{item.customer}</td>
                    <td className="py-3 px-4 text-sm">{item.type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{item.estimated_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
