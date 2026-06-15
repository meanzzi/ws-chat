// 닉네임 유무에 따라 닉네임 입력 화면과 채팅방 화면을 전환
import { useState } from 'react';
import NicknameForm from './components/NicknameForm.jsx';
import ChatRoom from './components/ChatRoom.jsx';

function App() {
  const [nickname, setNickname] = useState('');

  if (!nickname) {
    return <NicknameForm onSubmit={setNickname} />;
  }

  return <ChatRoom nickname={nickname} />;
}

export default App;
