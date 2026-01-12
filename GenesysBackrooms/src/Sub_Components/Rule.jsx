import React from 'react';

export default function Rule({ rule, onClick }) {
  const getCategoryColor = (category) => {
    const colors = {
      'Core Mechanics': 'text-blue-400 border-blue-500/50 bg-blue-500/20',
      'Survival': 'text-green-400 border-green-500/50 bg-green-500/20',
      'Equipment': 'text-yellow-400 border-yellow-500/50 bg-yellow-500/20',
      'Entities & Combat': 'text-red-400 border-red-500/50 bg-red-500/20',
      'Character Creation': 'text-purple-400 border-purple-500/50 bg-purple-500/20',
      'Environmental': 'text-cyan-400 border-cyan-500/50 bg-cyan-500/20',
      'Custom Content': 'text-pink-400 border-pink-500/50 bg-pink-500/20'
    };
    return colors[category] || 'text-gray-400 border-gray-500/50 bg-gray-500/20';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Core Mechanics': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
        </svg>
      ),
      'Survival': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
        </svg>
      ),
      'Equipment': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd"></path>
        </svg>
      ),
      'Entities & Combat': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
      ),
      'Character Creation': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
      ),
      'Environmental': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
        </svg>
      ),
      'Custom Content': (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
        </svg>
      )
    };
    return icons[category] || (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className="
        relative
        bg-gradient-to-br from-white/5 to-white/0
        backdrop-blur-lg
        rounded-2xl p-6
        border border-white/10
        hover:border-blue-500/50
        hover:shadow-xl hover:shadow-blue-500/10
        transition-all duration-300 cursor-pointer
        group
      "
    >
      {/* Category Badge */}
      <div className="mb-4">
        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${getCategoryColor(rule.category)}`}>
          {getCategoryIcon(rule.category)}
          <span>{rule.category}</span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {rule.title || 'Untitled Rule'}
        </h3>
      </div>

      {/* Description */}
      {rule.description && (
        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
          {rule.description}
        </p>
      )}

      {/* Footer - Section Count */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
          </svg>
          <span>
            {rule.sections?.length || 0} {rule.sections?.length === 1 ? 'section' : 'sections'}
          </span>
        </div>

        {/* Order indicator */}
        <div className="flex items-center space-x-1 text-gray-500">
          <span className="text-xs">#{rule.order}</span>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}