import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  Settings 
} from 'lucide-react';
import { BusinessType, SubscriptionState, UserSession } from '../../types';

interface BottomNavBarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  subscription?: SubscriptionState;
  businessType?: BusinessType;
  userSession?: UserSession | null;
  customTabIds?: string[];
  onOpenCustomizeNav?: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange
}) => {
  // 4 Menu Utama Navigasi Bawah: Beranda, Staff, Marketing, Setting
  const navTabs = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'setting', label: 'Setting', icon: Settings }
  ];

  return (
    <div className="relative w-full">
      <nav 
        aria-label="Navigasi Bawah Utama"
        className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_14px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom,0px),0.4rem)] grid grid-cols-4 items-center select-none shrink-0 sticky bottom-0 z-30 pointer-events-auto"
      >
        {navTabs.map((tab) => {
          const IconComponent = tab.icon;
          // Active state detection
          const isActive = currentTab === tab.id || (tab.id === 'dashboard' && currentTab === 'beranda');

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 relative group cursor-pointer active:scale-95 ${
                isActive 
                  ? 'text-[#008952]' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                {/* Icon Container with active highlight */}
                <div
                  className={`p-1.5 rounded-xl transition-all flex items-center justify-center ${
                    isActive 
                      ? 'bg-emerald-100/80 text-[#008952] shadow-2xs' 
                      : 'group-hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  <IconComponent className="w-[20px] h-[20px] stroke-[2.2]" />
                </div>
              </div>

              {/* Tab Label */}
              <span
                className={`text-[10.5px] leading-tight tracking-tight mt-1 transition-all truncate max-w-full ${
                  isActive 
                    ? 'font-black text-[#008952]' 
                    : 'font-bold text-slate-600'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
