import React from 'react';
import { User } from 'firebase/auth';
import { BookOpen, LogOut, LogIn } from 'lucide-react';
import { loginWithGoogle, logout } from '../firebase';

interface NavbarProps {
  user: User | null;
  loading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ user, loading }) => {
  const handleLogin = async () => {
    try {
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
      alert(`[로그인 오류 안내]\n\n${message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err: any) {
      alert(`로그아웃 실패: ${err.message}`);
    }
  };

  return (
    <header className="navbar">
      <div className="nav-brand">
        <BookOpen />
        <span>VocaBook</span>
      </div>

      <div className="nav-user">
        {loading ? (
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>연결 중...</span>
        ) : user ? (
          <div className="user-profile">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || '사용자'} className="user-avatar" />
            ) : (
              <div
                className="user-avatar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontWeight: 700,
                }}
              >
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <span className="user-name">{user.displayName || user.email}</span>
            <button className="btn-logout" onClick={handleLogout} title="로그아웃">
              <LogOut size={16} />
              <span>로그아웃</span>
            </button>
          </div>
        ) : (
          <button className="btn-login" onClick={handleLogin}>
            <LogIn size={18} />
            <span>Google 계정 로그인</span>
          </button>
        )}
      </div>
    </header>
  );
};
