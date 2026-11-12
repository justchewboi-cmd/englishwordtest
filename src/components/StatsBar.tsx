import React from 'react';
import { WordItem } from '../types';

interface StatsBarProps {
  words: WordItem[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ words }) => {
  const total = words.length;
  const memorized = words.filter((w) => w.memorized).length;
  const learning = total - memorized;
  const percentage = total > 0 ? Math.round((memorized / total) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">총 등록 단어</span>
        <span className="stat-value">{total}개</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">학습 중</span>
        <span className="stat-value" style={{ color: 'var(--warning)' }}>
          {learning}개
        </span>
      </div>
      <div className="stat-card">
        <span className="stat-label">외움 완료</span>
        <span className="stat-value" style={{ color: 'var(--success)' }}>
          {memorized}개
        </span>
      </div>
      <div className="stat-card">
        <span className="stat-label">암기 달성률 ({percentage}%)</span>
        <div className="stat-progress-bar">
          <div className="stat-progress-fill" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
};
