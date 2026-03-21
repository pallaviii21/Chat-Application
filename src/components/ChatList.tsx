import { useEffect } from 'react';
import { useAuth } from '../store/useAuth';
import { useChat } from '../store/useChat';
import { Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ChatList() {
  const { user } = useAuth();
  const { activeUsers, fetchActiveUsers, selectedUser, setSelectedUser } = useChat();

  useEffect(() => {
    if (user) {
      fetchActiveUsers(user.id);
    }
  }, [user, fetchActiveUsers]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 sm:p-6 border-b border-white/5">
        <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
          Messages
        </h1>
        <div className="mt-4 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
          </div>
          <input
            type="text"
            className="glass-input block w-full pl-10 pr-3 py-2 text-sm bg-dark-800/50"
            placeholder="Search conversations..."
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2">
        {activeUsers.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUser(u)}
            className={`w-full text-left p-4 flex items-center gap-4 hover:bg-white/5 transition-colors border-l-2 ${
              selectedUser?.id === u.id 
                ? 'bg-white/5 border-primary-500' 
                : 'border-transparent'
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-dark-700 rounded-full flex items-center justify-center text-slate-300 font-medium overflow-hidden">
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{u.username[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-dark-900 ${
                u.is_online ? 'bg-green-500' : 'bg-slate-500'
              }`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-sm font-semibold truncate text-slate-200">{u.username}</h3>
                <span className="text-xs text-slate-500 flex-shrink-0">
                  {u.is_online ? 'online' : u.last_seen ? formatDistanceToNow(new Date(u.last_seen), { addSuffix: true }) : ''}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {u.is_online ? 'Active now' : 'Offline'}
              </p>
            </div>
          </button>
        ))}

        {activeUsers.length === 0 && (
          <div className="px-6 py-8 text-center text-slate-500 text-sm">
            No other users available right now.
          </div>
        )}
      </div>
    </div>
  );
}
