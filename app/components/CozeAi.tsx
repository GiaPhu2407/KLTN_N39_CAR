'use client'
import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircleQuestion, X } from 'lucide-react';

// Previous interfaces remain the same
interface CozeConfig {
  bot_id: string;
}

interface CozeComponentProps {
  title: string;
}

interface CozeWebChatClientProps {
  config: CozeConfig;
  componentProps: CozeComponentProps;
}

declare global {
  interface Window {
    CozeWebSDK?: {
      WebChatClient: new (props: CozeWebChatClientProps) => void;
    };
  }
}

const CozeChat: React.FC = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [isCozeLoaded, setIsCozeLoaded] = useState(false);
  const [isCozeInitialized, setIsCozeInitialized] = useState(false);
  const pathname = usePathname();
  const cozeClientRef = useRef<any>(null);

  // Check if the current route is excluded from showing the chat
  const isExcludedRoute = 
    pathname === '/dashboard' ||
    pathname === '/Login' ||
    pathname === '/Register';

  // Function to initialize Coze client
  const initializeCozeClient = () => {
    if (window.CozeWebSDK && !isCozeInitialized) {
      cozeClientRef.current = new window.CozeWebSDK.WebChatClient({
        config: {
          bot_id: '7444521155333636114',
        },
        componentProps: {
          title: 'Vinfast Advisor',
        },
      });
      setIsCozeInitialized(true);
    }
  };

  // Load Coze SDK script
  useEffect(() => {
    if (isCozeLoaded) return;

    const existingScript = document.querySelector('script[src*="chat-app-sdk"]');
    if (existingScript) {
      setIsCozeLoaded(true);
      initializeCozeClient();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.0.0-beta.4/libs/oversea/index.js';
    script.async = true;
    
    script.onload = () => {
      setIsCozeLoaded(true);
      initializeCozeClient();
    };

    script.onerror = () => {
      console.error('Failed to load Coze SDK');
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // We don't remove the script on cleanup to preserve the SDK between route changes
    };
  }, [isCozeLoaded]);

  // Re-initialize client on route change if needed
  useEffect(() => {
    if (isCozeLoaded && !isCozeInitialized) {
      initializeCozeClient();
    }
  }, [pathname, isCozeLoaded, isCozeInitialized]);

  // Toggle chat visibility based on route
  useEffect(() => {
    const chatContainer = document.getElementById('coze-chat-container');
    if (chatContainer) {
      if (isExcludedRoute) {
        chatContainer.style.display = 'none';
      } else {
        chatContainer.style.display = 'block';
      }
    }
  }, [pathname, isExcludedRoute]);

  // Handle notification click
  const handleNotificationClick = () => {
    // Find and click the Coze chat button to open the chat
    const chatButton = document.querySelector('.coze-chat-button');
    if (chatButton && chatButton instanceof HTMLElement) {
      chatButton.click();
    }
    setShowNotification(false);
  };

  // Render notification component
  const AiAdvisoryNotification = () => {
    if (isExcludedRoute || !showNotification) return null;

    return (
      <div className="fixed bottom-24 right-4 max-w-xs bg-white shadow-lg rounded-lg p-4 border flex items-start z-40 cursor-pointer" onClick={handleNotificationClick}>
        <MessageCircleQuestion className="text-blue-600 mr-3 flex-shrink-0" size={24} />
        <div className="flex-grow">
          <p className="text-sm font-medium text-gray-900 mb-1">
            Tư vấn bằng Ai
          </p>
          <p className="text-xs text-gray-500">
            Nhấn để mở trò chuyện
          </p>
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600" 
          onClick={(e) => {
            e.stopPropagation();
            setShowNotification(false);
          }}
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  return (
    <>
      <div id="coze-chat-container" style={{ display: isExcludedRoute ? 'none' : 'block' }}></div>
      <AiAdvisoryNotification />
    </>
  );
};

export default CozeChat;