import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Zap, Heart, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/diary', icon: BookOpen, label: '日记' },
    { path: '/treehole', icon: Zap, label: '树洞' },
    { path: '/mediation', icon: Heart, label: '调解' },
    { path: '/settings', icon: User, label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-midnight-100 px-4 py-2 pb-1 safe-area-bottom z-40">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
              >
                <item.icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-coral-500' : 'text-midnight-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? 'text-coral-500' : 'text-midnight-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
