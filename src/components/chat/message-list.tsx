"use client";

import MessageBubble from "@/components/chat/message-bubble";
import { ChatMessage } from "@/types/chat";
import { useRef, useEffect } from "react";
import DiagnosingTrain from "./loading-animation";

interface MessageListProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
}

/**
 * Renders the list of chat messages and auto-scrolls to the bottom.
 *
 * @param {ChatMessage[]} chatHistory - The array of messages to display.
 * @param {boolean} isLoading - Whether a response is being generated (shows loading animation).
 */
const MessageList: React.FC<MessageListProps> = ({
  chatHistory,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever history or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  return (
    <div className="max-w-7xl mx-auto h-full">
      {chatHistory.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading &&
        chatHistory.length > 0 &&
        chatHistory.slice(-1)[0]?.sender === "USER" && (
          <div className="flex justify-start">
            <div className="bg-gray-200 p-3 rounded-xl rounded-tl-none mr-auto max-w-[60%] shadow-md mb-6">
              <DiagnosingTrain />
            </div>
          </div>
        )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
