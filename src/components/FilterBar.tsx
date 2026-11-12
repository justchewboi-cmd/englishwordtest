import React from 'react';
import { FilterStatus } from '../types';
import { Search, Plus } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  onOpenAddModal: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onOpenAddModal,
}) => {
  return (
    <div className="controls-container">
      <div className="search-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="단어 또는 뜻으로 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-actions">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            전체
          </button>
          <button
            className={`filter-tab ${activeFilter === 'learning' ? 'active' : ''}`}
            onClick={() => onFilterChange('learning')}
          >
            학습 중
          </button>
          <button
            className={`filter-tab ${activeFilter === 'memorized' ? 'active' : ''}`}
            onClick={() => onFilterChange('memorized')}
          >
            외움 완료
          </button>
        </div>

        <button className="btn-add-word" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>단어 추가</span>
        </button>
      </div>
    </div>
  );
};
