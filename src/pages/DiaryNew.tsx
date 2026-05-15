import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { api } from '../lib/api';
import { Send, ArrowLeft, Tag } from 'lucide-react';

const DiaryNew = () => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addDiaryEntry, setError } = useAppStore();

  const moods = [
    { value: 'happy', icon: '😊', label: '开心' },
    { value: 'neutral', icon: '😐', label: '平静' },
    { value: 'sad', icon: '😢', label: '难过' },
    { value: 'angry', icon: '😠', label: '生气' },
    { value: 'anxious', icon: '😰', label: '焦虑' },
  ];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const entry = await api.createDiaryEntry({
        content,
        mood,
        tags,
      });
      addDiaryEntry(entry);
      navigate('/diary');
    } catch (err: any) {
      setError(err.message || '创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="min-h-screen bg-midnight-50">
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/diary')}
            className="w-10 h-10 bg-midnight-100 rounded-full flex items-center justify-center text-midnight-700 hover:bg-midnight-200 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-midnight-800">写日记</h1>
          <div className="flex-1" />
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
            className="px-6 py-2 bg-gradient-to-r from-coral-400 to-mint-400 text-white rounded-xl font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-midnight-700 mb-3">今天的心情</p>
          <div className="flex gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex-1 py-3 rounded-xl text-center transition-all ${
                  mood === m.value
                    ? 'bg-gradient-to-br from-coral-100 to-mint-100 ring-2 ring-coral-400'
                    : 'bg-white hover:bg-midnight-50'
                }`}
              >
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className="text-xs text-midnight-600">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今天发生了什么？记录你的心情..."
            className="w-full min-h-[200px] resize-none text-midnight-700 placeholder-midnight-400 outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-midnight-500" />
            <p className="text-sm font-medium text-midnight-700">标签</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-3 py-1 bg-mint-100 text-mint-700 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-mint-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="添加标签..."
              className="flex-1 px-4 py-2 bg-midnight-50 border border-midnight-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none transition-all text-sm"
            />
            <button
              onClick={addTag}
              disabled={!tagInput.trim()}
              className="px-4 py-2 bg-mint-500 text-white rounded-xl font-medium hover:bg-mint-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              添加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryNew;
