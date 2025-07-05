
-- Create enum types
CREATE TYPE public.debate_status AS ENUM ('active', 'ended_private', 'ended_public', 'voting');
CREATE TYPE public.user_rank AS ENUM ('bronze', 'silver', 'gold', 'pro');
CREATE TYPE public.vote_type AS ENUM ('participant1', 'participant2');

-- Users profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  age INTEGER,
  location TEXT,
  bio TEXT,
  elo_rating INTEGER DEFAULT 1200,
  xp_points INTEGER DEFAULT 0,
  total_debates INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  current_rank user_rank DEFAULT 'bronze',
  is_pro_league BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Debates table
CREATE TABLE public.debates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status debate_status DEFAULT 'active',
  is_public BOOLEAN DEFAULT FALSE,
  voting_end_time TIMESTAMP WITH TIME ZONE,
  winner_id UUID REFERENCES public.profiles(id),
  participant1_elo_change INTEGER DEFAULT 0,
  participant2_elo_change INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  participant1_votes INTEGER DEFAULT 0,
  participant2_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for debate conversations
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  quoted_message_id UUID REFERENCES public.messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table for public debates
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote_for vote_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(debate_id, voter_id)
);

-- Tags table for AI-generated topics
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Debate tags junction table
CREATE TABLE public.debate_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE(debate_id, tag_id)
);

-- XP and ELO logging
CREATE TABLE public.xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  debate_id UUID REFERENCES public.debates(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.elo_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  old_rating INTEGER NOT NULL,
  new_rating INTEGER NOT NULL,
  change_amount INTEGER NOT NULL,
  debate_id UUID REFERENCES public.debates(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved debates
CREATE TABLE public.saved_debates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, debate_id)
);

-- User matches/swipes
CREATE TABLE public.user_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user1_swiped_right BOOLEAN DEFAULT FALSE,
  user2_swiped_right BOOLEAN DEFAULT FALSE,
  is_matched BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elo_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for debates
CREATE POLICY "Public debates are viewable by everyone" ON public.debates FOR SELECT USING (is_public = true OR participant1_id = auth.uid() OR participant2_id = auth.uid());
CREATE POLICY "Participants can update their debates" ON public.debates FOR UPDATE USING (participant1_id = auth.uid() OR participant2_id = auth.uid());
CREATE POLICY "Authenticated users can create debates" ON public.debates FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for messages
CREATE POLICY "Messages viewable by debate participants or public debates" ON public.messages 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.debates 
    WHERE debates.id = messages.debate_id 
    AND (debates.is_public = true OR debates.participant1_id = auth.uid() OR debates.participant2_id = auth.uid())
  )
);
CREATE POLICY "Participants can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for votes
CREATE POLICY "Votes are viewable by everyone for public debates" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON public.votes FOR INSERT WITH CHECK (auth.uid() = voter_id);

-- RLS Policies for other tables
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Debate tags are viewable by everyone" ON public.debate_tags FOR SELECT USING (true);
CREATE POLICY "Users can view their own XP log" ON public.xp_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own ELO log" ON public.elo_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their saved debates" ON public.saved_debates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their matches" ON public.user_matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create matches" ON public.user_matches FOR INSERT WITH CHECK (auth.uid() = user1_id);
CREATE POLICY "Users can update their matches" ON public.user_matches FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate ELO rating changes
CREATE OR REPLACE FUNCTION public.calculate_elo_change(winner_rating INTEGER, loser_rating INTEGER)
RETURNS JSON AS $$
DECLARE
  k_factor INTEGER := 32;
  expected_winner DECIMAL;
  expected_loser DECIMAL;
  winner_change INTEGER;
  loser_change INTEGER;
BEGIN
  expected_winner := 1.0 / (1.0 + POWER(10, (loser_rating - winner_rating) / 400.0));
  expected_loser := 1.0 / (1.0 + POWER(10, (winner_rating - loser_rating) / 400.0));
  
  winner_change := ROUND(k_factor * (1 - expected_winner));
  loser_change := ROUND(k_factor * (0 - expected_loser));
  
  RETURN json_build_object(
    'winner_change', winner_change,
    'loser_change', loser_change
  );
END;
$$ LANGUAGE plpgsql;
