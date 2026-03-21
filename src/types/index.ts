export interface User {
  id: string;
  email?: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  is_online: boolean;
  last_seen: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}
