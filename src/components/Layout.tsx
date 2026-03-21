import { Sidebar } from './Sidebar';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { useChat } from '../store/useChat';

export function Layout() {
  const { selectedUser } = useChat();

  return (
    <div className="h-screen w-full flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fade-in relative z-10">
      <div className="glass-panel w-full h-full max-w-7xl rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        <Sidebar />
        
        <div className={`w-full md:w-80 lg:w-96 border-r border-white/5 flex-shrink-0 ${selectedUser ? 'hidden md:flex' : 'flex'} flex-col bg-dark-900/20`}>
          <ChatList />
        </div>

        <div className={`flex-1 ${!selectedUser ? 'hidden md:flex' : 'flex'} flex-col bg-dark-900/40 relative`}>
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}
