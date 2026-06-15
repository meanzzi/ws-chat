# 설계 문서 — 실시간 1:1 WebSocket 채팅방

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 목적 | WebSocket 학습용 1:1 실시간 채팅 구현 |
| 동시 접속 | 최대 2명 |
| 메시지 저장 | 없음 (인메모리, 새 접속 시 초기화) |
| 배포 환경 | 로컬 (localhost) |

---

## 2. 기능 요구사항

### 필수 기능
- 닉네임 입력 후 채팅방 자동 입장
- 텍스트 메시지 전송 (버튼 클릭)
- 상대방 메시지 실시간 수신

### 제외 기능
- 접속자 수 / 목록 표시
- 입장 · 퇴장 시스템 메시지
- 여러 채팅방
- DB 저장 (추후 추가 예정)

---

## 3. 기술 스택

| 역할 | 기술 |
|------|------|
| 프론트엔드 | React + Vite + JavaScript |
| 스타일링 | Tailwind CSS |
| 백엔드 | Node.js + `ws` 패키지 |
| 통신 | WebSocket (`ws://localhost:8080`) |

---

## 4. 폴더 구조

```
C:\chat\
├── client/                  # React 앱 (Vite)
│   ├── src/
│   │   ├── App.jsx           # 화면 전환 (닉네임 입력 ↔ 채팅방)
│   │   ├── components/
│   │   │   ├── NicknameForm.jsx   # 닉네임 입력 화면
│   │   │   └── ChatRoom.jsx       # 채팅 화면
│   │   └── hooks/
│   │       └── useWebSocket.js    # WebSocket 연결·송수신 로직
│   ├── index.html
│   └── package.json
├── server/
│   ├── index.js             # WebSocket 서버
│   └── package.json
└── docs/
    ├── prd.md
    ├── ux.md
    └── design.md
```

---

## 5. 화면 흐름

```
앱 시작
  │
  ▼
[닉네임 입력 화면]
  - 닉네임 텍스트 입력
  - "입장" 버튼 클릭
  │
  ▼ WebSocket 연결 수립 + join 메시지 전송
  │
  ▼
[채팅방 화면]
  - 메시지 목록 (스크롤)
  - 하단 입력창 + "전송" 버튼
  - 탭 닫기 → WebSocket 연결 종료
```

---

## 6. WebSocket 메시지 프로토콜

모든 메시지는 JSON 문자열로 주고받는다.

### 클라이언트 → 서버

| type | 설명 | 페이로드 |
|------|------|---------|
| `join` | 닉네임 등록 | `{ type, nickname }` |
| `message` | 메시지 전송 | `{ type, text }` |

### 서버 → 클라이언트 (브로드캐스트)

| type | 설명 | 페이로드 |
|------|------|---------|
| `message` | 메시지 수신 | `{ type, nickname, text, timestamp }` |

---

## 7. 컴포넌트 설계

### `App.jsx`
- `nickname` 상태를 관리
- `nickname`이 없으면 `<NicknameForm>`, 있으면 `<ChatRoom>` 렌더링

### `NicknameForm.jsx`
- 닉네임 입력 `<input>` (`maxLength={10}`)
- "입장하기" `<button>` (포인트 컬러 `#bdbbff`)
- Enter 키 또는 버튼 클릭으로 제출
- 제출 시 부모(`App`)로 닉네임 전달

### `ChatRoom.jsx`
- `useWebSocket` 훅 사용
- `isConnected === false`이면 상단에 연결 끊김 배너 표시
- 메시지가 없으면 빈 상태 안내 문구 표시
- 메시지 목록: 내 메시지(우, `#bdbbff`) / 상대 메시지(좌, gray-100) + 타임스탬프
- 입력창 + 전송 버튼 (하단 고정)
- 새 메시지 도착 시 자동 스크롤

### `useWebSocket.js` (커스텀 훅)
```
인자: nickname
반환: { messages, sendMessage, isConnected }

내부 동작:
  1. 컴포넌트 마운트 시 new WebSocket('ws://localhost:8080')
  2. onopen    → join 메시지 전송 { type: 'join', nickname }
  3. onmessage → messages 상태에 추가 (timestamp 포함)
  4. onclose / onerror → isConnected = false
  5. 컴포넌트 언마운트 시 socket.close()
```

---

## 8. 서버 설계 (`server/index.js`)

```
WebSocket 서버 포트: 8080

클라이언트 연결 시:
  - clients Set에 { socket, nickname } 추가

메시지 수신 시:
  - type === 'join'    → nickname 저장
  - type === 'message' → 모든 클라이언트에 브로드캐스트
                         { type, nickname, text, timestamp }

연결 종료 시:
  - clients Set에서 제거
```

---

## 9. UI/UX 스펙

### 색상 시스템

| 역할 | 값 | 설명 |
|------|----|------|
| 배경 | `#ffffff` | 전체 배경 (화이트) |
| 포인트 | `#bdbbff` | 버튼, 내 메시지 버블, 액센트 |
| 포인트 (hover) | `#a8a6f0` | 포인트 색 약간 어둡게 |
| 상대 메시지 버블 | `#f3f4f6` (gray-100) | 연한 회색 |
| 텍스트 (기본) | `#111827` (gray-900) | |
| 텍스트 (보조) | `#6b7280` (gray-500) | 타임스탬프 등 |
| 연결 끊김 배너 | `#fef2f2` + `#ef4444` | 연한 빨강 배경 + 빨강 텍스트 |

### 반응형 기준

| 구간 | 기준 | 채팅창 너비 |
|------|------|------------|
| 모바일 | 390px~ (iPhone 14) | 전체 너비 |
| 데스크탑 | 768px~ | 중앙 정렬, `max-w-lg` (512px) |

### 닉네임 입력 화면

```
┌─────────────────────────┐
│                         │
│     채팅방에 입장하기    │  ← 타이틀
│                         │
│  [닉네임 입력  (최대10자)] │
│                         │
│  [       입장하기        ] │  ← 포인트 컬러 버튼
│                         │
└─────────────────────────┘
```
- 닉네임 최대 10자 제한 (`maxLength={10}`)
- Enter 키 또는 버튼 클릭으로 입장

### 채팅방 화면

```
┌─────────────────────────┐
│  💬 채팅방   [닉네임]    │  ← 헤더 (포인트 컬러)
├─────────────────────────┤
│ [연결이 끊겼습니다  배너] │  ← 연결 끊김 시에만 표시
├─────────────────────────┤
│                         │
│  대화를 시작해보세요 👋  │  ← 빈 상태 안내 문구 (메시지 없을 때)
│                         │
│       안녕! 14:32 [상대]│  ← 좌측 정렬, gray-100 버블
│ [나] 반가워요    14:32  │  ← 우측 정렬, #bdbbff 버블
│                         │
├─────────────────────────┤
│ [메시지 입력창    ][전송] │  ← 하단 고정, 전송 버튼 포인트 컬러
└─────────────────────────┘
```
- 메시지 버블: 상대(좌, gray-100) / 나(우, #bdbbff)
- 타임스탬프: 각 버블 하단에 `HH:MM` 형식 (gray-500)
- 새 메시지 도착 시 자동 스크롤 (하단 고정)
- 빈 메시지도 전송 가능 (별도 막지 않음)

---

## 10. 개발 순서

1. 서버 구현 (`server/index.js`) — ws 서버, 브로드캐스트
2. Vite + React 프로젝트 생성 (`client/`)
3. `useWebSocket.js` 훅 구현
4. `NicknameForm.jsx` 구현
5. `ChatRoom.jsx` 구현
6. Tailwind 스타일링 및 반응형 적용
7. 로컬 2탭으로 동작 확인
