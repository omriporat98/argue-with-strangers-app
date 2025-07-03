import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2 } from 'lucide-react';

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

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  quotedMessage?: {
    id: string;
    text: string;
    sender: 'user' | 'other';
  };
}

interface ChatScreenProps {
  profile: Profile;
  onBack: () => void;
}

const commonEmojis = ['😀', '😂', '🤔', '👍', '👎', '🔥', '💯', '🤝', '🙄', '😤', '💪', '🎯', '❤️', '💔', '🤷‍♂️', '😎'];

const mockMessages: Message[] = [
  {
    id: '1',
    text: "So I see you believe in free market capitalism. That's interesting - I think it creates too much inequality. What's your take?",
    sender: 'other',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    text: "I think the free market actually lifts everyone up over time. Look at how global poverty has decreased as markets have opened up.",
    sender: 'user',
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: '3',
    text: "But what about wealth concentration? The top 1% owns so much more now than in the past. Doesn't that concern you?",
    sender: 'other',
    timestamp: new Date(Date.now() - 180000)
  }
];

const ChatScreen: React.FC<ChatScreenProps> = ({ profile, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [quotedMessage, setQuotedMessage] = useState<Message | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        quotedMessage: quotedMessage ? {
          id: quotedMessage.id,
          text: quotedMessage.text,
          sender: quotedMessage.sender
        } : undefined
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setQuotedMessage(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleQuoteMessage = (message: Message) => {
    setQuotedMessage(message);
  };

  const cancelQuote = () => {
    setQuotedMessage(null);
  };

  const generateShareText = () => {
    const conversationText = messages
      .map(msg => `${msg.sender === 'user' ? 'Me' : profile.name}: ${msg.text}`)
      .join('\n\n');
    
    return `🔥 Check out this heated debate I'm having with ${profile.name} (${profile.matchPercentage}% opposite views)!\n\n${conversationText}\n\nJoin the debate at [App Name]`;
  };

  const handleShare = (platform: string) => {
    const shareText = generateShareText();
    const encodedText = encodeURIComponent(shareText);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?text=${encodedText}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(shareText);
        alert('Conversation copied to clipboard! You can now paste it on Instagram.');
        setShowShareMenu(false);
        return;
      case 'copy':
        navigator.clipboard.writeText(shareText);
        alert('Conversation copied to clipboard!');
        setShowShareMenu(false);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
    setShowShareMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Chat Header */}
      <Card className="rounded-none border-b">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="p-2">
              ←
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={`https://images.unsplash.com/${profile.photo}?auto=format&fit=crop&w=100&h=100`}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{profile.name}</h2>
                <Badge variant="destructive" className="text-xs">
                  {profile.matchPercentage}% Opposite
                </Badge>
              </div>
            </div>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              
              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-40">
                  <div className="text-xs text-gray-600 mb-2 px-2">Share conversation</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('whatsapp')}
                    className="w-full justify-start text-left"
                  >
                    WhatsApp
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('telegram')}
                    className="w-full justify-start text-left"
                  >
                    Telegram
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('facebook')}
                    className="w-full justify-start text-left"
                  >
                    Facebook
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('twitter')}
                    className="w-full justify-start text-left"
                  >
                    Twitter
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('instagram')}
                    className="w-full justify-start text-left"
                  >
                    Instagram
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('copy')}
                    className="w-full justify-start text-left"
                  >
                    Copy Link
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative group ${
                message.sender === 'user'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
              }`}
            >
              {/* Quote indicator */}
              {message.quotedMessage && (
                <div className={`mb-2 p-2 rounded border-l-4 text-xs ${
                  message.sender === 'user' 
                    ? 'bg-red-400 border-red-200 text-red-100' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}>
                  <div className="font-semibold">
                    {message.quotedMessage.sender === 'user' ? 'You' : profile.name}:
                  </div>
                  <div className="italic">"{message.quotedMessage.text.length > 50 
                    ? message.quotedMessage.text.substring(0, 50) + '...' 
                    : message.quotedMessage.text}"</div>
                </div>
              )}
              
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-red-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              
              {/* Quote button for opponent messages */}
              {message.sender === 'other' && (
                <Button
                  onClick={() => handleQuoteMessage(message)}
                  variant="ghost"
                  size="sm"
                  className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs px-2 py-1"
                >
                  Quote
                </Button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quote preview */}
      {quotedMessage && (
        <div className="px-4 py-2 bg-gray-200 border-t">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs text-gray-600 font-semibold">
                Replying to {quotedMessage.sender === 'user' ? 'yourself' : profile.name}:
              </div>
              <div className="text-sm text-gray-700 italic">
                "{quotedMessage.text.length > 80 
                  ? quotedMessage.text.substring(0, 80) + '...' 
                  : quotedMessage.text}"
              </div>
            </div>
            <Button onClick={cancelQuote} variant="ghost" size="sm" className="text-gray-500">
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="px-4 py-2 bg-white border-t">
          <div className="grid grid-cols-8 gap-2">
            {commonEmojis.map((emoji) => (
              <Button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                variant="ghost"
                size="sm"
                className="text-lg hover:bg-gray-100"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <Card className="rounded-none border-t">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              variant="ghost"
              size="sm"
              className="text-xl"
            >
              😀
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Make your point..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatScreen;
