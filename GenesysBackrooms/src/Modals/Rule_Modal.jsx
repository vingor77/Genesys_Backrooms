import React from 'react';

export default function Rule_Modal({ isOpen, onClose, rule }) {
  if (!isOpen || !rule) return null;

  // Render different content types
  const renderContent = (block, index) => {
    switch (block.type) {
      case 'text':
        return renderText(block, index);
      case 'table':
        return renderTable(block, index);
      case 'list':
        return renderList(block, index);
      case 'grid':
        return renderGrid(block, index);
      case 'callout':
        return renderCallout(block, index);
      default:
        return null;
    }
  };

  // TEXT BLOCK - Enhanced with better styling
  const renderText = (block, index) => {
    const styles = {
      normal: 'bg-slate-800/30 border-l-2 border-slate-700',
      info: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border-l-4 border-blue-500 shadow-lg shadow-blue-500/10',
      warning: 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-l-4 border-amber-500 shadow-lg shadow-amber-500/10',
      success: 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 border-l-4 border-green-500 shadow-lg shadow-green-500/10',
      danger: 'bg-gradient-to-r from-red-500/20 to-pink-500/10 border-l-4 border-red-500 shadow-lg shadow-red-500/10'
    };

    return (
      <div key={index} className={`mb-6 ${styles[block.style || 'normal']} rounded-r-lg p-4`}>
        {block.heading && (
          <h3 className="text-2xl font-bold text-white mb-3 flex items-center">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 mr-3"></span>
            {block.heading}
          </h3>
        )}
        <div className="text-slate-200 leading-relaxed whitespace-pre-line text-base">
          {block.text}
        </div>
      </div>
    );
  };

  // TABLE BLOCK - Beautiful striped tables with highlights
  const renderTable = (block, index) => {
    if (!block.rows || block.rows.length === 0) return null;
    
    const firstRow = block.rows[0];
    const columnKeys = Object.keys(firstRow).filter(key => key.startsWith('col')).sort();
    
    // Detect if this is a tier/level table for special coloring
    const isTierTable = block.columns?.[0]?.toLowerCase().includes('tier') || 
                        block.columns?.[0]?.toLowerCase().includes('level');
    
    return (
      <div key={index} className="mb-8">
        {block.heading && (
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {block.heading}
          </h3>
        )}
        <div className="overflow-x-auto rounded-xl border-2 border-slate-700 shadow-2xl">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 border-b-2 border-slate-600">
                {block.columns?.map((col, i) => (
                  <th key={i} className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIdx) => {
                const isHighlighted = row.highlight;
                const isEvenRow = rowIdx % 2 === 0;
                
                // Special coloring for tier tables
                let rowColor = isEvenRow ? 'bg-slate-900/40' : 'bg-slate-900/20';
                let borderColor = 'border-slate-800';
                let textColor = 'text-slate-300';
                
                if (isHighlighted) {
                  rowColor = 'bg-gradient-to-r from-amber-500/25 to-orange-500/15';
                  borderColor = 'border-l-4 border-amber-400';
                  textColor = 'text-amber-50';
                }
                
                return (
                  <tr
                    key={rowIdx}
                    className={`
                      ${rowColor}
                      ${borderColor}
                      border-t ${isHighlighted ? 'border-amber-500/30' : 'border-slate-800'}
                      hover:bg-slate-700/40 
                      transition-all duration-150
                      ${isHighlighted ? 'shadow-lg shadow-amber-500/10' : ''}
                    `}
                  >
                    {columnKeys.map((key, cellIdx) => (
                      <td key={cellIdx} className={`px-6 py-4 text-sm ${textColor} ${isHighlighted ? 'font-medium' : ''}`}>
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // LIST BLOCK - Styled lists with colors
  const renderList = (block, index) => {
    const colorClasses = {
      default: 'text-slate-400',
      red: 'text-red-400',
      green: 'text-green-400',
      blue: 'text-blue-400',
      amber: 'text-amber-400',
      purple: 'text-purple-400'
    };

    const bgColors = {
      default: 'hover:bg-slate-800/30',
      red: 'hover:bg-red-500/10',
      green: 'hover:bg-green-500/10',
      blue: 'hover:bg-blue-500/10',
      amber: 'hover:bg-amber-500/10',
      purple: 'hover:bg-purple-500/10'
    };

    const colorClass = colorClasses[block.color || 'default'];
    const bgColor = bgColors[block.color || 'default'];

    return (
      <div key={index} className="mb-6">
        {block.heading && (
          <h3 className="text-xl font-bold text-white mb-3 flex items-center">
            <span className={`w-1.5 h-1.5 rounded-full ${colorClass} mr-2 animate-pulse`}></span>
            {block.heading}
          </h3>
        )}
        
        {block.style === 'number' ? (
          <ol className="list-decimal list-inside space-y-2">
            {block.items?.map((item, i) => (
              <li key={i} className={`${colorClass} p-2 rounded-lg ${bgColor} transition-colors`}>
                <span className="text-slate-200 ml-1">{item}</span>
              </li>
            ))}
          </ol>
        ) : block.style === 'check' || block.style === 'checkmarks' ? (
          <ul className="space-y-2">
            {block.items?.map((item, i) => (
              <li key={i} className={`flex items-start p-2 rounded-lg ${bgColor} transition-colors`}>
                <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-200 flex-1">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            {block.items?.map((item, i) => (
              <li key={i} className={`flex items-start p-2 rounded-lg ${bgColor} transition-colors`}>
                <span className={`${colorClass} mr-3 font-bold text-lg`}>•</span>
                <span className="text-slate-200 flex-1">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // GRID BLOCK - Stat boxes
  const renderGrid = (block, index) => {
    const colorClasses = {
      blue: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/40 shadow-blue-500/20',
      green: 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/40 shadow-green-500/20',
      amber: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/40 shadow-amber-500/20',
      red: 'bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/40 shadow-red-500/20',
      purple: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/40 shadow-purple-500/20'
    };

    const textColors = {
      blue: 'text-blue-300',
      green: 'text-green-300',
      amber: 'text-amber-300',
      red: 'text-red-300',
      purple: 'text-purple-300'
    };

    return (
      <div key={index} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {block.items?.map((item, i) => {
          const colorClass = colorClasses[item.color] || 'bg-slate-800/50 border-slate-700';
          const textColor = textColors[item.color] || 'text-slate-300';
          return (
            <div key={i} className={`${colorClass} rounded-xl p-4 border-2 shadow-lg hover:scale-105 transition-transform duration-200`}>
              <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">{item.label}</div>
              <div className={`text-xl font-bold ${textColor}`}>{item.value}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // CALLOUT BLOCK - Important notices
  const renderCallout = (block, index) => {
    const styles = {
      info: {
        bg: 'bg-gradient-to-r from-blue-500/15 to-cyan-500/10 border-blue-500',
        text: 'text-blue-300',
        icon: (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
      },
      warning: {
        bg: 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 border-amber-500',
        text: 'text-amber-300',
        icon: (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      },
      tip: {
        bg: 'bg-gradient-to-r from-green-500/15 to-emerald-500/10 border-green-500',
        text: 'text-green-300',
        icon: (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
        )
      },
      danger: {
        bg: 'bg-gradient-to-r from-red-500/15 to-pink-500/10 border-red-500',
        text: 'text-red-300',
        icon: (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      }
    };

    const style = styles[block.style] || styles.info;

    return (
      <div key={index} className={`${style.bg} border-l-4 rounded-r-xl p-5 mb-6 shadow-xl`}>
        <div className="flex items-start space-x-4">
          <div className={`${style.text} flex-shrink-0 mt-0.5`}>{style.icon}</div>
          <div className="flex-1">
            {block.title && (
              <div className={`${style.text} font-bold text-lg mb-2`}>{block.title}</div>
            )}
            <p className="text-slate-200 leading-relaxed">{block.text}</p>
          </div>
        </div>
      </div>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Core Mechanics': 'text-blue-400 bg-blue-500/10',
      'Survival': 'text-green-400 bg-green-500/10',
      'Equipment': 'text-yellow-400 bg-yellow-500/10',
      'Entities & Combat': 'text-red-400 bg-red-500/10',
      'Character Creation': 'text-purple-400 bg-purple-500/10',
      'Environmental': 'text-cyan-400 bg-cyan-500/10',
      'Custom Content': 'text-pink-400 bg-pink-500/10'
    };
    return colors[category] || 'text-gray-400 bg-gray-500/10';
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col border-2 border-slate-700/50 shadow-2xl">
        
        {/* Header */}
        <div className="p-8 border-b-2 border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-8">
              <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-3 ${getCategoryColor(rule.category)}`}>
                {rule.category}
              </div>
              <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {rule.title}
              </h2>
              <p className="text-slate-400 text-lg">{rule.description}</p>
            </div>
            
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500 border-2 border-slate-600 rounded-xl transition-all duration-200 flex-shrink-0 group"
            >
              <svg className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - Custom scrollbar */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 12px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(15, 23, 42, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #475569, #334155);
              border-radius: 10px;
              border: 2px solid rgba(15, 23, 42, 0.5);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #64748b, #475569);
            }
          `}</style>
          {rule.content && rule.content.map((block, index) => renderContent(block, index))}
        </div>
      </div>
    </div>
  );
}