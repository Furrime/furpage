import { useState, useEffect } from 'react';
import { Send, MessageCircle, CheckCircle, Clock } from 'lucide-react';

interface Question {
  id: string;
  content: string;
  answer?: string;
  is_answered: boolean;
  created_at: string;
}

export default function QNA() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/qna');
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    
    setSubmitting(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newQuestion.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        setNewQuestion('');
        setMessage('提问成功！感谢你的提问，我会尽快回复~');
        fetchQuestions();
      } else {
        setMessage('提交失败，请重试');
      }
    } catch (error) {
      setMessage('网络错误，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-fur-lavender rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-fur-graypurple" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">匿名问答</h1>
          <p className="text-gray-500">有什么想问我的？匿名提问，我会认真回答~</p>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">你的问题</label>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={4}
                placeholder="在这里输入你的问题..."
                className="w-full px-4 py-3 bg-white/50 border border-fur-pink/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-fur-peach/50 resize-none"
                required
              />
            </div>
            
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes('成功') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-fur-lavender to-fur-graypurple text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? '提交中...' : (
                <>
                  <Send className="w-4 h-4" />
                  匿名提交
                </>
              )}
            </button>
          </form>
          
          <p className="text-center text-gray-400 text-xs mt-4">
            你的提问是完全匿名的，请放心提问~
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            问答记录 ({questions.length})
          </h2>
          
          {questions.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">还没有提问，快来发起第一个问题吧~</p>
            </div>
          ) : (
            questions.map((question) => (
              <div
                key={question.id}
                className="glass-card rounded-2xl p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    question.is_answered ? 'bg-fur-mint' : 'bg-gray-200'
                  }`}>
                    {question.is_answered ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{question.content}</p>
                    <p className="text-gray-400 text-xs mt-1">{question.created_at}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    question.is_answered 
                      ? 'bg-fur-mint/30 text-green-600' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {question.is_answered ? '已回答' : '待回答'}
                  </span>
                </div>
                
                {question.answer && (
                  <div className="ml-13 mt-4 p-4 bg-fur-lavender/30 rounded-xl border-l-4 border-fur-graypurple">
                    <p className="text-gray-700">{question.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
