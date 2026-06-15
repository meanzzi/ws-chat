// 닉네임 유무에 따라 닉네임 입력 화면과 채팅방 화면을 전환
import { useState } from 'react';

function App() {
  const [nickname, setNickname] = useState('');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-500">설정 확인용 — Tailwind 동작 중</p>
    </div>
  );
}

export default App;
