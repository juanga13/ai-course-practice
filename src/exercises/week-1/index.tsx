import React from "react";
import { HistorySidebar } from "./HistorySidebar"

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
      <div className="flex flex-1 bg-background">
        <p>asdasd</p>
      </div>
    </div>
  )
}