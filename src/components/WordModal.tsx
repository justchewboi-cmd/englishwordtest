import React, { useState, useEffect } from 'react';
import { WordFormData, WordItem } from '../types';
import { X } from 'lucide-react';

interface WordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WordFormData) => Promise<void>;
  initialData?: WordItem | null;
}

export const WordModal: React.FC<WordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [memorized, setMemorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setWord(initialData.word);
      setMeaning(initialData.meaning);
      setExample(initialData.example || '');
      setMemorized(initialData.memorized);
    } else {
      setWord('');
      setMeaning('');
      setExample('');
      setMemorized(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) {
      alert('영어 단어와 뜻은 필수 입력 항목입니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        word: word.trim(),
        meaning: meaning.trim(),
        example: example.trim(),
        memorized,
      });
      onClose();
    } catch (err: any) {
      alert(`저장 중 오류가 발생했습니다: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? '단어 수정하기' : '새 단어 추가하기'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">영어 단어 (필수)</label>
              <input
                type="text"
                className="form-input"
                placeholder="예: persistent"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">뜻 (필수)</label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 끈질긴, 끊임없이 지속되는"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">예문 (선택)</label>
              <textarea
                className="form-textarea"
                placeholder="예: She was persistent in pursuing her dreams."
                value={example}
                onChange={(e) => setExample(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={memorized}
                  onChange={(e) => setMemorized(e.target.checked)}
                />
                <span>이미 외운 단어로 표시하기</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : initialData ? '수정 완료' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
