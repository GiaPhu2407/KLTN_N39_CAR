'use client'
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircleQuestion, X } from 'lucide-react';

const CozeChat: React.FC = () => {
  // Render notification component
  const AiAdvisoryNotification = () => {

    return (
      <div className="fixed bottom-24 right-4  max-w-xs bg-white shadow-lg rounded-lg p-4 border flex items-start">
        <MessageCircleQuestion className="text-blue-600 mr-3 z-30 flex-shrink-0" size={24} />
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">
            Tư vấn bằng Ai
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div id="coze-chat-container"></div>
      <AiAdvisoryNotification />
    </div>
  );
};

export default CozeChat;