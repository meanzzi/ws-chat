import { useEffect, useRef, useState } from 'react';

// WebSocket 연결·송수신·종료를 담당하는 커스텀 훅
// 반환값: { messages, sendMessage, isConnected }
export function useWebSocket(nickname) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // 연결 수립 시 서버에 닉네임 등록
    socket.onopen = () => {
      setIsConnected(true);
      socket.send(JSON.stringify({ type: 'join', nickname }));
    };

    // 서버로부터 메시지 수신 시 messages 배열에 추가
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    // 연결 종료 또는 에러 발생 시 연결 상태 false로 변경
    socket.onclose = () => setIsConnected(false);
    socket.onerror = () => setIsConnected(false);

    // 컴포넌트 언마운트 시 소켓 정리
    return () => socket.close();
  }, [nickname]);

  // 서버로 메시지 전송
  function sendMessage(text) {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'message', text }));
    }
  }

  return { messages, sendMessage, isConnected };
}
