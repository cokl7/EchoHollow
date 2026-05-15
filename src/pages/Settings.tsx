import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { api } from '../lib/api';
import BottomNav from '../components/BottomNav';
import { User, LogOut, Users, Mail, Copy, CheckCircle } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  const token = useAppStore(state => state.token);
  const logout = useAppStore(state => state.logout);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteLoading(true);
    try {
      await api.invitePartner(inviteEmail);
      setInviteEmail('');
    } catch (err) {
      console.error('邀请失败', err);
    } finally {
      setInviteLoading(false);
    }
  };

  const copyInviteCode = () => {
    if (user?.inviteCode) {
      navigator.clipboard.writeText(user.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user || !token) return null;

  return (
    <div className="min-h-screen bg-midnight-50 pb-24">
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-midnight-800">我的</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-coral-400 to-mint-400 rounded-2xl flex items-center justify-center text-white">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-midnight-800">{user.name}</h2>
              <p className="text-midnight-500 text-sm">{user.email}</p>
              <p className="text-xs text-midnight-400 mt-1">
                {user.partnerId ? '已绑定伴侣' : '未绑定伴侣'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-midnight-500" />
            <h3 className="font-medium text-midnight-800">伴侣绑定</h3>
          </div>

          {!user.partnerId && (
            <>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-midnight-600 mb-2">发送邀请</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="伴侣的邮箱"
                      className="flex-1 px-4 py-2 bg-midnight-50 border border-midnight-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none transition-all text-sm"
                    />
                    <button
                      onClick={handleInvite}
                      disabled={!inviteEmail.trim() || inviteLoading}
                      className="px-4 py-2 bg-coral-500 text-white rounded-xl font-medium hover:bg-coral-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      发送
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-midnight-600 mb-2">或分享邀请码</p>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-2 bg-midnight-100 rounded-xl text-midnight-700 font-mono text-sm">
                      {user.inviteCode}
                    </div>
                    <button
                      onClick={copyInviteCode}
                      className="px-4 py-2 bg-mint-500 text-white rounded-xl font-medium hover:bg-mint-600 transition-all text-sm flex items-center gap-1"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? '已复制' : '复制'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {user.partnerId && (
            <div className="bg-mint-50 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-mint-500 mx-auto mb-2" />
              <p className="text-mint-700 font-medium">已成功绑定伴侣</p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center justify-center gap-2 text-coral-600 font-medium hover:bg-coral-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
