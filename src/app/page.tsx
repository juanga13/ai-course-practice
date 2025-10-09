'use client';

import React, { useState } from 'react';
import { Title } from '../components/Text';
import { cn } from '../utils/cn';
import { HistorySidebar } from '../components/HistorySidebar';
import { Chat } from '../components/Chat';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [newChat, setNewChat] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const handleNewChat = () => {
    setActiveChat(null);
    setNewChat(true);
  };

  const handleSelectChat = (chat: string) => {
    setActiveChat(chat);
    setNewChat(false);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden win95-shadow">
      <div className="w-full flex flex-0 win95-titlebar gap-2">
        <div
          className={cn(
            'flex flex-row items-center gap-2',
            'win95-titlebar-text border border-transparent border-dotted',
            'select-none'
          )}
        >
          <Title>
            {`NBA Card Classifier` +
              (newChat ? `/new-chat` : activeChat ? `/${activeChat}` : '')}
          </Title>
        </div>
      </div>

      <div className="flex flex-1 flex-row">
        <HistorySidebar
          onNewChat={handleNewChat}
          chats={[
            {
              name: 'Chat 1',
              isActive: activeChat === 'chat-1',
              onSelect: () => handleSelectChat('chat-1'),
            },
            {
              name: 'Chat 2',
              isActive: activeChat === 'chat-2',
              onSelect: () => handleSelectChat('chat-2'),
            },
          ]}
        />
        <Chat />
      </div>
    </div>
  );
}
