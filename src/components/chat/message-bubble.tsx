import React from 'react';
import { ChatMessage } from '@/types/chat';

interface MessageBubbleProps {
    message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'USER';

    // Tailwind classes for alignment
    const containerClasses = isUser 
        ? 'flex justify-end' 
        : 'flex justify-start';

    // Tailwind classes for styling the bubble itself
    const bubbleClasses = isUser
        ? 'bg-green-600 text-white rounded-xl rounded-br-none ml-auto shadow-lg'
        : 'bg-white text-gray-800 rounded-xl rounded-tl-none mr-auto shadow-md border border-gray-100';

    // Simple markdown conversion for **bold** text, essential for LLM output
    const renderText = (text: string) => {
        // Simple replacement for **bold** tags
        const htmlContent = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <p 
            className="text-sm leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />;
    };

    return (
        <div className={`my-3 ${containerClasses}`}>
            <div className={`p-4 max-w-lg md:max-w-xl ${bubbleClasses}`}>
                <div className="text-lg font-semibold opacity-80 mb-1">
                    {isUser ? 'You' : 'Farm Doctor'}
                </div>

                {renderText(message.text)}
                
                {/* Placeholder for actual image rendering */}
                {message.imageUrl && (
                    <div className="mt-3 border-t border-gray-300 pt-2">
                        <p className="text-xs italic opacity-70">Image uploaded for diagnosis.</p>
                    </div>
                )}

                <div className="text-right mt-1 text-[10px] opacity-60">
                    {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
