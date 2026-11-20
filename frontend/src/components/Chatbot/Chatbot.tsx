import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  MessageCircle,
  Send,
  X,
  RotateCcw,
} from "lucide-react";

import "./chatbot.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What is Fiestron?",
  "What is this year's theme?",
  "Who are the Core Leads?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the latest message visible.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Focus the input when the chat opens.
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Send a question to the chatbot backend.
  const sendMessage = async (question: string) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) return;

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: trimmedQuestion,
      },
    ];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            message: trimmedQuestion,
            history: messages.slice(-12),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to get a response.");
      }

      const result = await response.json();

      const answer =
        result.result?.answer ||
        result.answer ||
        "Sorry, I couldn't generate a response. Please try again.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the input form.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Start a fresh conversation.
  const resetChat = () => {
    if (isLoading) return;

    setMessages([]);
    setInput("");
  };

  return (
    <div className="fiestron-chatbot">

      {/* Floating chatbot button */}
      {!isOpen && (
        <button
          className="chatbot-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open Fiestron Chatbot"
        >
          <MessageCircle size={23} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-window">

          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-brand">

              <div className="chatbot-mark">
                <MessageCircle size={19} />
              </div>

              <div>
                <h3>FIESTRON CHATBOT</h3>

                <div className="chatbot-status">
                  <span className="status-dot" />
                  <span>Here to help</span>
                </div>
              </div>
            </div>

            <div className="chatbot-header-actions">

              <button
                onClick={resetChat}
                disabled={isLoading}
                aria-label="Reset conversation"
                title="New conversation"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
                title="Close"
              >
                <X size={19} />
              </button>

            </div>
          </div>

          {/* Conversation area */}
          <div className="chatbot-messages">

            {/* Welcome screen */}
            {messages.length === 0 && (
              <div className="chatbot-welcome">

                <h2>
                  Hey there! <span>Welcome to Fiestron.</span>
                </h2>

                <p>
                  Curious about the festival? Ask me anything
                  about Fiestron, its theme, or the organising team.
                </p>

                <div className="suggested-questions">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      onClick={() => sendMessage(question)}
                      disabled={isLoading}
                    >
                      {question}
                    </button>
                  ))}
                </div>

              </div>
            )}

            {/* Chat messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.role === "user"
                    ? "user-message"
                    : "assistant-message"
                }`}
              >
                <div className="message-bubble">

                  {message.role === "assistant" ? (
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}

                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="chat-message assistant-message">
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Message input */}
          <form
            className="chatbot-input-area"
            onSubmit={handleSubmit}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about Fiestron..."
              disabled={isLoading}
              maxLength={2000}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <Send size={17} />
            </button>

          </form>

        </div>
      )}
    </div>
  );
}