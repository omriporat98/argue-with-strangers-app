
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Debate<span className="text-red-500">Match</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-lg">
              Find your intellectual opposite
            </p>
          </div>

          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Passionate Debates
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Logical Arguments
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              Swipe through profiles to find people who think completely differently than you. 
              Match with your intellectual opposites and engage in thoughtful debates.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={onGetStarted}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              Start Debating
            </Button>
            
            <div className="text-xs text-gray-400 space-x-4">
              <span>Terms of Service</span>
              <span>•</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
