import { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, isFirebaseConfigured } from './firebase';
import { WordItem, WordFormData, FilterStatus } from './types';
import {
  subscribeUserWords,
  addWord,
  updateWord,
  deleteWord,
  toggleWordMemorized,
} from './services/wordService';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { WordCard } from './components/WordCard';
import { WordModal } from './components/WordModal';
import { BookOpen, LogIn, Sparkles, AlertCircle } from 'lucide-react';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [words, setWords] = useState<WordItem[]>([]);
  const [wordsLoading, setWordsLoading] = useState(false);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoginError(null);
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Login failed:', err);
      let message = err.message || '알 수 없는 오류가 발생했습니다.';
      if (err.code === 'auth/popup-blocked') {
        message = '브라우저 팝업이 차단되었습니다. 브라우저 주소창 우측의 팝업 차단 아이콘을 눌러 팝업을 허용해 주세요.';
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        message = 'Firebase 콘솔에서 Google 로그인이 아직 활성화되지 않았습니다.\nFirebase 콘솔 > Authentication > Sign-in method에서 Google 로그인을 사용 설정해 주세요.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = '현재 도메인(localhost)이 Firebase 승인된 도메인에 등록되어 있지 않습니다.\nFirebase 콘솔 > Authentication > Settings > Authorized domains를 확인해 주세요.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        message = '로그인 팝업창이 닫혔습니다. 다시 시도해 주세요.';
      }
      setLoginError(message);
      alert(`[로그인 오류 안내]\n\n${message}`);
    }
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<WordItem | null>(null);

  // 1. Listen for Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Firestore when user is authenticated
  useEffect(() => {
    if (!user) {
      setWords([]);
      return;
    }

    setWordsLoading(true);
    setFirestoreError(null);

    const unsubscribe = subscribeUserWords(
      user.uid,
      (fetchedWords) => {
        setWords(fetchedWords);
        setWordsLoading(false);
      },
      (error) => {
        setWordsLoading(false);
        setFirestoreError(error.message);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Filtered and searched words
  const filteredWords = useMemo(() => {
    return words.filter((item) => {
      // Status filter
      if (filterStatus === 'learning' && item.memorized) return false;
      if (filterStatus === 'memorized' && !item.memorized) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesWord = item.word.toLowerCase().includes(query);
        const matchesMeaning = item.meaning.toLowerCase().includes(query);
        const matchesExample = item.example?.toLowerCase().includes(query);
        return matchesWord || matchesMeaning || matchesExample;
      }

      return true;
    });
  }, [words, filterStatus, searchQuery]);

  // Actions
  const handleOpenAddModal = () => {
    setEditingWord(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: WordItem) => {
    setEditingWord(item);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData: WordFormData) => {
    if (!user) return;
    if (editingWord) {
      await updateWord(user.uid, editingWord.id, formData);
    } else {
      await addWord(user.uid, formData);
    }
  };

  const handleDeleteWord = async (id: string) => {
    if (!user) return;
    if (window.confirm('정말 이 단어를 삭제하시겠습니까?')) {
      try {
        await deleteWord(user.uid, id);
      } catch (err: any) {
        alert(`단어 삭제 실패: ${err.message}`);
      }
    }
  };

  const handleToggleMemorized = async (id: string, current: boolean) => {
    if (!user) return;
    try {
      await toggleWordMemorized(user.uid, id, current);
    } catch (err: any) {
      alert(`상태 변경 실패: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      <Navbar user={user} loading={authLoading} />

      {!isFirebaseConfigured && (
        <div
          style={{
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={20} />
          <span>.env 파일에 Firebase 설정값(VITE_FIREBASE_*)이 누락되었습니다.</span>
        </div>
      )}

      {firestoreError && (
        <div
          style={{
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <strong>Firestore 데이터 조회 오류:</strong> {firestoreError}
        </div>
      )}

      {authLoading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          사용자 인증 정보를 불러오는 중...
        </div>
      ) : !user ? (
        // Unauthenticated Welcome State
        <div className="welcome-card">
          <h1>나만의 스마트 영어 단어장</h1>
          <p>
            영어 단어, 뜻, 예문을 저장하고 외움 여부를 체크해보세요.<br />
            Google 계정으로 로그인하면 내 데이터가 Firestore에 안전하게 보관되어
            언제 어디서나 이어서 학습할 수 있습니다.
          </p>
          {loginError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(254, 202, 202, 0.6)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.92rem',
                color: '#fff',
                textAlign: 'left',
                lineHeight: 1.5,
                whiteSpace: 'pre-line'
              }}
            >
              ⚠️ {loginError}
            </div>
          )}
          <button className="btn-hero-login" onClick={handleLogin}>
            <LogIn size={20} />
            <span>Google 계정으로 시작하기</span>
          </button>
        </div>
      ) : (
        // Authenticated Vocabulary App
        <>
          <StatsBar words={words} />

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={filterStatus}
            onFilterChange={setFilterStatus}
            onOpenAddModal={handleOpenAddModal}
          />

          {wordsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              단어장 데이터를 불러오는 중...
            </div>
          ) : filteredWords.length > 0 ? (
            <div className="words-grid">
              {filteredWords.map((item) => (
                <WordCard
                  key={item.id}
                  item={item}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteWord}
                  onToggleMemorized={handleToggleMemorized}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              {words.length === 0 ? (
                <>
                  <BookOpen className="empty-icon" />
                  <h3>아직 등록된 단어가 없습니다</h3>
                  <p>나만의 첫 번째 영어 단어를 등록하고 학습을 시작해보세요!</p>
                  <button className="btn-add-word" onClick={handleOpenAddModal}>
                    <Sparkles size={16} />
                    <span>첫 단어 추가하기</span>
                  </button>
                </>
              ) : (
                <>
                  <BookOpen className="empty-icon" />
                  <h3>검색 및 필터 결과가 없습니다</h3>
                  <p>다른 검색어를 입력하거나 필터를 '전체'로 변경해보세요.</p>
                </>
              )}
            </div>
          )}

          <WordModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            initialData={editingWord}
          />
        </>
      )}
    </div>
  );
}

export default App;
