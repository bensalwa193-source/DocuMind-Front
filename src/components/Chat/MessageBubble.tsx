import React from 'react';
import { useState } from 'react';
import { User, Bot, Copy as CopyIcon, Check } from 'lucide-react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.isUser;
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 rtl:space-x-reverse`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-gray-600'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        
        <div className={`relative rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-white border border-gray-200 text-gray-900'
        }`}>
          {/* Copy button for assistant messages */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute -top-3 -left-3 bg-white border border-gray-200 shadow-sm rounded-full p-1.5 hover:bg-gray-50"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4 text-gray-600" />}
            </button>
          )}

          {/* Message text with collapse/expand */}
          <div className={`text-sm leading-relaxed whitespace-pre-wrap ${!isUser ? 'prose prose-sm max-w-none' : ''}`}>
            {expanded || message.text.length <= 600 ? (
              <>{message.text}</>
            ) : (
              <>
                {message.text.slice(0, 600)}…
                <button
                  className="ml-2 text-blue-600 hover:text-blue-700 text-xs underline"
                  onClick={() => setExpanded(true)}
                >
                  Show more
                </button>
              </>
            )}
          </div>
          
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.citations.map((citation, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 text-[11px] rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {citation}
                </span>
              ))}
            </div>
          )}
          
          <p className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-400'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;