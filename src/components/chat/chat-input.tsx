"use client";

import { PlusCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleFileUpload = () => {
    console.log("Image upload functionality is pending development!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-green-50 w-full max-w-4xl mx-auto flex-shrink-0"
    >
      <div className="flex items-center space-x-3">
        {/* Camera/Upload Icon */}
        <button
          type="button"
          onClick={handleFileUpload}
          className="text-green-600 hover:text-green-600 p-2 rounded-full transition disabled:opacity-50 flex-shrink-0"
          aria-label="Upload Image"
          disabled={isLoading}
        >
          <PlusCircle className="w-7 h-7" />
        </button>

        {/* Input Field */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your crop symptoms or upload a picture..."
          className="flex-grow p-4 border border-green-600 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:bg-gray-50"
          disabled={isLoading}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`p-3 rounded-full text-white transition duration-200 flex items-center justify-center w-12 h-12 flex-shrink-0
            ${
              !input.trim() || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          aria-label="Send Message"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 -rotate-45"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};
export default ChatInput;