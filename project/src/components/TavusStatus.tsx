import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Maximize2, Minimize2, Settings } from 'lucide-react';

const TavusStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    // Monitor Tavus connection status
    const checkConnection = () => {
      if (window.tavusCallFrame) {
        setIsConnected(true);
        // You can add more sophisticated status checking here
      } else {
        setIsConnected(false);
      }
    };

    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleMinimize = () => {
    if (window.tavusCallFrame) {
      if (isMinimized) {
        // Restore video frame
        window.tavusCallFrame.updateInputSettings({
          camera: true,
          microphone: true
        });
      } else {
        // Minimize video frame
        window.tavusCallFrame.updateInputSettings({
          camera: false,
          microphone: false
        });
      }
      setIsMinimized(!isMinimized);
    }
  };

  const endCall = () => {
    if (window.tavusCallFrame) {
      window.tavusCallFrame.leave();
      window.tavusCallFrame.destroy();
      window.tavusCallFrame = null;
      setIsConnected(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <VideoOff className="w-4 h-4" />
          <span className="text-sm">AI Chat Offline</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Video className="w-4 h-4" />
          <span className="text-sm font-medium">AI Chat Active</span>
          {participantCount > 0 && (
            <span className="text-xs bg-green-500 px-2 py-1 rounded-full">
              {participantCount} connected
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-green-500 rounded transition-colors"
            title={isMinimized ? 'Restore video' : 'Minimize video'}
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>
          
          <button
            onClick={endCall}
            className="p-1 hover:bg-red-500 rounded transition-colors"
            title="End call"
          >
            <VideoOff className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TavusStatus;