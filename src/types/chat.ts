/**
 * Represents a single message within a chat session.
 */
export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string | null;
  sender: "USER" | "ASSISTANT"; 
  text: string;
  createdAt: Date;
  imageUrl: string | null;
  suggestedAction: any | null; 
}

/**
 * Represents a chat session containing multiple messages.
 */
export interface ChatSession {
  id: string;
  userId: string | null;
  title: string | null;
  status: string; 
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a summary of a chat session for history display.
 */
export interface SessionHistory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string | null;
}