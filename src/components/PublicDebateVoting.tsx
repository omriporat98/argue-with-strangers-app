
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThumbsUp, ThumbsDown, Clock, Users } from 'lucide-react';

interface PublicDebateVotingProps {
  debateId: string;
  participant1: {
    name: string;
    photo: string;
    elo: number;
  };
  participant2: {
    name: string;
    photo: string;
    elo: number;
  };
  conversation: Array<{
    sender: string;
    message: string;
    timestamp: Date;
  }>;
  votingEndTime: Date;
  onVote?: (winner: 'participant1' | 'participant2') => void;
}

const PublicDebateVoting: React.FC<PublicDebateVotingProps> = ({
  debateId,
  participant1,
  participant2,
  conversation,
  votingEndTime,
  onVote
}) => {
  const [votes, setVotes] = useState({ participant1: 0, participant2: 0 });
  const [userVote, setUserVote] = useState<'participant1' | 'participant2' | null>(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = votingEndTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Voting ended');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [votingEndTime]);

  const handleVote = (choice: 'participant1' | 'participant2') => {
    if (userVote) return; // Already voted
    
    setUserVote(choice);
    setVotes(prev => ({
      ...prev,
      [choice]: prev[choice] + 1
    }));
    
    onVote?.(choice);
  };

  const totalVotes = votes.participant1 + votes.participant2;
  const participant1Percentage = totalVotes > 0 ? (votes.participant1 / totalVotes) * 100 : 0;
  const participant2Percentage = totalVotes > 0 ? (votes.participant2 / totalVotes) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Public Debate #{debateId}</span>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{timeLeft}</span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Participants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={`cursor-pointer transition-all ${userVote === 'participant1' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={`https://images.unsplash.com/${participant1.photo}?auto=format&fit=crop&w=100&h=100`}
                alt={participant1.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{participant1.name}</h3>
                <Badge variant="outline">ELO: {participant1.elo}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Votes</span>
                <span className="font-semibold">{votes.participant1}</span>
              </div>
              <Progress value={participant1Percentage} className="h-2" />
              <Button
                onClick={() => handleVote('participant1')}
                disabled={!!userVote}
                className="w-full"
                variant={userVote === 'participant1' ? 'default' : 'outline'}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Vote for {participant1.name}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${userVote === 'participant2' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={`https://images.unsplash.com/${participant2.photo}?auto=format&fit=crop&w=100&h=100`}
                alt={participant2.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{participant2.name}</h3>
                <Badge variant="outline">ELO: {participant2.elo}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Votes</span>
                <span className="font-semibold">{votes.participant2}</span>
              </div>
              <Progress value={participant2Percentage} className="h-2" />
              <Button
                onClick={() => handleVote('participant2')}
                disabled={!!userVote}
                className="w-full"
                variant={userVote === 'participant2' ? 'default' : 'outline'}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Vote for {participant2.name}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voting Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">Total Votes: {totalVotes}</span>
            </div>
            {userVote && (
              <Badge variant="secondary">
                You voted for {userVote === 'participant1' ? participant1.name : participant2.name}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conversation Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Debate Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {conversation.slice(0, 10).map((msg, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{msg.sender}</span>
                  <span className="text-xs text-gray-500">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
            {conversation.length > 10 && (
              <p className="text-center text-sm text-gray-500">
                ... and {conversation.length - 10} more messages
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicDebateVoting;
