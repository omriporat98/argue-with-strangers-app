
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AuthScreen from '@/components/AuthScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import SwipingScreen from '@/components/SwipingScreen';
import MatchScreen from '@/components/MatchScreen';
import ChatScreen from '@/components/ChatScreen';
import { Loader2 } from 'lucide-react';

type Screen = 'welcome' | 'onboarding' | 'swiping' | 'match' | 'chat';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  matchPercentage: number;
  topBeliefs: string[];
  opposingViews: string[];
  elo?: number;
  xp?: number;
  totalDebates?: number;
  wins?: number;
  losses?: number;
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [currentMatch, setCurrentMatch] = useState<Profile | null>(null);

  // Define all handler functions first
  const handleGetStarted = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = async (answers: Record<string, string>) => {
    setUserAnswers(answers);
    console.log('User answers:', answers);
    setCurrentScreen('swiping');
  };

  const handleMatch = (profile: Profile) => {
    console.log('Matched with:', profile);
    setCurrentMatch(profile);
    setCurrentScreen('match');
  };

  const handlePass = (profile: Profile) => {
    console.log('Passed on:', profile);
    // Continue swiping
  };

  const handleStartChat = () => {
    setCurrentScreen('chat');
  };

  const handleKeepSwiping = () => {
    setCurrentScreen('swiping');
  };

  const handleBackToSwiping = () => {
    setCurrentScreen('swiping');
  };

  // Show loading screen while checking auth
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  // Show onboarding if profile needs completion
  if (profile && (!profile.age || !profile.location)) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      )}
      
      {currentScreen === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      
      {currentScreen === 'swiping' && (
        <SwipingScreen onMatch={handleMatch} onPass={handlePass} />
      )}
      
      {currentScreen === 'match' && currentMatch && (
        <MatchScreen 
          profile={currentMatch}
          onStartChat={handleStartChat}
          onKeepSwiping={handleKeepSwiping}
        />
      )}
      
      {currentScreen === 'chat' && currentMatch && (
        <ChatScreen 
          profile={currentMatch}
          onBack={handleBackToSwiping}
        />
      )}
    </div>
  );
};

export default Index;
