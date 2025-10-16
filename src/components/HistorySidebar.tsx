import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { Text, Title } from '@/components/Text';
import dialogIcon from '@/assets/Dialog.ico';
import { cn } from '@/utils/cn';

interface HistorySidebarProps {
  chats: {
    name: string;
    isActive: boolean;
    onSelect: () => void;
  }[];
  onNewChat: () => void;
}

export const HistorySidebar = (props: HistorySidebarProps) => {
  const [newChat, setNewChat] = useState(false);

  const handleNewChat = () => {
    setNewChat(true);
    props.onNewChat();
  };

  return (
    <div className="flex flex-0 min-w-[220px] p-2 bg-background">
      <div className="h-full w-full bg-white win95-shadow-inset">
        <ClickableText
          isActive={newChat}
          isLast={false}
          onClick={handleNewChat}
        >
          <Image src={dialogIcon} alt="Dialog" width={16} height={16} />
          <Text>New Chat</Text>
        </ClickableText>
        <Title className="select-none">Chat History</Title>
        <div className="border-l border-dotted border-">
          {props.chats.map((chat, index) => (
            <ClickableText
              isActive={chat.isActive}
              key={`chat-item-${index}`}
              onClick={chat.onSelect}
              isLast={index === props.chats.length - 1}
            >
              {chat.name}
            </ClickableText>
          ))}
        </div>
      </div>
    </div>
  );
};

const ClickableText = ({
  onClick,
  children,
  isLast,
  isActive,
}: {
  onClick: () => void;
  children: ReactNode;
  isLast: boolean;
  isActive: boolean;
}) => (
  <div className="flex flex-row items-center justify-start history-sidebar-item">
    <div className="relative w-[12px] mb-1">
      <div
        className={cn(
          'win95-indent',
          isLast ? 'win95-indent-last' : 'win95-indent '
        )}
      />
    </div>
    <a
      className={cn(
        'border border-transparent border-dotted active:border-black',
        isActive ? 'border-black' : ''
      )}
      onClick={onClick}
    >
      <Text
        className={cn(
          'flex flex-row flex-0 gap-2 items-center justify-start',
          'select-none border border-dotted border-transparent'
        )}
      >
        {children}
      </Text>
    </a>
  </div>
);
