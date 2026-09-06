"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Bot, User } from "lucide-react";

type Message = {
  role: "assistant" | "user";
  content: string;
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userMessage = message;
    setMessage("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);

    const response = await fetch(
      `http://localhost:8000/chat?message=${encodeURIComponent(userMessage)}`,
    );

    if (!response.ok || !response.body) {
      console.log("send message failed!");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let assistantMessage = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });

      // SSE can contain multiple events in one chunk
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) {
          continue;
        }

        const json = JSON.parse(line.substring(6));

        if (json.done) {
          break;
        }

        assistantMessage += json.content;

        // Update the existing assistant message
        setMessages((prev) => {
          const updatedMessages = [...prev];

          updatedMessages[updatedMessages.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          };

          return updatedMessages;
        });
      }
    }
  };

  return (
    <div className="relative p-4">
      <div className="overflow-scroll h-[82vh]">
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={`message-${index}`}
              className={`flex gap-3 mb-4 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* Bot icon */}
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-5 w-5" />
                </div>
              )}

              {/* Message */}
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 whitespace-pre-wrap break-words ${
                  isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>

              {/* User icon */}
              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5" />
                </div>
              )}
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
