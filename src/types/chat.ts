export interface ChatMessage {
  id: string;
  sender: "USER" | "ASSISTANT";
  text: string;
  createdAt: Date;
  imageUrl?: string;
  suggestedAction?: any;
}

export interface ChatSession {
  id: string;
  userId: string | null;
  title: string | null;
  messages: ChatMessage[];
  status: string;
  createdAt: Date;
}

export interface SessionHistory {
  id: string;
  createdAt: Date | string;
  title: string;
}
