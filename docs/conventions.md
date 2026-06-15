# 개발 컨벤션

## 패키지 매니저

- `npm` 사용
- 패키지 설치 시 `npm install`, 실행 시 `npm run dev`

## 린터 / 포매터

- ESLint + Prettier 사용 (client에만 적용)
- 저장 시 자동 포매팅 권장

## 환경변수

- `.env` 파일로 설정값 관리
- `.env` 파일은 `.gitignore`에 추가
- `.env.example` 파일을 함께 작성해 필요한 키 문서화 (실제 값은 작성하지 않음)

## 커밋 메시지

- **영어 + Conventional Commits** 형식

```
feat: add nickname form
fix: prevent duplicate websocket connection
style: apply tailwind responsive layout
chore: add eslint and prettier config
```

| prefix     | 용도                     |
| ---------- | ------------------------ |
| `feat`     | 새 기능                  |
| `fix`      | 버그 수정                |
| `style`    | UI/스타일 변경           |
| `refactor` | 기능 변경 없는 코드 정리 |
| `chore`    | 설정, 패키지 등 기타     |

## 코드 스타일

- 컴포넌트 파일명: PascalCase (`NicknameForm.jsx`)
- 훅 파일명: camelCase + `use` prefix (`useWebSocket.js`)
- 변수·함수명: camelCase
