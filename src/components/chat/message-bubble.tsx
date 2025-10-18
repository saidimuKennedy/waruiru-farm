import React from 'react';
import { ChatMessage } from '@/types/chat';
import Image from 'next/image'; 

interface MessageBubbleProps {
    message: ChatMessage;
}

const FARM_DOCTOR_PROFILE_PIC = '/farm_dr.png'; 

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'USER';

    const containerClasses = isUser 
        ? 'flex justify-end' 
        : 'flex justify-start';

    const bubbleClasses = isUser
        ? 'bg-green-600 text-white rounded-xl rounded-br-none ml-auto shadow-lg'
        : 'bg-white text-gray-800 rounded-xl rounded-tl-none mr-auto shadow-md border border-gray-100';

    const renderText = (text: string) => {
        const htmlContent = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <p 
            className="text-sm leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />;
    };

    return (
        <div className={`my-3 ${containerClasses} items-start`}> 
            {!isUser && (
                <div className="flex-shrink-0 mr-2 mt-1"> 
                
                    <Image
                        src={FARM_DOCTOR_PROFILE_PIC}
                        alt="Farm Doctor Profile"
                        width={40} 
                        height={40} 
                        className="rounded-full object-cover"
                    />
                </div>
            )}

            <div className={`p-4 mb-2 max-w-lg md:max-w-xl ${bubbleClasses}`}>
                <div className="text-lg font-semibold opacity-80 mb-1">
                    {isUser ? 'You' : 'Dr. Waruiru'}
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
            
            {isUser && ( // You can add a user profile picture here too if desired
                <div className="flex-shrink-0 ml-2 mt-1">
                    {/* <Image
                        src="/user_profile.png" // Replace with your user profile pic
                        alt="User Profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    /> */}
                </div>
            )}
        </div>
    );
};

export default MessageBubble;