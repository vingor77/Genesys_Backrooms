import { collection, doc, onSnapshot, query, where, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import db from '../../Structural/Firebase';
import NotLoggedIn from "../../Structural/Not_Logged_In";
import { getActiveSession, isDM, requireSession } from '../../Structural/Session_Utils';

// Sub-components
import CharacterSheet from './CharacterSheet';
import CharacterInventory from './CharacterInventory';
import CharacterEquipped from './CharacterEquipped';
import CharacterStatus from './CharacterStatus';
import CharacterResources from './CharacterResources';
import CharacterCreator from './CharacterCreator';

// Toast notification component
const Toast = ({ message, severity, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => { onClose(); }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const severityClasses = {
    success: 'bg-emerald-500 border-emerald-400',
    error: 'bg-red-500 border-red-400',
    warning: 'bg-amber-500 border-amber-400',
    info: 'bg-blue-500 border-blue-400'
  };

  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className={`${severityClasses[severity]} text-white px-6 py-4 rounded-lg border shadow-xl flex items-center space-x-3 min-w-80`}>
        <div className="text-xl font-bold">{icons[severity]}</div>
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function PlayerPage() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [activeTab, setActiveTab] = useState('sheet');
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [viewingOther, setViewingOther] = useState(null);
  const [partyCharacters, setPartyCharacters] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionMembers, setSessionMembers] = useState([]);
  
  const sessionId = getActiveSession();
  const userIsDM = isDM();

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  // Fetch current user and session members from SessionMembers collection
  useEffect(() => {
    if (!requireSession()) return;
    if (!sessionId) return;

    const q = query(
      collection(db, 'SessionMembers'),
      where('sessionId', '==', sessionId)
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      const members = [];
      querySnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() });
      });
      setSessionMembers(members);
      
      const storedUserId = localStorage.getItem('userID');
      
      if (storedUserId) {
        const user = members.find(m => m.userId === storedUserId);
        if (user) {
          setCurrentUser(user);
        }
      }
    });

    return () => unsub();
  }, [sessionId, userIsDM]);

  // Fetch all characters for this session
  useEffect(() => {
    if (!requireSession()) return;
    if (!currentUser) return;

    const q = query(
      collection(db, 'Characters'),
      where('sessionId', '==', sessionId)
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      const allChars = [];
      querySnapshot.forEach((doc) => {
        allChars.push({ id: doc.id, ...doc.data() });
      });
      
      const dmUserIds = sessionMembers
        .filter(m => m.role === 'dm')
        .map(m => m.userId);
      
      const myChars = allChars.filter(c => c.ownerId === currentUser.userId);
      
      let otherChars;
      if (userIsDM) {
        otherChars = allChars.filter(c => c.ownerId !== currentUser.userId);
      } else {
        otherChars = allChars.filter(c => 
          c.ownerId !== currentUser.userId && 
          !dmUserIds.includes(c.ownerId)
        );
      }
      
      setCharacters(myChars);
      setPartyCharacters(otherChars);
      
      if (myChars.length > 0 && !selectedCharacter) {
        setSelectedCharacter(myChars[0]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [sessionId, currentUser, sessionMembers, userIsDM]);

  const getOwnerName = (ownerId) => {
    const member = sessionMembers.find(m => m.userId === ownerId);
    return member?.userName || 'Unknown';
  };

  const saveCharacter = async (characterId, data) => {
    try {
      const charRef = doc(db, 'Characters', characterId);
      await updateDoc(charRef, {
        ...data,
        lastUpdated: new Date().toISOString()
      });
      showToast('Character saved', 'success');
    } catch (error) {
      showToast('Error saving character', 'error');
      console.error(error);
    }
  };

  const createCharacter = async (characterData) => {
    if (!currentUser) {
      showToast('User not identified', 'error');
      return;
    }
    
    try {
      const newId = `char-${currentUser.userId}-${Date.now()}`;
      const charRef = doc(db, 'Characters', newId);
      
      await setDoc(charRef, {
        ...characterData,
        id: newId,
        ownerId: currentUser.userId,
        ownerName: currentUser.userName,
        sessionId: sessionId,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
      
      showToast('Character created!', 'success');
      setShowCreator(false);
    } catch (error) {
      showToast('Error creating character', 'error');
      console.error(error);
    }
  };

  const deleteCharacter = async (characterId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this character? This cannot be undone.');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'Characters', characterId));
      showToast('Character deleted', 'success');
      
      if (selectedCharacter?.id === characterId) {
        const remaining = characters.filter(c => c.id !== characterId);
        setSelectedCharacter(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (error) {
      showToast('Error deleting character', 'error');
      console.error(error);
    }
  };

  const isViewingOwn = viewingOther ? false : (selectedCharacter?.ownerId === currentUser?.userId);
  const displayCharacter = viewingOther || selectedCharacter;

  const tabs = [
    { id: 'sheet', label: 'Character Sheet', icon: '📋' },
    { id: 'inventory', label: 'Inventory', icon: '🎒' },
    { id: 'equipped', label: 'Equipped', icon: '⚔️' },
    { id: 'resources', label: 'Resources', icon: '🔋' },
    { id: 'status', label: 'Status', icon: '❤️' },
  ];

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  // Character Creator View
  if (showCreator) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Toast message={toast.message} severity={toast.severity} isOpen={toast.open} onClose={hideToast} />
        <div className="h-screen overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowCreator(false)}
            className="mb-4 text-gray-300 hover:text-white flex items-center space-x-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Characters</span>
          </button>
            <CharacterCreator onCreate={createCharacter} onCancel={() => setShowCreator(false)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <Toast message={toast.message} severity={toast.severity} isOpen={toast.open} onClose={hideToast} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Player Characters</h1>
            <p className="text-gray-300">Session: <span className="text-indigo-400">{sessionId}</span></p>
          </div>
          
          <button
            onClick={() => setShowCreator(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/50 flex items-center space-x-2"
          >
            <span>✨</span>
            <span>Create Character</span>
          </button>
        </div>

        {/* Character Selector + Party View */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 bg-gray-900">
          {/* My Characters */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 backdrop-blur-lg border border-gray-600 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-white mb-3">My Characters</h2>
              {loading ? (
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
                  <span>Loading...</span>
                </div>
              ) : characters.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-300 mb-2">No characters yet.</p>
                  <button
                    onClick={() => setShowCreator(true)}
                    className="text-indigo-400 hover:text-indigo-300 underline font-medium"
                  >
                    Create your first character
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {characters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => {
                        setSelectedCharacter(char);
                        setViewingOther(null);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2
                        ${selectedCharacter?.id === char.id && !viewingOther
                          ? 'bg-indigo-600 text-white border border-indigo-400'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-700'
                        }`}
                    >
                      <span>{char.name || 'Unnamed'}</span>
                      {char.career && <span className="text-sm opacity-75">({char.career})</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Party Members (View Only) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 backdrop-blur-lg border border-gray-600 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-white mb-3">Party</h2>
              {partyCharacters.length === 0 ? (
                <p className="text-gray-300 text-sm">No other characters yet</p>
              ) : (
                <div className="space-y-2">
                  {partyCharacters.map((char) => {
                    const isDMCharacter = sessionMembers.find(m => m.userId === char.ownerId)?.role === 'dm';
                    return (
                      <button
                        key={char.id}
                        onClick={() => setViewingOther(char)}
                        className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all
                          ${viewingOther?.id === char.id
                            ? 'bg-purple-600/50 text-white border border-purple-400'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-700'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{char.name || 'Unnamed'}</span>
                          {isDMCharacter && userIsDM && (
                            <span className="px-1.5 py-0.5 text-xs bg-amber-500/30 text-amber-300 rounded border border-amber-500/50">DM</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {char.career && <span>{char.career} • </span>}
                          <span>{getOwnerName(char.ownerId)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Viewing Other Player Banner */}
        {viewingOther && (
          <div className="bg-purple-900/30 border border-purple-500/50 p-4 mx-4 mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👁️</span>
              <div>
                <div className="text-white font-semibold">Viewing: {viewingOther.name}</div>
                <div className="text-purple-300 text-sm">Read-only view of another player's character</div>
              </div>
            </div>
            <button
              onClick={() => setViewingOther(null)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
            >
              Back to My Character
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden px-4 pb-4">
          {displayCharacter ? (
            <div className="bg-gray-800 border border-gray-600 rounded-xl h-full flex flex-col overflow-hidden">
            {/* Character Header */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 border-b border-gray-600">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  {/* Character Portrait Placeholder */}
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-3xl border-2 border-gray-600">
                    {displayCharacter.portrait || '👤'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{displayCharacter.name || 'Unnamed Character'}</h2>
                    <div className="flex items-center space-x-3 text-gray-300">
                      {displayCharacter.archetype && <span>{displayCharacter.archetype}</span>}
                      {displayCharacter.career && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span>{displayCharacter.career}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center space-x-3">
                  <div className="text-center px-4 py-2 bg-red-900/40 rounded-lg border border-red-500/50">
                    <div className="text-xs text-red-300 font-medium">Wounds</div>
                    <div className="text-xl font-bold text-white">
                      {displayCharacter.currentWounds || 0}/{displayCharacter.woundThreshold || 0}
                    </div>
                  </div>
                  <div className="text-center px-4 py-2 bg-blue-900/40 rounded-lg border border-blue-500/50">
                    <div className="text-xs text-blue-300 font-medium">Strain</div>
                    <div className="text-xl font-bold text-white">
                      {displayCharacter.currentStrain || 0}/{displayCharacter.strainThreshold || 0}
                    </div>
                  </div>
                  <div className="text-center px-4 py-2 bg-purple-900/40 rounded-lg border border-purple-500/50">
                    <div className="text-xs text-purple-300 font-medium">Sanity</div>
                    <div className="text-xl font-bold text-white">
                      {displayCharacter.currentSanity ?? 100}%
                    </div>
                  </div>
                </div>

                {/* Actions (only for own character) */}
                {isViewingOwn && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteCharacter(displayCharacter.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all border border-transparent hover:border-red-500/50"
                      title="Delete Character"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-600 bg-gray-800 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-all whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'sheet' && (
                <CharacterSheet
                  character={displayCharacter}
                  onSave={isViewingOwn ? (data) => saveCharacter(displayCharacter.id, data) : null}
                  readOnly={!isViewingOwn}
                />
              )}
              {activeTab === 'inventory' && (
                <CharacterInventory
                  character={displayCharacter}
                  onSave={isViewingOwn ? (data) => saveCharacter(displayCharacter.id, data) : null}
                  readOnly={!isViewingOwn}
                />
              )}
              {activeTab === 'equipped' && (
                <CharacterEquipped
                  character={displayCharacter}
                  onSave={isViewingOwn ? (data) => saveCharacter(displayCharacter.id, data) : null}
                  readOnly={!isViewingOwn}
                />
              )}
              {activeTab === 'resources' && (
                <CharacterResources
                  character={displayCharacter}
                  onSave={isViewingOwn ? (data) => saveCharacter(displayCharacter.id, data) : null}
                  readOnly={!isViewingOwn}
                />
              )}
              {activeTab === 'status' && (
                <CharacterStatus
                  character={displayCharacter}
                  onSave={isViewingOwn ? (data) => saveCharacter(displayCharacter.id, data) : null}
                  readOnly={!isViewingOwn}
                />
              )}
            </div>
          </div>
          ) : (
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-12 text-center flex items-center justify-center h-full">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Character Selected</h3>
            <p className="text-gray-300 mb-6">Create a character to get started or select one from above.</p>
            <button
              onClick={() => setShowCreator(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Create Character
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}