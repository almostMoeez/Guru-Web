import { useEffect, useRef, useState } from 'react';
import { User, LogOut, ClipboardList, ChevronDown } from 'lucide-react';
import { useAuth } from '../lib/auth/AuthContext';

interface ProfileMenuProps {
  onNavigate: (section: string) => void;
}

export default function ProfileMenu({ onNavigate }: ProfileMenuProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const shortName = user?.firstName || user?.email?.split('@')[0] || 'Account';
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');

  const go = (section: string) => {
    onNavigate(section);
    setOpen(false);
  };

  const itemClass =
    'w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-primary-peach/30 text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
        title={user?.email}
      >
        <span className="w-7 h-7 rounded-full bg-primary-peach/15 flex items-center justify-center shrink-0">
          <User className="w-3.5 h-3.5 text-primary-peach" />
        </span>
        <span className="truncate max-w-[100px]">{shortName}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-[#242424] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-white text-sm font-semibold truncate">{fullName || 'Welcome'}</p>
            <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
          </div>
          <div className="py-1.5">
            <button onClick={() => go('profile')} className={itemClass}>
              <User className="w-4 h-4 text-zinc-500" /> My Profile
            </button>
            <button onClick={() => go('orders')} className={itemClass}>
              <ClipboardList className="w-4 h-4 text-zinc-500" /> Order History
            </button>
          </div>
          <div className="h-px bg-white/5" />
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-sm text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
