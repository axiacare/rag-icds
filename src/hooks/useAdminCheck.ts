import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  const { user, loading: authLoading } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('has_role', {
            _user_id: user.id,
            _role: 'admin'
          });

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data || false);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      checkAdminRole();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
};