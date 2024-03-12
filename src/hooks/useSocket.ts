import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (url: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(url);

    setSocket(newSocket);
    console.log('🚀 | useSocket | newSocket:', newSocket.id);

    return () => {
      console.log('🚀 | useSocket | cleanup:', newSocket.id);
      newSocket.disconnect();
    };
  }, [url]);

  return socket;
};

export default useSocket;
