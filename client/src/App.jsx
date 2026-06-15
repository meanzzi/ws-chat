// 닉네임 유무에 따라 닉네임 입력 화면과 채팅방 화면을 전환
import { useState } from 'react';
import NicknameForm from './components/NicknameForm.jsx';

function App() {
  const [nickname, setNickname] = useState('');

  // 닉네임이 없으면 입력 화면, 있으면 채팅방 (5단계에서 추가 예정)
  if (!nickname) {
    return <NicknameForm onSubmit={setNickname} />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-500">{nickname} 님 입장 — 채팅방 준비 중</p>
    </div>
  );
}

export default App;
