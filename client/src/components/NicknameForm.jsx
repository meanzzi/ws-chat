import { useState } from 'react';

// 닉네임 입력 화면 — 제출 시 부모(App)로 닉네임 전달
function NicknameForm({ onSubmit }) {
  const [value, setValue] = useState('');

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  // Enter 키 입력 시에도 입장 가능
  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          채팅방에 입장하기
        </h1>

        <input
          type="text"
          placeholder="닉네임을 입력하세요"
          maxLength={10}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#bdbbff] focus:ring-2 focus:ring-[#bdbbff]/30 transition"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-[#bdbbff] hover:bg-[#a8a6f0] text-white font-semibold py-3 rounded-xl transition"
        >
          입장하기
        </button>
      </div>
    </div>
  );
}

export default NicknameForm;
