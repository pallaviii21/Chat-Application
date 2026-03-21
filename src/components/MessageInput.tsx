import React, { useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';

interface Props {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: Props) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-dark-900/60 border-t border-white/5 flex items-end gap-2 relative z-10 backdrop-blur-md">
      <button 
        type="button"
        className="p-2 sm:p-2.5 text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all flex-shrink-0 mb-0.5"
      >
        <Paperclip className="w-5 h-5" />
      </button>
      
      <div className="flex-1 relative bg-dark-800/50 rounded-2xl border border-white/10 focus-within:border-primary-500/50 focus-within:ring-1 focus-within:ring-primary-500/50 transition-all flex items-end">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          placeholder="Type a message..."
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none max-h-32 py-3 px-4 text-sm sm:text-base text-slate-200 placeholder-slate-500 scrollbar-hide"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          style={{ height: 'auto', minHeight: '44px' }}
        />
        <button 
          type="button"
          className="p-2 sm:p-2.5 text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all flex-shrink-0 m-1"
        >
          <Smile className="w-5 h-5" />
        </button>
      </div>

      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="p-2.5 sm:p-3 bg-primary-600 hover:bg-primary-500 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] mb-0.5 flex-shrink-0 group"
      >
        <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </form>
  );
}
