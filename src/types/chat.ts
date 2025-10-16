export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string | null;
  sender: "USER" | "ASSISTANT"; // Matches MessageSender enum
  text: string;
  createdAt: Date;
  imageUrl: string | null;
  suggestedAction: any | null; // Represents Prisma Json? field
}

export interface ChatSession {
  id: string;
  userId: string | null;
  title: string | null;
  status: string; // Matches Prisma String field (default: "active")
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionHistory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string | null;
}