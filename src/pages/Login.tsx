import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { api } from '../lib/api';
import { Heart, Mail, Lock, User as UserIcon } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  const token = useAppStore(state => state.token);
  const setUser = useAppStore(state => state.setUser);
  const setToken = useAppStore(state => state.setToken);

  const handleRedirect = useCallback(() => {
    if (user && token) {
      api.setToken(token);
      navigate('/');
    }
  }, [user, token, navigate]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await api.login({ email, password });
      } else {
        response = await api.register({ email, password, name });
      }
      
      api.setToken(response.token);
      setUser(response.user);
      setToken(response.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const response = await api.login({ 
        email: 'demo@echohollow.com', 
        password: 'demo123' 
      });
      api.setToken(response.token);
      setUser(response.user);
      setToken(response.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '演示登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-50 via-mint-50 to-coral-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-coral-400 to-mint-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-midnight-800 mb-2">回声树洞</h1>
            <p className="text-midnight-500">让情感有处安放</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-midnight-700 mb-1">
                    姓名
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none transition-all"
                      placeholder="请输入姓名"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-midnight-700 mb-1">
                  邮箱
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none transition-all"
                    placeholder="请输入邮箱"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-700 mb-1">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none transition-all"
                    placeholder="请输入密码"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-coral-50 border border-coral-200 text-coral-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-coral-400 to-mint-400 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-3 bg-midnight-800 text-white font-medium rounded-xl hover:bg-midnight-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                体验演示账号
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-midnight-500">
                {isLogin ? '还没有账号？' : '已有账号？'}
              </span>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="ml-1 text-coral-500 font-medium hover:text-coral-600 transition-colors"
              >
                {isLogin ? '立即注册' : '立即登录'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
