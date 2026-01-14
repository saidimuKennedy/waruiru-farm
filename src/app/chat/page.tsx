"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, PlusCircle, History, Trash2 } from "lucide-react"; // Removed Leaf, as we're using the profile pic
import { ChatMessage, ChatSession, SessionHistory } from "@/types/chat";
import ChatInput from "@/components/chat/chat-input";
import useChat from "@/hooks/use-chat";
import MessageList from "@/components/chat/message-list";
import SessionHistorySidebar from "@/components/chat/session-sidebar";
import Image from 'next/image'; // Import Next.js Image component

// Assuming Waruiru's profile picture is in the /public folder
const WARUIRU_PROFILE_PIC = '/farm_dr.png'; 

/**
 * Chat interface page for the AI Farm Doctor.
 * Manages chat sessions, history, and message input.
 * Integrates with the `useChat` hook.
 */
const ChatPage = () => {
  const {
    session,
    chatHistory,
    sessionList,
    isLoading,
    isHistoryLoading,
    authStatus,
    loadSession,
    startNewSession,
    fetchSessionList,
    handleDeleteSession,
    sendMessage,
  } = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-green-50">
      <div className="flex flex-col h-screen font-sans max-w-7xl mx-auto">
        {/* Header Area: Fixed height, never scrolls */}
        <header className="flex items-center p-4 mt-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-20 ">
          <SessionHistorySidebar
            isOpen={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
            sessionList={sessionList}
            currentSessionId={session?.id}
            isLoading={isLoading}
            authStatus={authStatus}
            onLoadSession={loadSession}
            onNewSession={startNewSession}
            fetchSessionList={fetchSessionList}
            onDeleteSession={handleDeleteSession}
          />

          {/* Updated: This is Waruiru's profile picture and title */}
          <div className="flex items-center space-x-3 mr-auto"> {/* Added mr-auto */}
            <Image
                src={WARUIRU_PROFILE_PIC}
                alt="Waruiru, Farm Doctor"
                width={40} // Adjust size as needed
                height={40} // Adjust size as needed
                className="rounded-full object-cover"
            />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Farm Doctor
            </h1>
          </div>

          <button
            onClick={startNewSession}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-150 shadow-md disabled:bg-gray-400 ml-auto text-sm md:text-base"
          >
            <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden lg:block">New Chat</span>
          </button>
        </header>

        <main className="flex-grow overflow-y-auto pt-4 px-2 no-scrollbar">
          <MessageList
            chatHistory={chatHistory as ChatMessage[]}
            isLoading={isLoading}
          />
        </main>

        {/* Chat Input - Fixed height, never scrolls */}
        <footer className="flex-shrink-0">
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;