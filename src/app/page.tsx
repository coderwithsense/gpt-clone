"use client";

import { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { Layout } from '@/components/Layout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm a demo response. In a real application, this would be connected to your backend API.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Show auth modal on first visit
  const handleShowAuth = () => {
    setShowAuthModal(true);
  };

  return (
    <Layout showAuth={showAuthModal}>
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </Layout>
  );
};

export default Home;