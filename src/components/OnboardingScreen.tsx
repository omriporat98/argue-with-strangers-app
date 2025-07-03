
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface OnboardingScreenProps {
  onComplete: (answers: Record<string, string>) => void;
}

const questions = [
  {
    id: 'politics',
    question: 'What best describes your political views?',
    options: [
      'Very Liberal',
      'Liberal', 
      'Moderate',
      'Conservative',
      'Very Conservative'
    ]
  },
  {
    id: 'economics',
    question: 'Which economic system do you prefer?',
    options: [
      'Free Market Capitalism',
      'Social Democracy',
      'Mixed Economy',
      'Socialism',
      'Other'
    ]
  },
  {
    id: 'social_issues',
    question: 'On social issues, you tend to be:',
    options: [
      'Very Progressive',
      'Progressive',
      'Moderate',
      'Traditional',
      'Very Traditional'
    ]
  },
  {
    id: 'environment',
    question: 'Climate change action should be:',
    options: [
      'Immediate and drastic',
      'Gradual but significant',
      'Market-driven solutions',
      'Minimal government intervention',
      'Not a priority'
    ]
  },
  {
    id: 'technology',
    question: 'Technology regulation should be:',
    options: [
      'Heavily regulated',
      'Moderately regulated',
      'Self-regulated',
      'Minimally regulated',
      'No regulation'
    ]
  }
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const hasAnswer = answers[currentQ.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-900">
            Build Your Debate Profile
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500 text-center">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              {currentQ.question}
            </h3>
            
            <RadioGroup
              value={answers[currentQ.id] || ''}
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
              className="space-y-3"
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between space-x-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex-1"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!hasAnswer}
              className="flex-1 bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600"
            >
              {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingScreen;
