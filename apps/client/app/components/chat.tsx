"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Bot, User } from "lucide-react";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const GREETING: Message = {
  role: "assistant",
  content: "Hi! How can I help you today?",
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      `${process.env.NEXT_PUBLIC_API_URL}/chat?message=${encodeURIComponent(userMessage)}`,
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
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-3xl px-3 py-4 sm:px-4">
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={`message-${index}`}
                className={`mb-4 flex gap-2 sm:gap-3 ${
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
                  className={`min-w-0 max-w-[85%] rounded-lg px-3 py-2 text-sm break-words whitespace-pre-wrap sm:max-w-[75%] sm:px-4 ${
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
          <div ref={bottomRef} />
        </div>
      </div>

      <form
        className="shrink-0 border-t bg-background p-3 sm:p-4"
        onSubmit={sendMessage}
      >
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
          <Input
            placeholder="type your query here..."
            value={message}
            onChange={handleInputChange}
            className="h-10 flex-1"
          />

          <Button type="submit" size="lg" disabled={!message.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
