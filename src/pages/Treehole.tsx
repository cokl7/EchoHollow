import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { api } from '../lib/api';
import BottomNav from '../components/BottomNav';
import { Zap, Send, ArrowLeft, Lock } from 'lucide-react';

const Treehole = () => {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'write'>('list');
  const navigate = useNavigate();
  const { user, token, addTreeholePost } = useAppStore();

  const loadPosts = useCallback(async () => {
    if (!user || !token) return;
    api.setToken(token);
    try {
      const data = await api.getTreeholePosts();
      setPosts(data);
    } catch (err) {
      console.error('加载树洞失败', err);
    }
  }, [user, token]);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    loadPosts();
  }, [user, token, navigate, loadPosts]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const post = await api.createTreeholePost({
        content,
        isAnonymous,
      });
      addTreeholePost(post);
      setContent('');
      setViewMode('list');
      loadPosts();
    } catch (err) {
      console.error('发送失败', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  };

  if (!user || !token) return null;

  if (viewMode === 'write') {
    return (
      <div className="min-h-screen bg-midnight-50">
        <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-10 shadow-sm">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <button
              onClick={() => setViewMode('list')}
              className="w-10 h-10 bg-midnight-100 rounded-full flex items-center justify-center text-midnight-700 hover:bg-midnight-200 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-midnight-800">倾诉心事</h1>
            <div className="flex-1" />
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="px-6 py-2 bg-gradient-to-r from-coral-400 to-mint-400 text-white rounded-xl font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              发送
            </button>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl p-5 shadow-md mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在这里，你可以放心地说出任何话..."
              className="w-full min-h-[250px] resize-none text-midnight-700 placeholder-midnight-400 outline-none"
            />
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${
                isAnonymous ? 'bg-mint-50' : 'bg-midnight-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isAnonymous ? 'bg-mint-100 text-mint-600' : 'bg-midnight-200 text-midnight-500'
                }`}>
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-midnight-800">匿名发布</p>
                  <p className="text-xs text-midnight-500">保护你的隐私</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all ${
                isAnonymous ? 'bg-mint-500' : 'bg-midnight-300'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
                  isAnonymous ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight-50 pb-24">
      <div className="bg-gradient-to-br from-coral-400 to-mint-400 text-white px-6 pt-12 pb-16">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <Zap className="w-7 h-7" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">回声树洞</h1>
              <p className="text-white/80 text-sm">一个安全的倾诉空间</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8">
        <button
          onClick={() => setViewMode('write')}
          className="w-full bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-coral-400 to-mint-400 rounded-xl flex items-center justify-center text-white">
              <Send className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-medium text-midnight-800">倾诉心事</p>
              <p className="text-sm text-midnight-500">点击写下你的想法</p>
            </div>
          </div>
        </button>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <div className="w-20 h-20 bg-midnight-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-midnight-400" />
              </div>
              <h3 className="text-lg font-medium text-midnight-800 mb-2">还没有记录</h3>
              <p className="text-midnight-500">在这里，你可以放心倾诉</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl p-5 shadow-md animate-slide-up">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-midnight-200 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-midnight-500" />
                  </div>
                  <span className="text-sm text-midnight-500">匿名用户</span>
                  <span className="text-xs text-midnight-400">·</span>
                  <span className="text-xs text-midnight-400">{formatDate(post.createdAt)}</span>
                </div>
                <p className="text-midnight-700 leading-relaxed">{post.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Treehole;
