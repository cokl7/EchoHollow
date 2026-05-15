import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { api } from '../lib/api';
import BottomNav from '../components/BottomNav';
import { BookOpen, Plus, Calendar } from 'lucide-react';

const Diary = () => {
  const navigate = useNavigate();
  const { user, token, diaryEntries } = useAppStore();
  const setDiaryEntries = useAppStore(state => state.setDiaryEntries);
  const hasLoadedRef = useRef(false);

  const loadDiaries = useCallback(async () => {
    if (!user || !token || hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    api.setToken(token);
    try {
      const entries = await api.getDiaryEntries();
      setDiaryEntries(entries);
    } catch (err) {
      console.error('加载日记失败', err);
    }
  }, [user, token, setDiaryEntries]);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    loadDiaries();
  }, [user, token, navigate, loadDiaries]);

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'anxious': return '😰';
      default: return '😐';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-mint-100 text-mint-600';
      case 'neutral': return 'bg-midnight-100 text-midnight-600';
      case 'sad': return 'bg-blue-100 text-blue-600';
      case 'angry': return 'bg-coral-100 text-coral-600';
      case 'anxious': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-midnight-100 text-midnight-600';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (!user || !token) return null;

  return (
    <div className="min-h-screen bg-midnight-50 pb-24">
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-midnight-800">情感日记</h1>
            <p className="text-midnight-500 text-sm">记录每一天的心情</p>
          </div>
          <div className="w-12 h-12 bg-mint-100 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-mint-600" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/diary/new')}
          className="w-full bg-gradient-to-r from-coral-400 to-mint-400 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mb-6"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">写新日记</span>
        </button>

        <div className="space-y-4">
          {diaryEntries.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="w-16 h-16 bg-midnight-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-midnight-400" />
              </div>
              <h3 className="text-lg font-medium text-midnight-800 mb-2">还没有日记</h3>
              <p className="text-midnight-500 text-sm">开始记录你的情感旅程吧</p>
            </div>
          ) : (
            diaryEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all animate-slide-up"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">{getMoodIcon(entry.mood)}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-midnight-400" />
                      <span className="text-sm text-midnight-500">{formatDate(entry.createdAt)}</span>
                    </div>
                    <p className="text-midnight-700 leading-relaxed line-clamp-3">{entry.content}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {entry.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Diary;
