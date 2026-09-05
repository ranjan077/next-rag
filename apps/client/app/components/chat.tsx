"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type Message = {
  role: "assistant" | "user";
  content: string;
};
export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
  };
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((prev: Message[]) => {
      return [
        ...prev,
        {
          role: "user",
          content: message,
        },
      ];
    });
    const response = await fetch(
      `http://localhost:8000/chat?message=${message}`,
    );
    if (response.ok) {
      const data = await response.json();
      setMessages((prev: Message[]) => {
        return [
          ...prev,
          {
            role: "assistant",
            content: data.message,
          },
        ];
      });
      console.log("data: ", data);
    } else {
      console.log("send message failed!");
    }
  };
  return (
    <div className="relative p-4">
      <div className="overflow-scroll h-[82vh]">
        {messages.map((message, index) => {
          return (
            <div
              key={`message-${index}`}
              className="whitespace-pre-wrap break-words"
            >
              {message.content}
            </div>
          );
        })}
      </div>
      <form className="fixed bottom-2.5 flex w-full" onSubmit={sendMessage}>
        <Input
          placeholder="type your query here..."
          value={message}
          onChange={handleInputChange}
        />
        <Button type="submit" disabled={!message.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
