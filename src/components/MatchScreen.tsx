
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

interface MatchScreenProps {
  profile: Profile;
  onStartChat: () => void;
  onKeepSwiping: () => void;
}

const MatchScreen: React.FC<MatchScreenProps> = ({ profile, onStartChat, onKeepSwiping }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl animate-pulse-debate">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">It's a Match!</h1>
            <div className="text-6xl mb-4">🔥</div>
            <p className="text-white/90">
              You and {profile.name} are ready to debate!
            </p>
          </div>

          <div className="mb-8">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
              <img
                src={`https://images.unsplash.com/${profile.photo}?auto=format&fit=crop&w=200&h=200`}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {profile.name}, {profile.age}
            </h2>
            <p className="text-white/80 text-sm mb-3">{profile.location}</p>
            <p className="text-white/90 text-sm">
              {profile.matchPercentage}% Opposite Views - Perfect for debate!
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onStartChat}
              className="w-full bg-white text-red-500 hover:bg-gray-100 font-semibold py-3 rounded-xl shadow-lg"
            >
              Start Debating
            </Button>
            
            <Button
              onClick={onKeepSwiping}
              variant="outline"
              className="w-full border-white text-white hover:bg-white/10 py-3 rounded-xl"
            >
              Keep Swiping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchScreen;
