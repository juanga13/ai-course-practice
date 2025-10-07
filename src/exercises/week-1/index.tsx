import React from "react";
import { HistorySidebar } from "./HistorySidebar"
import { Chat } from "./Chat";

export default function Week1() {
  const handleNewChat = () => {
    console.log('handle new chat');
  }
  
  return (
    <div className="flex flex-1 flex-row">
      <HistorySidebar onNewChat={handleNewChat} chats={[
        {
          name: "Chat 1",
          onSelect: () => {
            console.log('select chat 1');
          }
        },
        {
          name: "Chat 2",
          onSelect: () => {
            console.log('select chat 2');
          }
        }
      ]}/>
      <Chat />
    </div>
  )
}