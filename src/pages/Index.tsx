
import React, { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import SwipingScreen from '@/components/SwipingScreen';
import MatchScreen from '@/components/MatchScreen';
import ChatScreen from '@/components/ChatScreen';

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
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [currentMatch, setCurrentMatch] = useState<Profile | null>(null);

  const handleGetStarted = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = (answers: Record<string, string>) => {
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
