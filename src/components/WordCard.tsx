import React from 'react';
import { WordItem } from '../types';
import { Volume2, Edit3, Trash2, CheckCircle2, Clock } from 'lucide-react';

interface WordCardProps {
  item: WordItem;
  onEdit: (item: WordItem) => void;
  onDelete: (id: string) => void;
  onToggleMemorized: (id: string, current: boolean) => void;
}

export const WordCard: React.FC<WordCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleMemorized,
}) => {
  const speakText = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저는 음성 듣기를 지원하지 않습니다.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`word-card ${item.memorized ? 'memorized' : ''}`}>
      <div className="word-card-header">
        <div className="word-title-group">
          <span className="word-text">{item.word}</span>
          <button
            className="btn-tts"
            onClick={(e) => speakText(item.word, e)}
            title="발음 듣기"
          >
            <Volume2 size={16} />
          </button>
        </div>

        <button
          className={`memorized-badge ${item.memorized ? 'memorized' : 'learning'}`}
          onClick={() => onToggleMemorized(item.id, item.memorized)}
          title="클릭하여 외움 상태 변경"
        >
          {item.memorized ? (
            <>
              <CheckCircle2 size={13} />
              <span>외움 완료</span>
            </>
          ) : (
            <>
              <Clock size={13} />
              <span>학습 중</span>
            </>
          )}
        </button>
      </div>

      <div className="word-meaning">{item.meaning}</div>

      {item.example && (
        <div className="word-example-box">
          <span className="word-example-text">"{item.example}"</span>
          <button
            className="btn-tts"
            style={{ width: '22px', height: '22px', background: 'transparent' }}
            onClick={(e) => speakText(item.example!, e)}
            title="예문 발음 듣기"
          >
            <Volume2 size={13} />
          </button>
        </div>
      )}

      <div className="word-card-footer">
        <button
          className="btn-icon-action"
          onClick={() => onEdit(item)}
          title="단어 수정"
        >
          <Edit3 size={14} />
          <span>수정</span>
        </button>
        <button
          className="btn-icon-action danger"
          onClick={() => onDelete(item.id)}
          title="단어 삭제"
        >
          <Trash2 size={14} />
          <span>삭제</span>
        </button>
      </div>
    </div>
  );
};
