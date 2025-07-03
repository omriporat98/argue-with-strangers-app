
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  matchPercentage: number;
  topBeliefs: string[];
  opposingViews: string[];
}

interface SwipingScreenProps {
  onMatch: (profile: Profile) => void;
  onPass: (profile: Profile) => void;
}

// Mock profiles with opposing views
const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Alex',
    age: 28,
    location: 'San Francisco, CA',
    photo: 'photo-1649972904349-6e44c42644a7',
    matchPercentage: 15,
    topBeliefs: ['Free Market Capitalism', 'Traditional Values', 'Minimal Government'],
    opposingViews: ['Opposes Universal Healthcare', 'Skeptical of Climate Action', 'Pro-Deregulation']
  },
  {
    id: '2',
    name: 'Sam',
    age: 25,
    location: 'Austin, TX',
    photo: 'photo-1581091226825-a6a2a5aee158',
    matchPercentage: 12,
    topBeliefs: ['Democratic Socialism', 'Progressive Values', 'Green New Deal'],
    opposingViews: ['Anti-Capitalist', 'Pro-Wealth Redistribution', 'Tech Regulation Advocate']
  },
  {
    id: '3',
    name: 'Jordan',
    age: 32,
    location: 'Miami, FL',
    photo: 'photo-1581092795360-fd1ca04f0952',
    matchPercentage: 8,
    topBeliefs: ['Libertarian', 'Crypto Advocate', 'Individual Rights'],
    opposingViews: ['Anti-Government Intervention', 'Pro-Privatization', 'Against Social Programs']
  }
];

const SwipingScreen: React.FC<SwipingScreenProps> = ({ onMatch, onPass }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<'left' | 'right' | null>(null);

  const currentProfile = mockProfiles[currentProfileIndex];

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (isAnimating || !currentProfile) return;

    setIsAnimating(true);
    setAnimationType(direction);

    setTimeout(() => {
      if (direction === 'right') {
        onMatch(currentProfile);
      } else {
        onPass(currentProfile);
      }

      // Move to next profile
      if (currentProfileIndex < mockProfiles.length - 1) {
        setCurrentProfileIndex(currentProfileIndex + 1);
      } else {
        setCurrentProfileIndex(0); // Loop back for demo
      }

      setIsAnimating(false);
      setAnimationType(null);
    }, 300);
  }, [currentProfile, currentProfileIndex, isAnimating, onMatch, onPass]);

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">No more profiles to debate!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 p-4">
      <div className="max-w-sm mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Debate Partner</h1>
          <p className="text-gray-600">Swipe right to debate, left to pass</p>
        </div>

        {/* Profile Card */}
        <Card 
          className={`w-full h-[600px] shadow-2xl transition-all duration-300 ${
            isAnimating && animationType === 'left' ? 'animate-swipe-left' : ''
          } ${
            isAnimating && animationType === 'right' ? 'animate-swipe-right' : ''
          }`}
        >
          <CardContent className="p-0 h-full flex flex-col">
            {/* Profile Image */}
            <div className="h-2/3 relative overflow-hidden rounded-t-lg">
              <img
                src={`https://images.unsplash.com/${currentProfile.photo}?auto=format&fit=crop&w=400&h=500`}
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              />
              
              {/* Match Percentage Badge */}
              <div className="absolute top-4 right-4">
                <Badge variant="destructive" className="bg-red-500 text-white font-bold text-sm px-3 py-1">
                  {currentProfile.matchPercentage}% Opposite
                </Badge>
              </div>
            </div>

            {/* Profile Info */}
            <div className="h-1/3 p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                <p className="text-gray-600 text-sm mb-3">{currentProfile.location}</p>

                {/* Opposing Views */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">Ready to debate:</h3>
                  <div className="flex flex-wrap gap-1">
                    {currentProfile.opposingViews.slice(0, 2).map((view, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-red-600 border-red-200">
                        {view}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-8 mt-6">
          <Button
            onClick={() => handleSwipe('left')}
            disabled={isAnimating}
            variant="outline"
            size="lg"
            className="w-16 h-16 rounded-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            <span className="text-2xl">❌</span>
          </Button>
          
          <Button
            onClick={() => handleSwipe('right')}
            disabled={isAnimating}
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-110"
          >
            <span className="text-2xl">🔥</span>
          </Button>
        </div>

        <div className="text-center mt-4 space-x-6 text-sm text-gray-500">
          <span>Pass</span>
          <span>Debate</span>
        </div>
      </div>
    </div>
  );
};

export default SwipingScreen;
