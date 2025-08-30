import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';
    socketRef.current = io(SOCKET_URL, { autoConnect: true });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  return socketRef;
}
