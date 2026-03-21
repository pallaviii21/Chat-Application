import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../store/useAuth';
import { useChat } from '../store/useChat';
import { MessageInput } from './MessageInput';
import { format } from 'date-fns';
import { ArrowLeft, Loader2, Phone, Video, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ChatWindow() {
  const { user } = useAuth();
  const { selectedUser, setSelectedUser, messages, fetchMessages, sendMessage, isLoading, addMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping] = useState(false); // Typing animation placeholder for future expansion

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (user && selectedUser) {
      fetchMessages(user.id, selectedUser.id);
      
      const channel = supabase.channel(`messages:${user.id}:${selectedUser.id}`)
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`
          }, 
          (payload) => {
            if (payload.new.sender_id === selectedUser.id) {
              addMessage(payload.new as any);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, selectedUser]);

  const handleSendMessage = async (content: string) => {
    if (!user || !selectedUser) return;
    
    // Optimistically add message
    const tempId = crypto.randomUUID();
    addMessage({
      id: tempId,
      sender_id: user.id,
      receiver_id: selectedUser.id,
      content,
      created_at: new Date().toISOString()
    });
    
    await sendMessage(user.id, selectedUser.id, content);
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-dark-800/50 rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/5">
           <div className="text-4xl">👋</div>
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500 mb-2">
          Your Messages
        </h2>
        <p className="text-slate-400 max-w-sm">
          Select an existing conversation from the sidebar or start a new one to begin chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-dark-950/20">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/5 bg-dark-900/40 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedUser(null)}
            className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 bg-primary-600/30 rounded-full flex items-center justify-center text-primary-200 font-semibold shadow-inner border border-primary-500/30 overflow-hidden text-sm">
              {selectedUser.avatar_url ? (
                <img src={selectedUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{selectedUser.username[0]?.toUpperCase()}</span>
              )}
            </div>
            {selectedUser.is_online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-900 shadow-sm" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-slate-100">{selectedUser.username}</h2>
            <p className="text-xs text-slate-400">
              {selectedUser.is_online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 text-slate-400">
          <button className="p-2 hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all hidden sm:block">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all hidden sm:block">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 scrollbar-hide">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm animate-fade-in">
                <div className="w-16 h-16 bg-dark-800/50 rounded-full flex items-center justify-center mb-4 text-2xl">
                  <span>👋</span>
                </div>
                Say hello to {selectedUser.username}!
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender_id === user?.id;
                const showAvatar = index === messages.length - 1 || messages[index + 1]?.sender_id !== msg.sender_id;
                
                return (
                  <div 
                    key={msg.id} 
                    className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'} animate-slide-up`}
                  >
                    {!isMe && showAvatar && (
                      <div className="w-6 h-6 rounded-full bg-dark-700 flex-shrink-0 flex items-center justify-center text-[10px] overflow-hidden mb-1">
                        {selectedUser.avatar_url ? (
                          <img src={selectedUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{selectedUser.username[0]?.toUpperCase()}</span>
                        )}
                      </div>
                    )}
                    {!isMe && !showAvatar && <div className="w-6 flex-shrink-0" />}
                    
                    <div className="flex flex-col w-full">
                      <div className={`p-3 px-4 shadow-sm backdrop-blur-sm ${
                        isMe ? 'chat-bubble-sender' : 'chat-bubble-receiver'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap word-break">{msg.content}</p>
                      </div>
                      <span className={`text-[10px] text-slate-500 mt-1 ${isMe ? 'text-right' : 'text-left'} px-1`}>
                        {format(new Date(msg.created_at), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {isTyping && (
              <div className="flex items-end gap-2 max-w-[75%] mr-auto animate-fade-in">
                <div className="w-6 h-6 rounded-full bg-dark-700 flex-shrink-0 flex items-center justify-center text-[10px] overflow-hidden mb-1">
                  <span>{selectedUser.username[0]?.toUpperCase()}</span>
                </div>
                <div className="chat-bubble-receiver p-3 px-4 w-16 h-10 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse-fast" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse-fast" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse-fast" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </>
        )}
      </div>

      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
