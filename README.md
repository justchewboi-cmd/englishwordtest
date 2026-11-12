# 나만의 영어 단어장 (VocaBook)

Firebase와 React + Vite 기반의 나만의 영어 단어장 웹 애플리케이션입니다.

## ✨ 주요 기능

1. **Google 계정 로그인 / 로그아웃**
   - Firebase Authentication(Google Auth Provider)을 통한 안전하고 간편한 원클릭 소셜 로그인
2. **단어 CRUD (생성, 조회, 수정, 삭제)**
   - 영어 단어, 한글 뜻, 예문, 외움 여부(체크박스)를 사용자가 직접 등록/수정/삭제
3. **Firestore 실시간 동기화**
   - `users/{userId}/words/{wordId}` 경로로 각 사용자별 격리 저장
   - 실시간 리스너(`onSnapshot`)를 적용하여 어떤 기기에서도 즉시 동기화
4. **암기 상태 관리 & 통계**
   - 암기 달성률 게이지 바 및 학습 중 / 외움 완료 개수 통계 제공
   - 상태별 필터링(전체, 학습 중, 외움 완료) 및 실시간 검색 지원
5. **원어민 발음 듣기 (TTS)**
   - Web Speech API를 활용하여 등록된 영어 단어 및 예문 음성 듣기 기능 내장
6. **강력한 Firestore 보안 규칙 (`firestore.rules`)**
   - 각 사용자 본인의 데이터(`request.auth.uid == userId`)만 조회 및 수정할 수 있도록 엄격한 접근 제어 적용

---

## 🚀 로컬 실행 방법

### 1. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173`으로 접속합니다.

### 2. 프로덕션 빌드
```bash
npm run build
```

---

## ⚙️ 환경변수 설정 (`.env`)

프로젝트 루트의 `.env` 파일에 Firebase 연동 정보가 설정되어 있습니다:

```env
VITE_FIREBASE_API_KEY=AIzaSyDVPZlkmmzgsoPWgMFBIKFw4dtwQLIlIWI
VITE_FIREBASE_AUTH_DOMAIN=englishwordtest-6f238.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=englishwordtest-6f238
VITE_FIREBASE_STORAGE_BUCKET=englishwordtest-6f238.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=629653691076
VITE_FIREBASE_APP_ID=1:629653691076:web:407b4994e5c9b53c784791
VITE_FIREBASE_MEASUREMENT_ID=G-44L5TB64G4
```

---

## 📌 Firebase 콘솔 확인 사항

앱을 정상적으로 사용하기 위해 Firebase 콘솔에서 다음 2가지가 활성화되어 있는지 확인해 주세요:

1. **Firebase Authentication (Google 로그인 활성화)**
   - [Firebase Console](https://console.firebase.google.com/project/englishwordtest-6f238/authentication/providers) 접속
   - **Sign-in method** > **새 제공업체 추가** > **Google** 활성화 및 지원 이메일 저장
2. **Cloud Firestore 데이터베이스 생성**
   - [Firestore Console](https://console.firebase.google.com/project/englishwordtest-6f238/firestore) 접속
   - 데이터베이스 만들기 (위치: `asia-northeast3` 서울 추천)
3. **보안 규칙 배포**
   ```bash
   npx firebase-tools deploy --only firestore:rules
   ```
