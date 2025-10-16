"use client";

import { SessionHistory } from "@/types/chat";
import { ChatSession, ChatMessage } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState, useRef, useCallback, useEffect } from "react";

const useChat = () => {
  const { data: authSession, status: authStatus } = useSession();
  const currentUserId = authSession?.user?.id ?? undefined;

  const [session, setSession] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [sessionList, setSessionList] = useState<SessionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const isInitialMount = useRef(true);

  // --- 1. Fetch Session List ---
  const fetchSessionList = useCallback(async () => {
    try {
      const response = await fetch(`/api/chat/sessions`);
      if (response.ok) {
        const data = await response.json();
        setSessionList(
          data.map((s: any) => ({
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

  // --- 2. Load Existing Session Messages ---
const loadSession = useCallback(
  async (sessionId: string) => {
    setIsHistoryLoading(true);
    setChatHistory([]);
    setSession(null);

    try {
      // ✅ Correct endpoint name
      const response = await fetch(`/api/chat/message?sessionId=${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch messages for selected session.");

      const data = await response.json();

      // ✅ Handles either { messages: [...] } or plain array
      const messages = Array.isArray(data)
        ? data
        : Array.isArray(data.messages)
        ? data.messages
        : [];

      const formattedMessages = messages.map((msg) => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
      }));

      setChatHistory(formattedMessages);

      const sessionInfo = sessionList.find((s) => s.id === sessionId);
      setSession({
        id: sessionId,
        userId: currentUserId,
        title: sessionInfo?.title ?? null,
        status: "active",
        createdAt: sessionInfo?.createdAt ?? new Date(),
        updatedAt: sessionInfo?.updatedAt ?? new Date(),
      } as ChatSession);
    } catch (error) {
      console.error("Error loading session messages:", error);
      setChatHistory([
        {
          id: crypto.randomUUID(),
          sender: "ASSISTANT",
          text: "Could not load this conversation. Please start a new chat.",
          createdAt: new Date(),
          sessionId,
          userId: currentUserId,
          imageUrl: null,
          suggestedAction: null,
        } as ChatMessage,
      ]);
    } finally {
      setIsHistoryLoading(false);
    }
  },
  [currentUserId, sessionList]
);


  // --- 3. Delete Session ---
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

  // --- 4. Start New Session ---
  const startNewSession = useCallback(async () => {
    setIsLoading(true);
    setChatHistory([]);
    setSession(null);

    try {
      const response = await fetch("/api/chat/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });

      const data = await response.json();
      if (!response.ok || !data.sessionId || !data.welcomeMessage)
        throw new Error(data.message || "Failed to start session.");

      const newSessionId = data.sessionId;

      setSession({
        id: newSessionId,
        userId: currentUserId,
        title: data.title ?? null,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ChatSession);

      const welcomeMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ASSISTANT",
        text: data.welcomeMessage,
        createdAt: new Date(),
        sessionId: newSessionId,
        userId: currentUserId,
        imageUrl: null,
        suggestedAction: null,
      };
      setChatHistory([welcomeMsg]);

      await fetchSessionList();
    } catch (error) {
      console.error("Error starting new session:", error);
      setChatHistory([
        {
          id: crypto.randomUUID(),
          sender: "ASSISTANT",
          text: `**ERROR:** Could not start chat. ${String(error)}`,
          createdAt: new Date(),
          sessionId: "",
          userId: currentUserId,
          imageUrl: null,
          suggestedAction: null,
        } as ChatMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, fetchSessionList]);

  // --- 5. Send Message ---
  const sendMessage = async (messageText: string) => {
  if (!session?.id) return;

  const newUserMessage: ChatMessage = {
    id: crypto.randomUUID(),
    sender: "USER",
    text: messageText,
    createdAt: new Date(),
    sessionId: session.id,
    userId: currentUserId,
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

    const data = await response.json();
    if (!response.ok || !data.assistantMessage)
      throw new Error(data.message || "Error processing message.");

    const newAssistantMessage: ChatMessage = {
      id: data.messageId || crypto.randomUUID(),
      sender: "ASSISTANT",
      text: data.assistantMessage,
      createdAt: new Date(),
      sessionId: session.id,
      userId: currentUserId,
      imageUrl: null,
      suggestedAction: null,
    };
    setChatHistory((prev) => [...prev, newAssistantMessage]);

    // 🧠 If this is the *first user message*, use it as the session title
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

      // locally update title
      setSession((prev) =>
        prev ? { ...prev, title: titleSnippet } : prev
      );
      await fetchSessionList();
    }
  } catch (error) {
    console.error("Chat API error:", error);
    const errorMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "ASSISTANT",
      text: `**Service Alert:** I hit an issue. Check your console for details.`,
      createdAt: new Date(),
      sessionId: session.id,
      userId: currentUserId,
      imageUrl: null,
      suggestedAction: null,
    };
    setChatHistory((prev) => [...prev, errorMsg]);
  } finally {
    setIsLoading(false);
  }
};


  // --- 6. Initial Mount ---
  useEffect(() => {
    if (authStatus !== "loading" && isInitialMount.current) {
      isInitialMount.current = false;
      startNewSession();
    }
  }, [authStatus, startNewSession]);

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
