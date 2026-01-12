import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import db from '../Structural/Firebase';
import { getActiveSession } from './Session_Utils';

/**
 * Submit an approval request for custom player-uploaded content
 * 
 * @param {string} itemType - Type of item ('entity', 'craft', 'object', 'level', 'faction')
 * @param {string} itemName - Display name of the item
 * @param {object} itemData - Complete data object for the item
 * @param {string} description - Optional description/notes for the DM
 * @returns {Promise<void>}
 */
export const submitApprovalRequest = async (itemType, itemName, itemData, description = '') => {
  const sessionId = getActiveSession();
  const userId = localStorage.getItem('userId') || 'anonymous';
  const userName = localStorage.getItem('userName') || 'Anonymous Player';

  if (!sessionId) {
    throw new Error('No active session found');
  }

  try {
    await addDoc(collection(db, 'ApprovalRequests'), {
      sessionId,
      requesterId: userId,
      requesterName: userName,
      itemType,
      itemName,
      itemData,
      description,
      status: 'pending', // pending, approved, rejected
      timestamp: serverTimestamp()
    });

    return { success: true, message: 'Approval request submitted to DM' };
  } catch (error) {
    console.error('Error submitting approval request:', error);
    throw error;
  }
};

/**
 * Check if user can upload directly (is DM) or needs approval
 * 
 * @returns {object} { canUploadDirectly: boolean, requiresApproval: boolean }
 */
export const getUploadPermissions = () => {
  const sessionRole = localStorage.getItem('sessionRole');
  const isDM = sessionRole === 'dm';

  return {
    canUploadDirectly: isDM,
    requiresApproval: !isDM
  };
};

/**
 * Add uploadType field to data based on user role
 * 
 * @param {object} data - The data object to modify
 * @returns {object} Data with uploadType field added
 */
export const addUploadMetadata = (data) => {
  const sessionId = getActiveSession();
  const userId = localStorage.getItem('userId') || 'anonymous';
  const userName = localStorage.getItem('userName') || 'Anonymous';
  const isDM = localStorage.getItem('sessionRole') === 'dm';

  return {
    ...data,
    uploadType: isDM ? 'default' : 'player',
    uploadedBy: userId,
    uploadedByName: userName,
    uploadedAt: new Date().toISOString(),
    // For player uploads, make it session-specific
    ...(isDM ? {} : { 
      sessionVisibility: { [sessionId]: 'hidden' } // Hidden until approved
    })
  };
};