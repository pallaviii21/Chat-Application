import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Message, Profile } from '../types';

interface ChatState {
  messages: Message[];
  activeUsers: Profile[];
  selectedUser: Profile | null;
  isLoading: boolean;
  setSelectedUser: (user: Profile | null) => void;
  fetchMessages: (currentUserId: string, otherUserId: string) => Promise<void>;
  fetchActiveUsers: (currentUserId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<void>;
  updateUserStatus: (userId: string, isOnline: boolean, lastSeen?: string) => void;
}

export const useChat = create<ChatState>()((set) => ({
  messages: [],
  activeUsers: [],
  selectedUser: null,
  isLoading: false,
  setSelectedUser: (user) => set({ selectedUser: user }),
  
  fetchMessages: async (currentUserId, otherUserId) => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true });
      
    if (!error && data) {
      set({ messages: data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  fetchActiveUsers: async (currentUserId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId)
      .order('is_online', { ascending: false })
      .order('last_seen', { ascending: false });
      
    if (!error && data) {
      set({ activeUsers: data });
    }
  },

  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),

  sendMessage: async (senderId, receiverId, content) => {
    const { error } = await supabase
      .from('messages')
      .insert([
        { sender_id: senderId, receiver_id: receiverId, content }
      ]);
      
    if (error) {
      console.error('Error sending message:', error);
    }
  },
  
  updateUserStatus: (userId, isOnline, lastSeen) => set((state) => ({
    activeUsers: state.activeUsers.map(u => 
      u.id === userId 
        ? { ...u, is_online: isOnline, last_seen: lastSeen || u.last_seen } 
        : u
    )
  }))
}));
