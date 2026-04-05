'use client';

import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import toast from 'react-hot-toast';
import React from 'react';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated, user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();
    socketRef.current = socket;

    if (user && socket) {
      socket.emit('user:join', user._id);
    }

    if (socket) {
      socket.on('notification', (notification) => {
      addNotification(notification);
      
      // Real-time toast feedback
      const toastOptions = {
        duration: 6000,
        icon: notification.type === 'outbid' ? '📢' : 
              notification.type === 'payment_confirmed' ? '💳' :
              notification.type === 'auction_won' ? '🏆' : '🔔'
      };

      toast(
        (t) => (
          <div className="flex flex-col gap-1">
            <p className="font-black uppercase tracking-tight text-sm text-white">{notification.title}</p>
            <p className="text-sm text-white/70 line-clamp-2">{notification.message}</p>
          </div>
        ) as any,
        { ...toastOptions, style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(201, 168, 76, 0.2)' } }
      );
    });
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user, addNotification]);

  return socketRef.current;
}
