"use client";

import { SessionHistory } from "@/types/chat";
import { ChatSession, ChatMessage, MessageSender } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState, useRef, useCallback, useEffect } from "react";

type APIChatMessage = Omit<ChatMessage, 'createdAt'> & {
  createdAt: string;
};

interface LoadSessionResponse {
  messages: APIChatMessage[];
}

interface StartNewSessionResponse {
  sessionId: string;
  welcomeMessage: string;
  title: string | null;
  message: string;
}

interface UseChatReturn {
  session: ChatSession | null;
  chatHistory: ChatMessage[];
  sessionList: SessionHistory[];
  isLoading: boolean;
  isHistoryLoading: boolean;
  authStatus: "loading" | "authenticated" | "unauthenticated";
  fetchSessionList: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  startNewSession: () => Promise<void>;
  handleDeleteSession: (e: React.MouseEvent, sessionId: string) => Promise<void>;
  sendMessage: (messageText: string) => Promise<void>;
}

const useChat = (): UseChatReturn => {
  const { data: authSession, status: authStatus } = useSession();
  const currentUserId = authSession?.user?.id; 

  const [session, setSession] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [sessionList, setSessionList] = useState<SessionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const isInitialMount = useRef(true);

  const fetchSessionList = useCallback(async () => {
    try {
      const response = await fetch(`/api/chat/sessions`);
      if (response.ok) {
        const data: SessionHistory[] = await response.json(); 
        setSessionList(
          data.map((s) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt),
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching session list:", error);
    }
  }, []);

  const loadSession = useCallback(
    async (sessionId: string) => {
      setIsHistoryLoading(true);
      setChatHistory([]);
      setSession(null);

      try {
        const response = await fetch(`/api/chat/message?sessionId=${sessionId}`);
        if (!response.ok) throw new Error("Failed to fetch messages for selected session.");

        const data = await response.json() as APIChatMessage[] | LoadSessionResponse; 

        const messages = Array.isArray(data)
          ? data
          : Array.isArray(data.messages)
          ? data.messages
          : [];

        const formattedMessages: ChatMessage[] = messages.map((msg) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        }));

        setChatHistory(formattedMessages);

        const sessionInfo = sessionList.find((s) => s.id === sessionId);
        
        const newSession: ChatSession = {
          id: sessionId,
          userId: currentUserId ?? null, 
          title: sessionInfo?.title ?? null,
          status: "active", 
          createdAt: sessionInfo?.createdAt ? new Date(sessionInfo.createdAt) : new Date(),
          updatedAt: sessionInfo?.updatedAt ? new Date(sessionInfo.updatedAt) : new Date(),
        };
        setSession(newSession);
      } catch (error) {
        console.error("Error loading session messages:", error);
        
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          sessionId,
          userId: currentUserId ?? null,
          sender: MessageSender.ASSISTANT, 
          text: "Could not load this conversation. Please start a new chat.",
          createdAt: new Date(),
          imageUrl: null,
          suggestedAction: null,
        };
        setChatHistory([errorMsg]);
      } finally {
        setIsHistoryLoading(false);
      }
    },
    [currentUserId, sessionList]
  );

  const handleDeleteSession = async (
    e: React.MouseEvent,
    sessionId: string
  ) => {
    e.stopPropagation();

    const originalSessionList = [...sessionList];
    setSessionList((prev) => prev.filter((s) => s.id !== sessionId));

    try {
      const response = await fetch(`/api/chat/sessions?sessionId=${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete session.");

      if (session?.id === sessionId) startNewSession();
    } catch (error) {
      console.error("Error deleting session:", error);
      setSessionList(originalSessionList);
    }
  };

  const startNewSession = useCallback(async () => {
    if (!currentUserId) return; 

    setIsLoading(true);
    setChatHistory([]);
    setSession(null);

    try {
      const response = await fetch("/api/chat/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });

      const data: StartNewSessionResponse = await response.json(); 
      if (!response.ok || !data.sessionId || !data.welcomeMessage)
        throw new Error(data.message || "Failed to start session.");

      const newSessionId = data.sessionId;

      const newSession: ChatSession = {
        id: newSessionId,
        userId: currentUserId,
        title: data.title ?? null,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSession(newSession);

      const welcomeMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId: newSessionId,
        userId: currentUserId,
        sender: MessageSender.ASSISTANT,
        text: data.welcomeMessage,
        createdAt: new Date(),
        imageUrl: null,
        suggestedAction: null,
      };
      setChatHistory([welcomeMsg]);

      await fetchSessionList();
    } catch (error) {
      console.error("Error starting new session:", error);
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId: "",
        userId: currentUserId ?? null,
        sender: MessageSender.ASSISTANT,
        text: `**ERROR:** Could not start chat. ${String(error)}`,
        createdAt: new Date(),
        imageUrl: null,
        suggestedAction: null,
      };
      setChatHistory([errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, fetchSessionList]);

  const sendMessage = async (messageText: string) => {
  if (!session?.id || !currentUserId) return;

  const newUserMessage: ChatMessage = {
    id: crypto.randomUUID(),
    sessionId: session.id,
    userId: currentUserId,
    sender: MessageSender.USER,
    text: messageText,
    createdAt: new Date(),
    imageUrl: null,
    suggestedAction: null,
  };
  setChatHistory((prev) => [...prev, newUserMessage]);
  setIsLoading(true);

  try {
    const response = await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session.id,
        userMessage: messageText,
      }),
    });

    const data: { assistantMessage: string; messageId: string; message: string; } = await response.json();
    if (!response.ok || !data.assistantMessage)
      throw new Error(data.message || "Error processing message.");

    const newAssistantMessage: ChatMessage = {
      id: data.messageId || crypto.randomUUID(),
      sessionId: session.id,
      userId: currentUserId,
      sender: MessageSender.ASSISTANT,
      text: data.assistantMessage,
      createdAt: new Date(),
      imageUrl: null,
      suggestedAction: null,
    };
    setChatHistory((prev) => [...prev, newAssistantMessage]);

    if (!session.title || session.title.match(/^\d{4}-\d{2}-\d{2}/)) {
      const titleSnippet = messageText
        .split(" ")
        .slice(0, 6)
        .join(" ")
        .replace(/[^\w\s]/g, "")
        .trim();

      await fetch(`/api/chat/sessions/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleSnippet }),
      });

      setSession((prev) =>
        prev ? { ...prev, title: titleSnippet } : prev
      );
      await fetchSessionList();
    }
  } catch (error) {
    console.error("Chat API error:", error);
    const errorMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sessionId: session.id,
      userId: currentUserId ?? null,
      sender: MessageSender.ASSISTANT,
      text: `**Service Alert:** I hit an issue. Check your console for details.`,
      createdAt: new Date(),
      imageUrl: null,
      suggestedAction: null,
    };
    setChatHistory((prev) => [...prev, errorMsg]);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    if (authStatus !== "loading" && isInitialMount.current && currentUserId) {
      isInitialMount.current = false;
      startNewSession();
    }
  }, [authStatus, startNewSession, currentUserId]);

  return {
    session,
    chatHistory,
    sessionList,
    isLoading,
    isHistoryLoading,
    authStatus,
    fetchSessionList,
    loadSession,
    startNewSession,
    handleDeleteSession,
    sendMessage,
  };
};

export default useChat;