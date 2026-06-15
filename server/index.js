import 'dotenv/config';
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: PORT });

// 현재 연결된 클라이언트를 저장하는 Set
// 각 항목: { socket, nickname }
const clients = new Set();

console.log(`WebSocket 서버 실행 중 (port: ${PORT})`);

wss.on('connection', (socket) => {
  // 새 클라이언트 연결 시 Set에 추가
  const client = { socket, nickname: null };
  clients.add(client);

  // 클라이언트로부터 메시지 수신
  socket.on('message', (data) => {
    let parsed;

    try {
      parsed = JSON.parse(data);
    } catch {
      return;
    }

    if (parsed.type === 'join') {
      // 닉네임 등록
      client.nickname = parsed.nickname;
    }

    if (parsed.type === 'message') {
      // 연결된 모든 클라이언트에게 메시지 브로드캐스트
      const payload = JSON.stringify({
        type: 'message',
        nickname: client.nickname,
        text: parsed.text,
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      });

      for (const c of clients) {
        if (c.socket.readyState === c.socket.OPEN) {
          c.socket.send(payload);
        }
      }
    }
  });

  // 클라이언트 연결 종료 시 Set에서 제거
  socket.on('close', () => {
    clients.delete(client);
  });
});
