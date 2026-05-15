import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { api } from '../lib/api';
import BottomNav from '../components/BottomNav';
import { Heart, Sparkles, TrendingUp, Activity, BookOpen, Zap } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, dashboardData, setDashboardData, suggestions, setSuggestions, setLoading } = useAppStore();

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    api.setToken(token);
    loadData();
  }, [user, token, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashboard, suggestionsData] = await Promise.all([
        api.getDashboardData(),
        api.getMediationSuggestions(),
      ]);
      setDashboardData(dashboard);
      setSuggestions(suggestionsData);
    } catch (err) {
      console.error('加载数据失败', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'communication':
        return 'from-coral-400 to-coral-500';
      case 'reflection':
        return 'from-mint-400 to-mint-500';
      case 'exercise':
        return 'from-midnight-400 to-midnight-500';
      default:
        return 'from-midnight-400 to-midnight-500';
    }
  };

  if (!user || !token) return null;

  return (
    <div className="min-h-screen bg-midnight-50 pb-24">
      <div className="bg-gradient-to-br from-coral-400 to-mint-400 text-white px-6 pt-12 pb-16">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">你好，{user.name}</h1>
              <p className="text-white/80 text-sm">今天也要好好照顾自己</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6" fill="currentColor" />
            </div>
          </div>

          {dashboardData && (
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">关系健康指数</p>
                  <p className="text-3xl font-bold">{dashboardData.relationshipHealth}</p>
                </div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <div className="text-3xl">😊</div>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <div className="flex-1 bg-white/10 rounded-xl p-2 text-center">
                  <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs text-white/80">积极率</p>
                  <p className="font-semibold">{Math.round(dashboardData.positiveRatio * 100)}%</p>
                </div>
                <div className="flex-1 bg-white/10 rounded-xl p-2 text-center">
                  <Activity className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs text-white/80">本周记录</p>
                  <p className="font-semibold">{dashboardData.emotionTrend.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => navigate('/diary/new')}
            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all text-center"
          >
            <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-6 h-6 text-coral-500" />
            </div>
            <p className="text-sm font-medium text-midnight-700">写日记</p>
          </button>
          <button
            onClick={() => navigate('/treehole')}
            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all text-center"
          >
            <div className="w-12 h-12 bg-mint-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-mint-500" />
            </div>
            <p className="text-sm font-medium text-midnight-700">树洞</p>
          </button>
          <button
            onClick={() => navigate('/mediation')}
            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all text-center"
          >
            <div className="w-12 h-12 bg-midnight-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-midnight-500" />
            </div>
            <p className="text-sm font-medium text-midnight-700">调解建议</p>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-midnight-800">今日建议</h2>
          </div>
          <div className="space-y-3">
            {suggestions.slice(0, 3).map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-2xl p-4 shadow-md animate-slide-up"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getTypeColor(suggestion.type)} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-midnight-700 leading-relaxed">{suggestion.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {suggestions.length === 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-md text-center">
                <p className="text-midnight-500">暂无建议</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
