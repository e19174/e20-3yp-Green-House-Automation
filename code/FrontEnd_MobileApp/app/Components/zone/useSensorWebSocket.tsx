// src/hooks/useSensorWebSocket.ts
import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useSensorWebSocket = (deviceId: number | undefined, onData: (data: any) => void ) => {
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    if (!deviceId) return;

    const socket = new SockJS('http://192.168.155.83:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe(`/topic/device/${deviceId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log("WebSocket Data:", data);
          onData(data);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      stompClient.current?.deactivate();
      console.log('WebSocket disconnected');
    };
  }, [deviceId]);
};
