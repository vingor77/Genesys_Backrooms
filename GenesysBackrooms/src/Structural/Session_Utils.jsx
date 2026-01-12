export const getActiveSession = () => {
  return localStorage.getItem('activeSession');
};

export const getSessionRole = () => {
  return localStorage.getItem('sessionRole'); // 'dm' or 'player'
};

export const isDM = () => {
  return getSessionRole() === 'dm';
};

export const isPlayer = () => {
  return getSessionRole() === 'player';
};

export const hasActiveSession = () => {
  const session = getActiveSession();
  return session && session !== 'null' && session !== '';
};

export const setActiveSession = (sessionId, role) => {
  localStorage.setItem('activeSession', sessionId);
  localStorage.setItem('sessionRole', role);
};

export const clearActiveSession = () => {
  localStorage.removeItem('activeSession');
  localStorage.removeItem('sessionRole');
};

export const requireSession = () => {
  if (!hasActiveSession()) {
    window.location.assign('/session-selector');
    return false;
  }
  return true;
};

// Generate a 6-character join code
export const generateJoinCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Session-aware document ID
export const getSessionDocId = (docName) => {
  const sessionId = getActiveSession();
  if (!sessionId) return docName;
  return `${sessionId}_${docName}`;
};

// Format session code for display
export const formatSessionCode = (code) => {
  if (!code) return '';
  return code.toUpperCase().match(/.{1,3}/g)?.join('') || code;
};

// Check if user has permission for action
export const canModifyData = () => {
  return isDM();
};

export const canViewDMContent = () => {
  return isDM();
};

export const getCurrentUserId = () => {
  return localStorage.getItem('loggedIn');
}