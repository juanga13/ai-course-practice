import { Input } from "@/components/Input"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useState } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export const Chat = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  return (
    <div className="flex flex-1 flex-col bg-background p-2">
      <NewChat />
      <div className="flex flex-rowbg-white win95-shadow-inset flex-0 h-12">
        <Input placeholder="Ask anything..." value={input} onChange={(e) => setInput(e.target.value)} />
        <Button>Send</Button>
      </div>
    </div>
  )
}

const NewChat = () => {
  return (
    <div className="bg-white win95-shadow-inset flex-1">
      <Text>New Chat</Text>
      <Button>New Chat</Button>
    </div>
  )
}
