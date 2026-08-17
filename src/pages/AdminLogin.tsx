import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '@/store/adminStore';
import { Lock, ArrowRight, Settings } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const { login } = useAdminStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkInitStatus();
  }, []);

  const checkInitStatus = async () => {
    try {
      const response = await fetch('/api/admin/init-status');
      const data = await response.json();
      if (data.success && !data.data.initialized) {
        navigate('/admin/init');
      }
    } catch (error) {
      console.error('Failed to check init status:', error);
    } finally {
      setInitLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(password);
    setLoading(false);
    if (success) {
      navigate('/admin');
    } else {
      setError('密码错误，请重试');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fur-cream p-4">
      <div className="glass-card w-full max-w-sm p-8 rounded-3xl shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-fur-peach rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">登录</h2>
          <p className="text-gray-500 text-sm mt-2">输入密码进入管理后台</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-fur-pink/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-fur-peach/50 transition-all"
              placeholder="请输入登录密码"
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-fur-peach to-fur-softpink text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? '登录中...' : (
              <>
                登录
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        
        <p className="text-center text-gray-400 text-xs mt-6">
          此页面仅供网站主人访问
        </p>
      </div>
    </div>
  );
}
