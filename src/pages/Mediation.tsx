import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { api } from '../lib/api';
import BottomNav from '../components/BottomNav';
import { Heart, Sparkles, MessageCircle, Brain, Activity } from 'lucide-react';

const Mediation = () => {
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  const token = useAppStore(state => state.token);
  const suggestions = useAppStore(state => state.suggestions);
  const setSuggestions = useAppStore(state => state.setSuggestions);
  const hasLoadedRef = useRef(false);

  const loadSuggestions = useCallback(async () => {
    if (!user || !token || hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    api.setToken(token);
    try {
      const data = await api.getMediationSuggestions();
      setSuggestions(data);
    } catch (err) {
      console.error('加载建议失败', err);
    }
  }, [user, token, setSuggestions]);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    loadSuggestions();
  }, [user, token, navigate, loadSuggestions]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'communication':
        return <MessageCircle className="w-5 h-5" />;
      case 'reflection':
        return <Brain className="w-5 h-5" />;
      case 'exercise':
        return <Activity className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'communication':
        return '沟通技巧';
      case 'reflection':
        return '自我反思';
      case 'exercise':
        return '练习建议';
      default:
        return '建议';
    }
  };

  if (!user || !token) return null;

  return (
    <div className="min-h-screen bg-midnight-50 pb-24">
      <div className="bg-gradient-to-br from-coral-400 to-mint-400 text-white px-6 pt-12 pb-16">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <Heart className="w-7 h-7" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">智能调解</h1>
              <p className="text-white/80 text-sm">AI 为你提供专业建议</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8">
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="w-16 h-16 bg-midnight-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-midnight-400" />
              </div>
              <h3 className="text-lg font-medium text-midnight-800 mb-2">还没有建议</h3>
              <p className="text-midnight-500 text-sm">开始写日记后，AI 会为你提供建议</p>
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-2xl p-5 shadow-md animate-slide-up"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(suggestion.type)} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        suggestion.type === 'communication'
                          ? 'bg-coral-100 text-coral-700'
                          : suggestion.type === 'reflection'
                          ? 'bg-mint-100 text-mint-700'
                          : 'bg-midnight-100 text-midnight-700'
                      }`}>
                        {getTypeLabel(suggestion.type)}
                      </span>
                      <span className="text-xs text-midnight-400">
                        优先级 {suggestion.priority}
                      </span>
                    </div>
                    <p className="text-midnight-700 leading-relaxed">{suggestion.content}</p>
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

export default Mediation;
