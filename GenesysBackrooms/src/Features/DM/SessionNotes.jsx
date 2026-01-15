import React, { useState, useEffect, useRef } from 'react';

export default function SessionNotes({ session, onSave, readOnly }) {
  const [notes, setNotes] = useState(session?.sessionNotes || []);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    pinned: false,
    archived: false,
    timestamp: '',
    color: 'default'
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showArchived, setShowArchived] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState(new Set());
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const textareaRef = useRef(null);

  // Templates for quick note creation
  const templates = [
    {
      name: 'Session Summary',
      icon: '📋',
      content: `**Session [NUMBER] - [DATE]**

**Party Location:** 

**Key Events:**
- 
- 
- 

**NPCs Met:**
- 

**Quests:**
- Active: 
- Completed: 

**Loot/Rewards:**
- 

**Next Session:**
- `
    },
    {
      name: 'Combat Encounter',
      icon: '⚔️',
      content: `**Combat: [ENCOUNTER NAME]**

**Location:** 
**Round Count:** 
**Duration:** 

**Enemies:**
- 

**Tactics Used:**
- 

**Outcome:**
- 

**Casualties:**
- 

**XP Awarded:** `
    },
    {
      name: 'NPC Interaction',
      icon: '💬',
      content: `**NPC: [NAME]**

**Location:** 
**Context:** 

**Key Dialogue:**
- 

**Information Revealed:**
- 

**Player Decisions:**
- 

**Relationship Change:**
- 

**Follow-up:** `
    },
    {
      name: 'Plot Development',
      icon: '📖',
      content: `**Plot Thread: [NAME]**

**Development:**


**Clues Revealed:**
- 

**Player Theories:**
- 

**DM Notes:**
- 

**Next Steps:** `
    },
    {
      name: 'Loot & Rewards',
      icon: '💰',
      content: `**Loot Distribution**

**Source:** 

**Items Found:**
- 
- 
- 

**Currency:**
- Credits: 
- Other: 

**Distributed To:**
- 

**Unclaimed:** `
    },
    {
      name: 'Quick Note',
      icon: '✏️',
      content: ``
    }
  ];

  // Color themes for notes
  const colorThemes = [
    { id: 'default', name: 'Default', bg: 'bg-white/5', border: 'border-white/10' },
    { id: 'blue', name: 'Blue', bg: 'bg-blue-900/20', border: 'border-blue-500/30' },
    { id: 'green', name: 'Green', bg: 'bg-green-900/20', border: 'border-green-500/30' },
    { id: 'yellow', name: 'Yellow', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30' },
    { id: 'red', name: 'Red', bg: 'bg-red-900/20', border: 'border-red-500/30' },
    { id: 'purple', name: 'Purple', bg: 'bg-purple-900/20', border: 'border-purple-500/30' }
  ];

  // Common tags
  const availableTags = [
    'Combat', 'Roleplay', 'Plot', 'NPC', 'Quest', 'Loot', 
    'Travel', 'Mystery', 'Important', 'TODO', 'Cliffhanger', 'Recap'
  ];

  // Sync with session changes
  useEffect(() => {
    setNotes(session?.sessionNotes || []);
  }, [session]);

  // Save notes when they change
  useEffect(() => {
    if (onSave && notes !== session?.sessionNotes) {
      onSave({ ...session, sessionNotes: notes });
    }
  }, [notes]);

  // Markdown-style formatting helper
  const formatText = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
      .replace(/^- (.+)$/gm, '<li>$1</li>') // List items
  };

  // Open modal for adding new note
  const openAddModal = (template = null) => {
    setEditingNote(null);
    setFormData({
      title: template ? template.name : `Session ${session?.sessionNumber || ''} Notes`,
      content: template ? template.content : '',
      tags: [],
      pinned: false,
      archived: false,
      timestamp: new Date().toLocaleString(),
      color: 'default'
    });
    setPreviewMode(false);
    setShowModal(true);
    setShowTemplates(false);
  };

  // Open modal for editing existing note
  const openEditModal = (note, index) => {
    setEditingNote(index);
    setFormData({ ...note });
    setPreviewMode(false);
    setShowModal(true);
  };

  // Save note
  const saveNote = () => {
    if (!formData.content.trim()) {
      alert('Note content is required');
      return;
    }

    const newNote = {
      title: formData.title.trim() || 'Untitled Note',
      content: formData.content.trim(),
      tags: formData.tags,
      pinned: formData.pinned,
      archived: formData.archived,
      color: formData.color,
      timestamp: editingNote !== null ? formData.timestamp : new Date().toLocaleString(),
      editedAt: editingNote !== null ? new Date().toLocaleString() : null,
      wordCount: formData.content.trim().split(/\s+/).length
    };

    let newNotes;
    if (editingNote !== null) {
      newNotes = [...notes];
      newNotes[editingNote] = newNote;
    } else {
      newNotes = [newNote, ...notes];
    }

    setNotes(newNotes);
    setShowModal(false);
  };

  // Delete note
  const deleteNote = (index) => {
    if (confirm('Delete this note permanently?')) {
      const newNotes = notes.filter((_, i) => i !== index);
      setNotes(newNotes);
    }
  };

  // Toggle pin
  const togglePin = (index) => {
    const newNotes = [...notes];
    newNotes[index].pinned = !newNotes[index].pinned;
    setNotes(newNotes);
  };

  // Toggle archive
  const toggleArchive = (index) => {
    const newNotes = [...notes];
    newNotes[index].archived = !newNotes[index].archived;
    setNotes(newNotes);
  };

  // Duplicate note
  const duplicateNote = (note) => {
    const newNote = {
      ...note,
      title: `${note.title} (Copy)`,
      timestamp: new Date().toLocaleString(),
      editedAt: null
    };
    setNotes([newNote, ...notes]);
  };

  // Toggle note expansion
  const toggleExpand = (index) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedNotes(newExpanded);
  };

  // Copy to clipboard
  const copyToClipboard = (note) => {
    const text = `${note.title}
${'='.repeat(note.title.length)}

${note.content}

---
${note.timestamp}`;
    navigator.clipboard.writeText(text);
    alert('Note copied to clipboard!');
  };

  // Export note
  const exportNote = (note) => {
    const text = `${note.title}
${'='.repeat(note.title.length)}

${note.content}

---
${note.timestamp}${note.editedAt ? `
Edited: ${note.editedAt}` : ''}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export all notes
  const exportAllNotes = () => {
    const text = filteredNotes.map(note => 
      `${note.title}
${'='.repeat(note.title.length)}

${note.content}

---
${note.timestamp}${note.editedAt ? `
Edited: ${note.editedAt}` : ''}


`
    ).join('');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session_notes_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add tag to form
  const addTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  // Remove tag from form
  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  // Insert formatting at cursor
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newText = formData.content.substring(0, start) + prefix + selectedText + suffix + formData.content.substring(end);

    setFormData({ ...formData, content: newText });

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      // Archive filter
      if (!showArchived && note.archived) return false;

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return note.title.toLowerCase().includes(search) || 
               note.content.toLowerCase().includes(search);
      }

      // Tag filter
      if (filterTag !== 'all') {
        return note.tags?.includes(filterTag);
      }

      return true;
    })
    .sort((a, b) => {
      // Pinned notes always first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Then sort by selected criteria
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'edited':
          return new Date(b.editedAt || b.timestamp) - new Date(a.editedAt || a.timestamp);
        default:
          return 0;
      }
    });

  // Get color theme
  const getColorTheme = (colorId) => {
    return colorThemes.find(c => c.id === colorId) || colorThemes[0];
  };

  // Get all used tags
  const usedTags = [...new Set(notes.flatMap(note => note.tags || []))];

  return (
    <div className="space-y-6">
      {/* Add/Edit Modal */}
      {showModal && !readOnly && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-5xl mx-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {editingNote !== null ? '✏️ Edit Note' : '📝 New Session Note'}
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      previewMode 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {previewMode ? '📝 Edit' : '👁️ Preview'}
                  </button>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="text-gray-400 hover:text-white p-2 text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {!previewMode ? (
                  <>
                    {/* Title and Options Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Title */}
                      <div className="lg:col-span-2">
                        <label className="block text-gray-300 text-sm font-medium mb-1">
                          Note Title
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="e.g., Session 5 - The Temple Discovery"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Color Theme */}
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">
                          Color Theme
                        </label>
                        <select
                          value={formData.color}
                          onChange={(e) => setFormData({...formData, color: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        >
                          {colorThemes.map(theme => (
                            <option key={theme.id} value={theme.id}>{theme.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Formatting Toolbar */}
                    <div className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg border border-gray-600 flex-wrap">
                      <button
                        onClick={() => insertFormatting('**', '**')}
                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors text-sm font-bold"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        onClick={() => insertFormatting('*', '*')}
                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors text-sm italic"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        onClick={() => insertFormatting('\n- ')}
                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors text-sm"
                        title="Bullet List"
                      >
                        • List
                      </button>
                      <div className="w-px h-6 bg-gray-600"></div>
                      <span className="text-gray-400 text-xs">
                        💡 **bold** *italic* - bullets
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">
                        Session Notes *
                      </label>
                      <textarea
                        ref={textareaRef}
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        placeholder="Write your session notes here..."
                        rows="16"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none font-mono text-sm leading-relaxed"
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-gray-500">
                          {formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} words
                        </span>
                        <span className="text-gray-500">
                          {formData.content.length} characters
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm flex items-center gap-2"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:text-red-300"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.filter(tag => !formData.tags.includes(tag)).map(tag => (
                          <button
                            key={tag}
                            onClick={() => addTag(tag)}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full text-sm transition-colors"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.pinned}
                          onChange={(e) => setFormData({...formData, pinned: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-300 text-sm">📌 Pin to top</span>
                      </label>
                    </div>

                    {/* Timestamp */}
                    <div className="text-gray-400 text-sm">
                      {editingNote !== null 
                        ? `Created: ${formData.timestamp}` 
                        : `Will be timestamped: ${new Date().toLocaleString()}`}
                    </div>
                  </>
                ) : (
                  /* Preview Mode */
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-white">{formData.title || 'Untitled Note'}</div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-indigo-600 text-white rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div 
                      className="text-gray-300 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatText(formData.content) }}
                    />
                  </div>
                )}

                {/* Save Button */}
                <button
                  onClick={saveNote}
                  disabled={!formData.content.trim()}
                  className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-lg"
                >
                  {editingNote !== null ? '💾 Save Changes' : '📝 Save Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Selector Modal */}
      {showTemplates && !readOnly && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-4xl mx-auto">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">📋 Choose a Template</h3>
                <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-white p-2">✕</button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => openAddModal(template)}
                    className="p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 hover:from-indigo-900/60 hover:to-purple-900/60 border border-indigo-500/30 rounded-lg transition-all text-center"
                  >
                    <div className="text-4xl mb-2">{template.icon}</div>
                    <div className="text-white font-medium">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">📝 Session Notes</h2>
          <p className="text-gray-400">Real-world play session documentation (DM-only)</p>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <button 
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>📋</span>
              <span>Templates</span>
            </button>
            <button 
              onClick={() => openAddModal()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>+</span>
              <span>New Note</span>
            </button>
          </div>
        )}
      </div>

      {/* Search, Filter, Sort Bar */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Search notes..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Filter by Tag */}
          <div>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Tags</option>
              {usedTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
              <option value="edited">Recently Edited</option>
            </select>
          </div>
        </div>

        {/* Additional Options */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-300 text-sm">Show Archived</span>
            </label>
            <span className="text-gray-400 text-sm">
              {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            </span>
          </div>

          {!readOnly && filteredNotes.length > 0 && (
            <button
              onClick={exportAllNotes}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors text-sm flex items-center gap-2"
            >
              <span>📥</span>
              <span>Export All</span>
            </button>
          )}
        </div>
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white/5 rounded-lg p-12 border border-white/10 text-center">
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm || filterTag !== 'all' ? 'No notes match your filters' : 'No session notes yet'}
          </p>
          <p className="text-gray-600 text-sm mb-6">
            {searchTerm || filterTag !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Document important events, player decisions, and plot developments'
            }
          </p>
          {!readOnly && !searchTerm && filterTag === 'all' && (
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowTemplates(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                📋 Use Template
              </button>
              <button 
                onClick={() => openAddModal()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                ✏️ Write Note
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note, idx) => {
            const colorTheme = getColorTheme(note.color);
            const isExpanded = expandedNotes.has(idx);
            const actualIndex = notes.indexOf(note);

            return (
              <div 
                key={actualIndex} 
                className={`rounded-lg border overflow-hidden transition-all ${colorTheme.bg} ${colorTheme.border} ${
                  note.archived ? 'opacity-60' : ''
                }`}
              >
                {/* Note Header */}
                <div className="p-4 bg-gradient-to-r from-black/20 to-transparent border-b border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {note.pinned && <span className="text-yellow-400" title="Pinned">📌</span>}
                        {note.archived && <span className="text-gray-500" title="Archived">📦</span>}
                        <h3 className="text-white font-bold text-lg truncate">{note.title}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <span>📅 {note.timestamp}</span>
                        {note.editedAt && <span>✏️ {note.editedAt}</span>}
                        {note.wordCount > 0 && <span>📝 {note.wordCount} words</span>}
                      </div>
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {note.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-indigo-600/50 text-indigo-200 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleExpand(idx)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? '🔼' : '🔽'}
                      </button>

                      {!readOnly && (
                        <>
                          <button
                            onClick={() => togglePin(actualIndex)}
                            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/20 rounded transition-colors"
                            title={note.pinned ? 'Unpin' : 'Pin'}
                          >
                            📌
                          </button>
                          <button
                            onClick={() => copyToClipboard(note)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
                            title="Copy"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => exportNote(note)}
                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded transition-colors"
                            title="Export"
                          >
                            📥
                          </button>
                          <button
                            onClick={() => duplicateNote(note)}
                            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 rounded transition-colors"
                            title="Duplicate"
                          >
                            📄
                          </button>
                          <button
                            onClick={() => openEditModal(note, actualIndex)}
                            className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/20 rounded transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => toggleArchive(actualIndex)}
                            className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-900/20 rounded transition-colors"
                            title={note.archived ? 'Unarchive' : 'Archive'}
                          >
                            📦
                          </button>
                          <button
                            onClick={() => deleteNote(actualIndex)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Note Content */}
                {isExpanded && (
                  <div className="p-6">
                    <div 
                      className="text-gray-300 whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatText(note.content) }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Footer */}
      {notes.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-gray-400 text-sm">Total Notes</div>
              <div className="text-white text-2xl font-bold">{notes.length}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Pinned</div>
              <div className="text-white text-2xl font-bold">{notes.filter(n => n.pinned).length}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Archived</div>
              <div className="text-white text-2xl font-bold">{notes.filter(n => n.archived).length}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Total Words</div>
              <div className="text-white text-2xl font-bold">
                {notes.reduce((sum, n) => sum + (n.wordCount || 0), 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Tags Used</div>
              <div className="text-white text-2xl font-bold">{usedTags.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Help Box */}
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
        <h4 className="text-purple-300 font-medium mb-2">💡 Session Notes Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-purple-400 text-sm">
          <div>• <strong>Templates:</strong> Quick-start for common note types</div>
          <div>• <strong>Rich formatting:</strong> **bold**, *italic*, - bullets</div>
          <div>• <strong>Tags:</strong> Organize by Combat, Plot, NPC, etc.</div>
          <div>• <strong>Pin:</strong> Keep important notes at the top</div>
          <div>• <strong>Archive:</strong> Hide old notes without deleting</div>
          <div>• <strong>Search:</strong> Find notes by title or content</div>
          <div>• <strong>Export:</strong> Save individual notes or all notes</div>
          <div>• <strong>Copy:</strong> Quick clipboard sharing</div>
          <div>• <strong>Duplicate:</strong> Use existing notes as templates</div>
          <div>• <strong>Color themes:</strong> Visual organization</div>
        </div>
      </div>

      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}
