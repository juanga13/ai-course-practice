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
  const [chats] = useState<string[]>([]);

  const handleNewChat = () => {
    setActiveChat(null);
    setNewChat(true);
  };

  const handleSelectChat = (chat: string) => {
    setActiveChat(chat);
    setNewChat(false);
  };

  return (
    // <div>
    //   <div className="flex-0 w-full h-[60px] bg-blue-200"></div>
    //   <div className="flex flex-1 flex-row">
    //     <div className="w-[200px] bg-red-200 h-full" />
    //     <div className="flex-1 bg-green-200 h-full" />
    //   </div>
    // </div>
    <div className="flex flex-1 flex-col win95-shadow h-full min-h-0">
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

      <div className="flex flex-1 flex-row min-h-0">
        <HistorySidebar
          onNewChat={handleNewChat}
          chats={chats.map(chat => ({
            name: chat,
            isActive: activeChat === chat,
            onSelect: () => handleSelectChat(chat),
          }))}
        />
        <Chat activeChat={activeChat} />
      </div>
    </div>
  );
}
