import React, { ReactNode } from "react";
import { Text, Title } from "@/components/Text"
import dialogIcon from "@/assets/Dialog.ico";
import { cn } from "@/utils/cn";

interface HistorySidebarProps {
  chats: {
    name: string;
    onSelect: () => void;
  }[];
  onNewChat: () => void;
}

export const HistorySidebar = (props: HistorySidebarProps) => {
  return (
    <div className="h-full w-[300px] p-2 bg-background">
      <div className="h-full w-full bg-white win95-shadow-inset">
        <ClickableText onClick={props.onNewChat}>
          <img src={dialogIcon.src} alt="Dialog" className="w-4 h-4" />
          <Text>New Chat</Text>
        </ClickableText>
        <Title className="select-none">Chat History</Title>
        {props.chats.map((chat, index) => (
          <div key={`chat-${index}`} className="flex flex-row">
            <div className="relative w-[12px] mt-[6px]">
              <div className="win95-indent flex items-center justify-center"/>
            </div>
            <ClickableText onClick={chat.onSelect}>{chat.name}</ClickableText>
          </div>
        ))}
      </div>
    </div>
  )
}

const ClickableText = ({onClick, children}: {onClick: () => void; children: ReactNode}) => (
  <div onClick={onClick} className={cn("flex flex-row flex-0 gap-2 items-center justify-start", "select-none border border-dotted border-transparent active:border-black")}>
    {children}
  </div>
)