
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

export const useMatches = () => {
  const [potentialMatches, setPotentialMatches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setPotentialMatches([]);
      setLoading(false);
      return;
    }

    const fetchPotentialMatches = async () => {
      try {
        // Get profiles excluding the current user and already swiped users
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .not('id', 'in', `(
            SELECT COALESCE(user2_id, user1_id) 
            FROM user_matches 
            WHERE user1_id = '${user.id}' OR user2_id = '${user.id}'
          )`)
          .limit(10);

        if (error) {
          console.error('Error fetching matches:', error);
        } else {
          setPotentialMatches(profiles || []);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPotentialMatches();
  }, [user]);

  const swipeRight = async (profileId: string) => {
    if (!user) return;

    try {
      // Check if the other user already swiped right on us
      const { data: existingMatch } = await supabase
        .from('user_matches')
        .select('*')
        .eq('user1_id', profileId)
        .eq('user2_id', user.id)
        .single();

      if (existingMatch) {
        // It's a match! Update the existing record
        await supabase
          .from('user_matches')
          .update({ 
            user2_swiped_right: true, 
            is_matched: true 
          })
          .eq('id', existingMatch.id);
        
        return { isMatch: true, profile: null };
      } else {
        // Create new swipe record
        await supabase
          .from('user_matches')
          .insert({
            user1_id: user.id,
            user2_id: profileId,
            user1_swiped_right: true
          });
        
        return { isMatch: false, profile: null };
      }
    } catch (error) {
      console.error('Error swiping right:', error);
      throw error;
    }
  };

  const swipeLeft = async (profileId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('user_matches')
        .insert({
          user1_id: user.id,
          user2_id: profileId,
          user1_swiped_right: false
        });
    } catch (error) {
      console.error('Error swiping left:', error);
      throw error;
    }
  };

  return {
    potentialMatches,
    loading,
    swipeRight,
    swipeLeft
  };
};
