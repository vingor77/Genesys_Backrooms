import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import db, { auth } from '../Structural/Firebase';
import { formatSessionCode, generateJoinCode, setActiveSession } from './Session_Utils';

// Toast notification component
const Toast = ({ message, severity, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
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

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

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

export default function Session_Selector() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  useEffect(() => {
    // Wait for auth to initialize
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadUserSessions(user);
      } else {
        window.location.href = '/login';
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserSessions = async (user) => {
    try {
      // Get all session memberships for this user
      const q = query(
        collection(db, 'SessionMembers'),
        where('userId', '==', user.uid)
      );
      
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const sessionData = [];
        
        for (const memberDoc of snapshot.docs) {
          const memberData = memberDoc.data();
          const sessionRef = doc(db, 'Sessions', memberData.sessionId);
          const sessionDoc = await getDoc(sessionRef);
          
          if (sessionDoc.exists()) {
            sessionData.push({
              id: sessionDoc.id,
              ...sessionDoc.data(),
              role: memberData.role,
              joinedAt: memberData.joinedAt
            });
          }
        }
        
        setSessions(sessionData);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error loading sessions:', error);
      showToast('Error loading sessions', 'error');
      setLoading(false);
    }
  };

  const createSession = async () => {
    if (!sessionName.trim()) {
      showToast('Please enter a session name', 'error');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      const code = generateJoinCode();
      
      localStorage.setItem('userID', user.uid);
      // Create the session
      const sessionRef = await addDoc(collection(db, 'Sessions'), {
        name: sessionName,
        dmUserId: user.uid,
        dmName: localStorage.getItem('loggedIn') || 'DM',
        code: code,
        createdAt: new Date(),
        timers: [],
        currentTime: new Date(),
        settings: {
          allowPlayerTimerView: true
        }
      });

      // Add user as DM member
      await addDoc(collection(db, 'SessionMembers'), {
        sessionId: sessionRef.id,
        userId: user.uid,
        userName: localStorage.getItem('loggedIn') || 'Unknown',
        role: 'dm',
        joinedAt: new Date()
      });

      // Update user's active session
      const userDocRef = doc(db, 'Users', user.uid);
      await updateDoc(userDocRef, {
        activeSession: sessionRef.id
      });

      // Set as active session
      setActiveSession(sessionRef.id, 'dm');
      
      showToast(`Session created! Code: ${code}`, 'success');
      setSessionName('');
      setShowCreateModal(false);
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error creating session:', error);
      showToast('Error creating session', 'error');
    }
  };

  const joinSession = async () => {
    if (!joinCode.trim()) {
      showToast('Please enter a session code', 'error');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      // Find session by code
      const q = query(
        collection(db, 'Sessions'),
        where('code', '==', joinCode.toUpperCase())
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        showToast('Invalid session code', 'error');
        return;
      }

      const sessionId = snapshot.docs[0].id;
      
      // Check if already a member
      const memberCheck = query(
        collection(db, 'SessionMembers'),
        where('sessionId', '==', sessionId),
        where('userId', '==', user.uid)
      );
      const memberSnapshot = await getDocs(memberCheck);
      
      if (!memberSnapshot.empty) {
        showToast('You are already a member of this session', 'warning');
        return;
      }

      // Add user as player
      await addDoc(collection(db, 'SessionMembers'), {
        sessionId: sessionId,
        userId: user.uid,
        userName: localStorage.getItem('loggedIn') || 'Unknown',
        role: 'player',
        joinedAt: new Date()
      });

      // Update user's active session
      const userDocRef = doc(db, 'Users', user.uid);
      await updateDoc(userDocRef, {
        activeSession: sessionId
      });

      // Set as active session
      setActiveSession(sessionId, 'player');
      
      showToast('Successfully joined session!', 'success');
      setJoinCode('');
      setShowJoinModal(false);
      localStorage.setItem('userID', user.uid);
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Error joining session:', error);
      showToast('Error joining session', 'error');
    }
  };

  const selectSession = async (session) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Update user's active session
      const userDocRef = doc(db, 'Users', user.uid);
      await updateDoc(userDocRef, {
        activeSession: session.id
      });

      // Set as active session
      setActiveSession(session.id, session.role);
      
      showToast('Session activated!', 'success');
      localStorage.setItem('userID', user.uid);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Error selecting session:', error);
      showToast('Error selecting session', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading your sessions...</h3>
          <p className="text-gray-400">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white text-2xl">🎲</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Campaign Sessions</h1>
                <p className="text-purple-300">Select, create, or join a campaign session</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            <span>Create New Session (DM)</span>
          </button>

          <button
            onClick={() => setShowJoinModal(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
            </svg>
            <span>Join Existing Session</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
            Your Sessions
          </h2>

          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No Sessions Yet</h3>
              <p className="text-gray-400 mb-6">Create a new session or join an existing one to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => selectSession(session)}
                  className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-white/10 rounded-xl p-6 hover:bg-gradient-to-br hover:from-purple-900/50 hover:to-indigo-900/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{session.name}</h3>
                      <p className="text-sm text-gray-400">DM: {session.dmName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      session.role === 'dm' 
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' 
                        : 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                    }`}>
                      {session.role === 'dm' ? '👑 DM' : '🎮 Player'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Session Code:</span>
                      <span className="text-purple-300 font-mono font-bold">{formatSessionCode(session.code)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Joined:</span>
                      <span className="text-gray-300">{session.joinedAt?.toDate().toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectSession(session);
                    }}
                    className="w-full mt-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-medium py-2 rounded-lg transition-colors border border-purple-500/30"
                  >
                    Select Session →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Session</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Session Name</label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Enter session name..."
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
              
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  <div className="text-sm text-emerald-300">
                    <p className="font-medium mb-1">You will be the Dungeon Master</p>
                    <p className="text-emerald-400/80">You'll receive a join code to share with players after creating the session.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-lg transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={createSession}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Session Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Join Session</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Session Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code..."
                  maxLength={7}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl font-mono tracking-wider"
                  autoFocus
                />
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">You will join as a Player</p>
                    <p className="text-blue-400/80">Get the 6-character code from your Dungeon Master to join their session.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-lg transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={joinSession}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Join Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast 
        message={toast.message}
        severity={toast.severity} 
        isOpen={toast.open} 
        onClose={hideToast} 
      />
    </div>
  );
}