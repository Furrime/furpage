import { useState, useEffect } from 'react';
import { MessageSquare, Send, Image, Pin } from 'lucide-react';

interface MessageItem {
  id: string;
  username: string;
  content: string;
  image_url?: string;
  is_sticky: boolean;
  is_approved: boolean;
  created_at: string;
}

export default function Guestbook() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState({ username: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(res => setMessages(res.data));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.username || !newMessage.content) return;
    
    setIsSubmitting(true);
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });
      setNewMessage({ username: '', content: '' });
      fetchMessages();
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-fur-cream pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">留言板</h1>
          <p className="text-gray-500">留下你的祝福和邀约～</p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="text-fur-lightbrown" />
              发表留言
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="你的名字"
                  value={newMessage.username}
                  onChange={(e) => setNewMessage({ ...newMessage, username: e.target.value })}
                  className="w-full px-4 py-2 bg-white/50 border border-fur-beige/50 rounded-xl focus:outline-none focus:border-fur-lightbrown transition-colors"
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="想说的话..."
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/50 border border-fur-beige/50 rounded-xl focus:outline-none focus:border-fur-lightbrown transition-colors resize-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-xl text-gray-600 hover:bg-white transition-colors"
                >
                  <Image size={18} />
                  添加图片
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-fur-lightbrown to-fur-peach text-white rounded-full font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  发送
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`glass-card p-6 ${message.is_sticky ? 'border-l-4 border-fur-peach' : ''}`}
            >
              {message.is_sticky && (
                <div className="flex items-center gap-1 text-fur-peach text-xs mb-2">
                  <Pin size={12} />
                  <span>置顶</span>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fur-lightbrown to-fur-peach flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {message.username.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{message.username}</span>
                    <span className="text-xs text-gray-400">{message.created_at}</span>
                  </div>
                  <p className="text-gray-600">{message.content}</p>
                  {message.image_url && (
                    <img
                      src={message.image_url}
                      alt="留言图片"
                      className="mt-3 max-w-full rounded-xl"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">暂无留言，快来抢沙发～</p>
          </div>
        )}
      </div>
    </div>
  );
}
