"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const GREETING: Message = {
  role: "assistant",
  content: "Hi! How can I help you today?",
};

function TypingIndicator() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </span>
  );
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Replaces the trailing placeholder bubble instead of appending, so a failure
  // never leaves an empty bubble stuck on the typing indicator.
  const replaceLast = (content: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = { role: "assistant", content };
      return updated;
    });
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userMessage = message;
    setMessage("");
    setIsStreaming(true);

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

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat?message=${encodeURIComponent(userMessage)}`,
      );

      if (!response.ok || !response.body) {
        replaceLast("Sorry, I couldn't reach the server. Please try again.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage = "";
      let finished = false;

      while (!finished) {
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

          if (json.error) {
            replaceLast(json.error);
            finished = true;
            break;
          }

          if (json.done) {
            // Breaks the outer loop too: a bare `break` here would only leave
            // the `for`, and the next read() would block until the socket closed.
            finished = true;
            break;
          }

          assistantMessage += json.content;

          // Update the existing assistant message
          replaceLast(assistantMessage);
        }
      }

      // Releases the connection when we stopped early; harmless if already closed.
      await reader.cancel().catch(() => {});

      if (!assistantMessage && !finished) {
        replaceLast("Sorry, I didn't get a response. Please try again.");
      }
    } catch (error) {
      console.error("send message failed:", error);
      replaceLast("Sorry, something went wrong. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <div className="chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-3 py-6 sm:px-4">
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            const isPending = !isUser && message.content === "";

            return (
              <div
                key={`message-${index}`}
                className={`message-in flex items-end gap-2 sm:gap-2.5 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {/* Bot icon */}
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                {/* Message */}
                <div
                  className={`min-w-0 max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap shadow-sm sm:max-w-[75%] sm:px-4 ${
                    isUser
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md border border-border bg-card text-card-foreground"
                  }`}
                >
                  {isPending ? <TypingIndicator /> : message.content}
                </div>

                {/* User icon */}
                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <form
        className="shrink-0 border-t border-border bg-card/70 p-3 backdrop-blur-sm sm:p-4"
        onSubmit={sendMessage}
      >
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-2xl border border-border bg-background p-1.5 shadow-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
          <Input
            placeholder="Ask anything about your documents..."
            value={message}
            onChange={handleInputChange}
            disabled={isStreaming}
            className="h-9 flex-1 border-0 bg-transparent px-2.5 shadow-none focus-visible:border-0 focus-visible:ring-0 disabled:bg-transparent"
          />

          <Button
            type="submit"
            aria-label="Send message"
            disabled={!message.trim() || isStreaming}
            className="h-9 w-9 shrink-0 rounded-xl p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mx-auto mt-2 w-full max-w-3xl text-center text-xs text-muted-foreground">
          Responses are generated from your uploaded documents.
        </p>
      </form>
    </div>
  );
}
