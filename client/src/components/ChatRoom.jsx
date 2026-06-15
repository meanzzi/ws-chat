import { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket.js';

// 채팅방 화면 — 메시지 목록, 입력창, 연결 상태 배너를 포함
function ChatRoom({ nickname }) {
  const { messages, sendMessage, isConnected } = useWebSocket(nickname);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  // 새 메시지가 도착할 때마다 자동으로 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    sendMessage(text);
    setText('');
  }

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-lg flex flex-col h-screen">

        {/* 헤더 */}
        <header className="bg-[#bdbbff] px-4 py-3 flex items-center justify-between shrink-0">
          <span className="text-white font-bold text-lg">💬 채팅방</span>
          <span className="text-white text-sm">{nickname}</span>
        </header>

        {/* 연결 끊김 배너 — isConnected가 false일 때만 표시 */}
        {!isConnected && (
          <div className="bg-red-50 text-red-500 text-sm text-center py-2 shrink-0">
            연결이 끊겼습니다
          </div>
        )}

        {/* 메시지 목록 */}
        <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">

          {/* 메시지가 없을 때 안내 문구 */}
          {messages.length === 0 && (
            <p className="text-gray-400 text-sm text-center mt-8">
              대화를 시작해보세요 👋
            </p>
          )}

          {messages.map((msg, index) => {
            // 내 메시지는 오른쪽, 상대 메시지는 왼쪽 정렬
            const isMine = msg.nickname === nickname;

            return (
              <div
                key={index}
                className={`flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}
              >
                {/* 상대방 닉네임 — 상대 메시지에만 표시 */}
                {!isMine && (
                  <span className="text-xs text-gray-500 px-1">{msg.nickname}</span>
                )}

                <div className={`flex items-end gap-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* 메시지 버블 */}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words ${
                      isMine
                        ? 'bg-[#bdbbff] text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* 타임스탬프 */}
                  <span className="text-xs text-gray-400 shrink-0">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}

          {/* 자동 스크롤 앵커 */}
          <div ref={bottomRef} />
        </main>

        {/* 입력창 — 하단 고정 */}
        <footer className="px-4 py-3 border-t border-gray-100 flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#bdbbff] focus:ring-2 focus:ring-[#bdbbff]/30 transition"
          />
          <button
            onClick={handleSend}
            className="bg-[#bdbbff] hover:bg-[#a8a6f0] text-white text-sm font-semibold px-4 py-2 rounded-xl transition shrink-0"
          >
            전송
          </button>
        </footer>

      </div>
    </div>
  );
}

export default ChatRoom;
