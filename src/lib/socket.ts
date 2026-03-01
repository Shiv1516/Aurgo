import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://aurgo-backend-1.onrender.com";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('augeo_token') : null;

  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });
  } else if (socket.auth && (socket.auth as any).token !== token) {
    // Update token if it has changed
    socket.auth = { token };
    socket.disconnect().connect();
    console.log('Socket reconnected with new token');
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinAuction = (auctionId: string): Socket => {
  const s = getSocket();
  s.emit('auction:join', auctionId);
  return s;
};

export const leaveAuction = (auctionId: string): Socket => {
  const s = getSocket();
  s.emit('auction:leave', auctionId);
  return s;
};

export const joinUserRoom = (userId: string): Socket => {
  const s = getSocket();
  s.emit('user:join', userId);
  return s;
};

export default getSocket;
