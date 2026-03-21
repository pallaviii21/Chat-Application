import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useAuth } from './store/useAuth';
import { useChat } from './store/useChat';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, profile, setUser, setLoading, isLoading, fetchProfile } = useAuth();
  const { updateUserStatus } = useChat();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const onlineUserIds = Object.keys(state);
        onlineUserIds.forEach(id => updateUserStatus(id, true));
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        updateUserStatus(key, true);
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        updateUserStatus(key, false, new Date().toISOString());
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {!user || !profile ? <Auth /> : <Layout />}
    </>
  );
}

export default App;
