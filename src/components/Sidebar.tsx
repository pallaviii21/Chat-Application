import { useAuth } from '../store/useAuth';
import { LogOut, Settings, User } from 'lucide-react';

export function Sidebar() {
  const { profile, signOut } = useAuth();

  return (
    <div className="w-16 sm:w-20 lg:w-24 bg-dark-900/50 flex-shrink-0 flex flex-col items-center py-6 border-r border-white/5 relative z-20">
      <div className="flex-1 w-full flex flex-col items-center gap-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl shadow-[0_0_15px_rgba(139,92,246,0.6)] ring-2 ring-primary-500/50 overflow-hidden relative group cursor-pointer transition-transform hover:scale-105">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{profile?.username?.[0]?.toUpperCase() || 'U'}</span>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-4 w-full mt-auto">
        <button className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
          <Settings className="w-6 h-6 group-hover:rotate-45 transition-transform" />
        </button>
        <button 
          onClick={signOut}
          className="p-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
          title="Sign out"
        >
          <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
