"use client";
import { SessionHistory } from "@/types/chat";
import { PlusCircle, Trash2, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";

const formatDate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface SessionHistorySidebarProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  sessionList: SessionHistory[];
  currentSessionId: string | null | undefined;
  isLoading: boolean;
  authStatus: "loading" | "authenticated" | "unauthenticated";
  onLoadSession: (sessionId: string) => void;
  onNewSession: () => void;
  fetchSessionList: () => void;
  onDeleteSession: (e: React.MouseEvent, sessionId: string) => void;
}

/**
 * Sidebar component for managing chat sessions.
 * Allows creating new sessions, switching between history, and deleting sessions.
 *
 * @param {boolean} isOpen - Whether the sidebar sheet is open.
 * @param {function} onOpenChange - Callback to toggle sidebar visibility.
 * @param {SessionHistory[]} sessionList - List of past chat sessions.
 * @param {string | null | undefined} currentSessionId - ID of the active session.
 * @param {boolean} isLoading - Whether the app is currently loading data.
 * @param {string} authStatus - Current authentication status (loading, authenticated, unauthenticated).
 * @param {function} onLoadSession - Callback to load a specific session.
 * @param {function} onNewSession - Callback to start a new session.
 * @param {function} fetchSessionList - Callback to refresh the session list.
 * @param {function} onDeleteSession - Callback to delete a session.
 */
const SessionHistorySidebar: React.FC<SessionHistorySidebarProps> = ({
  isOpen,
  onOpenChange,
  sessionList,
  currentSessionId,
  isLoading,
  authStatus,
  onLoadSession,
  onNewSession,
  fetchSessionList,
  onDeleteSession,
}) => {
  const router = useRouter();

  const handleLoadSession = (sessionId: string) => {
    onLoadSession(sessionId);
    onOpenChange(false); 
  };

  const handleNewSession = () => {
    onNewSession();
    onOpenChange(false); 
  };

  const handleOpenChange = (open: boolean) => {
    if (open && authStatus === "authenticated") {
      fetchSessionList();
    }
    onOpenChange(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          className="p-2 mr-3 text-gray-600 hover:text-green-600 flex-shrink-0"
          aria-label="Open History"
        >
          <History className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 sm:w-80">
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-lg font-semibold text-green-700">
              <History className="w-5 h-5" />
              <span>Recent Chats</span>
            </div>
          </div>

          <button
            onClick={handleNewSession}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 w-full mt-4 mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150 shadow-md disabled:bg-gray-400"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Diagnosis</span>
          </button>

          {authStatus === "authenticated" ? (
            <div className="flex-grow overflow-y-auto space-y-2 pr-2 no-scrollbar">
              {sessionList.map((s) => (
                <div key={s.id} className="group relative">
                  <div
                    onClick={() => handleLoadSession(s.id)}
                    className={`p-3 rounded-lg cursor-pointer transition duration-150 
                      ${
                        currentSessionId === s.id
                          ? "bg-green-100 text-green-800 font-medium "
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    <p className="text-sm truncate">{s.title}</p>
                    <p
                      className={`text-xs mt-0.5 ${
                        currentSessionId === s.id
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {formatDate(s.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => onDeleteSession(e, s.id)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {sessionList.length === 0 && !isLoading && (
                <p className="text-center text-sm text-gray-400 mt-8">
                  No recent chats found.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4 flex-grow">
              <p className="text-sm text-gray-500 mb-4">
                Sign in to save and view your chat history.
              </p>
              <button
                onClick={() => router.push("/auth/login")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SessionHistorySidebar;
