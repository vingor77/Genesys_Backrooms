import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import db from '../Structural/Firebase';
import { getActiveSession } from '../Structural/Session_Utils';

export default function FactionModal({ faction, onClose, userIsDM, onToggleVisibility }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sessionMembers, setSessionMembers] = useState([]);
  const [playerReputations, setPlayerReputations] = useState({});
  const [loadingMembers, setLoadingMembers] = useState(false);
  const sessionId = getActiveSession();

  // Fetch session members when Gameplay tab is active
  useEffect(() => {
    if (activeTab === 'gameplay' && userIsDM && sessionId) {
      setLoadingMembers(true);
      const q = query(
        collection(db, 'SessionMembers')
      );

      const unsub = onSnapshot(q, (querySnapshot) => {
        const members = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Filter out DMs - only show players
          if (data.role === 'player') {
            members.push({ id: doc.id, ...data });
          }
        });
        setSessionMembers(members);
        
        // Initialize player reputations from faction data
        const reps = {};
        members.forEach(member => {
          const factionRep = faction.reputation?.[sessionId]?.[member.userId] ?? 0;
          reps[member.id] = factionRep;
        });
        setPlayerReputations(reps);
        setLoadingMembers(false);
      });

      return () => unsub();
    }
  }, [activeTab, userIsDM, sessionId, faction.reputation]);

  // Update reputation in database
  const updatePlayerReputation = async (memberId, odid, newValue) => {
    // Clamp value between -100 and 100
    const clampedValue = Math.max(-100, Math.min(100, parseInt(newValue) || 0));
    
    try {
      const factionRef = doc(db, 'Factions', faction.id);
      await updateDoc(factionRef, {
        [`reputation.${sessionId}.${odid}`]: clampedValue
      });
      
      // Update local state
      setPlayerReputations(prev => ({
        ...prev,
        [memberId]: clampedValue
      }));
    } catch (error) {
      console.error('Error updating reputation:', error);
    }
  };

  // Get reputation tier info
  const getReputationTier = (value) => {
    if (value <= -51) return { label: 'Hated', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
    if (value <= -26) return { label: 'Hostile', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
    if (value <= -1) return { label: 'Unfriendly', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    if (value === 0) return { label: 'Neutral', color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };
    if (value <= 25) return { label: 'Friendly', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
    if (value <= 50) return { label: 'Trusted', color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' };
    if (value <= 75) return { label: 'Honored', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' };
    return { label: 'Revered', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' };
  };

  if (!faction) return null;

  const handleToggleVisibility = async () => {
    if (onToggleVisibility) {
      await onToggleVisibility(faction.id, faction.isHidden);
    }
  };

  // Utility function to convert kebab-case to Title Case
  const formatName = (str) => {
    if (!str) return '';
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  const getMetricColor = (value, type) => {
    if (type === 'hostility') {
      if (value <= 3) return 'text-green-400';
      if (value <= 5) return 'text-yellow-400';
      if (value <= 7) return 'text-orange-400';
      return 'text-red-400';
    }
    if (type === 'influence') {
      if (value <= 3) return 'text-gray-400';
      if (value <= 5) return 'text-blue-400';
      if (value <= 7) return 'text-purple-400';
      return 'text-amber-400';
    }
    // organization
    if (value <= 3) return 'text-red-400';
    if (value <= 5) return 'text-yellow-400';
    if (value <= 7) return 'text-blue-400';
    return 'text-cyan-400';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Friendly': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Neutral': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      case 'Tense': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Hostile': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'War': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Governmental': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Military': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Trading/Commerce': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Religious': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Criminal/Outlaw': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Scientific/Research': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Exploratory': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Survival/Refuge': return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
      case 'Mercenary': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Cult': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'Corporate': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'Academic': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'Medical/Humanitarian': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Isolationist': return 'bg-stone-500/20 text-stone-400 border-stone-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Player-visible tabs
  const playerTabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'ideology', label: 'Ideology', icon: '⚖️' },
    { id: 'history', label: 'History', icon: '📜' },
  ];

  // DM-only tabs
  const dmTabs = [
    { id: 'leadership', label: 'Leadership', icon: '👑' },
    { id: 'subgroups', label: 'Sub-Groups', icon: '🏛️' },
    { id: 'territory', label: 'Territory', icon: '🗺️' },
    { id: 'relations', label: 'Relations', icon: '🤝' },
    { id: 'gameplay', label: 'Gameplay', icon: '🎮' },
    { id: 'dm-notes', label: 'DM Notes', icon: '📖' },
  ];

  const allTabs = userIsDM ? [...playerTabs, ...dmTabs] : playerTabs;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">
                  {faction.groupName}
                </h2>
                {faction.abbreviation && (
                  <span className="text-sm font-mono text-amber-400 bg-amber-500/20 px-2 py-1 rounded border border-amber-500/30">
                    {faction.abbreviation}
                  </span>
                )}
              </div>
              {faction.motto && (
                <p className="text-gray-300 italic">"{faction.motto}"</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {faction.primaryType?.map((type, index) => (
                  <span key={index} className={`text-xs font-medium px-2 py-1 rounded border ${getTypeColor(type)}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Visibility Toggle (DM Only) */}
              {userIsDM && (
                <button
                  onClick={handleToggleVisibility}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${faction.isHidden 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
                    }
                  `}
                  title={faction.isHidden ? 'Click to show to players' : 'Click to hide from players'}
                >
                  {faction.isHidden ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Show</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      <span>Hide</span>
                    </>
                  )}
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30" style={{
          scrollbarWidth: 'thin',
          msOverflowStyle: 'none'
        }}>
          <style>{`
            .tab-container::-webkit-scrollbar {
              height: 6px;
            }
            .tab-container::-webkit-scrollbar-track {
              background: transparent;
            }
            .tab-container::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 3px;
            }
            .tab-container::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          `}</style>
          <div className="flex tab-container min-w-full">
            {allTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-5 py-3 font-medium transition-all whitespace-nowrap flex-shrink-0
                  ${activeTab === tab.id
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-amber-500/30 text-center">
                  <div className="text-sm text-gray-400 mb-1">Influence</div>
                  <div className={`text-3xl font-bold ${getMetricColor(faction.metrics?.influence, 'influence')}`}>
                    {faction.metrics?.influence || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">/ 10</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border border-red-500/30 text-center">
                  <div className="text-sm text-gray-400 mb-1">Hostility</div>
                  <div className={`text-3xl font-bold ${getMetricColor(faction.metrics?.hostility, 'hostility')}`}>
                    {faction.metrics?.hostility || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">/ 10</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30 text-center">
                  <div className="text-sm text-gray-400 mb-1">Organization</div>
                  <div className={`text-3xl font-bold ${getMetricColor(faction.metrics?.organization, 'organization')}`}>
                    {faction.metrics?.organization || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">/ 10</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-black/30 rounded-lg p-3 border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase mb-1">Founded</div>
                  <div className="text-lg font-bold text-white">{faction.overview?.foundingYear || '???'}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase mb-1">Members</div>
                  <div className="text-lg font-bold text-purple-400">{formatNumber(faction.overview?.estimatedMembers)}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase mb-1">Civilians</div>
                  <div className="text-lg font-bold text-blue-400">{formatNumber(faction.overview?.estimatedCivilians)}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase mb-1">Headquarters</div>
                  <div className="text-sm font-bold text-amber-400 truncate">{faction.territory?.headquarters || 'Unknown'}</div>
                </div>
              </div>

              {/* Known For */}
              {faction.knownFor && (
                <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-2">KNOWN FOR</div>
                  <p className="text-gray-300 leading-relaxed">{faction.knownFor}</p>
                </div>
              )}

              {/* Description */}
              {faction.overview?.description && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">DESCRIPTION</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{faction.overview.description}</p>
                </div>
              )}

              {/* Currency */}
              {faction.currency?.hasCurrency && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-400 font-semibold mb-2">CURRENCY</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{faction.currency.coinName}</span>
                    <span className="text-gray-400">
                      {faction.currency.almondWaterConversion} = 1 Almond Water
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* IDEOLOGY TAB */}
          {activeTab === 'ideology' && (
            <div className="space-y-6">
              {/* Alignments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-400 font-semibold mb-2">POLITICAL ALIGNMENT</div>
                  <div className="text-xl font-bold text-white">{faction.ideology?.politicalAlignment || 'Unknown'}</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-400 font-semibold mb-2">RELIGIOUS ALIGNMENT</div>
                  <div className="text-xl font-bold text-white">{faction.ideology?.religiousAlignment || 'Unknown'}</div>
                </div>
              </div>

              {/* Core Beliefs */}
              {faction.ideology?.coreBeliefs && faction.ideology.coreBeliefs.length > 0 && (
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-300 font-semibold mb-3">CORE BELIEFS</div>
                  <div className="space-y-2">
                    {faction.ideology.coreBeliefs.map((belief, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{belief}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In Practice (Shows the reality vs stated beliefs) */}
              {faction.ideology?.inPractice && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <div className="text-amber-400 font-bold mb-1">IN PRACTICE</div>
                      <p className="text-gray-300 text-sm leading-relaxed">{faction.ideology.inPractice}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {faction.history && faction.history.length > 0 ? (
                <>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 font-semibold mb-2">Former Names</div>
                    <div className="flex flex-wrap gap-2">
                      {faction.formerNames.map((name, nameIndex) => (
                        <span key={nameIndex} className="text-sm text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {faction.history.map((period, periodIndex) => (
                    <div key={periodIndex} className="bg-black/30 rounded-lg border border-white/10 overflow-hidden">
                      {/* Period Header */}
                      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 p-4 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-amber-400">{period.title}</h3>
                          <span className="text-sm text-gray-400 font-mono">{period.period}</span>
                        </div>
                      </div>
                      
                      {/* Events */}
                      <div className="p-4 space-y-4">
                        {period.events?.map((event, eventIndex) => (
                          <div key={eventIndex} className="relative pl-6 border-l-2 border-amber-500/30">
                            <div className="absolute left-[-5px] top-1 w-2 h-2 bg-amber-500 rounded-full"></div>
                            <div className="text-sm text-amber-400 font-medium mb-1">{event.year}</div>
                            <div className="text-white font-semibold mb-1">{event.event}</div>
                            <p className="text-gray-400 text-sm leading-relaxed">{event.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No recorded history</p>
                  <p className="text-gray-500 mt-2">Historical events have not been documented</p>
                </div>
              )}
            </div>
          )}

          {/* LEADERSHIP TAB (DM ONLY) */}
          {activeTab === 'leadership' && userIsDM && (
            <div className="space-y-6">
              {/* DM Notice */}
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Leadership structure and key NPCs are only visible to Game Masters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Leadership Structure */}
              {faction.leadership?.structure && faction.leadership.structure.length > 0 ? (
                <div className="space-y-4">
                  {faction.leadership.structure.map((position, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-4 border border-amber-500/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-amber-400">{position.position}</h3>
                          <span className="text-sm text-gray-500">Count: {position.count}</span>
                        </div>
                      </div>
                      
                      {position.description && (
                        <p className="text-gray-300 text-sm mb-3">{position.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        {position.powers && (
                          <div className="bg-green-900/20 rounded-lg p-3 border border-green-500/30">
                            <div className="text-xs text-green-400 font-semibold mb-1">POWERS</div>
                            <p className="text-gray-300 text-sm">{position.powers}</p>
                          </div>
                        )}
                        {position.limitations && (
                          <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                            <div className="text-xs text-red-400 font-semibold mb-1">LIMITATIONS</div>
                            <p className="text-gray-300 text-sm">{position.limitations}</p>
                          </div>
                        )}
                      </div>

                      {position.notableMembers && position.notableMembers.length > 0 && (
                        <div className="bg-black/20 rounded-lg p-3">
                          <div className="text-xs text-gray-400 font-semibold mb-2">NOTABLE MEMBERS</div>
                          <div className="flex flex-wrap gap-2">
                            {position.notableMembers.map((member, mIndex) => (
                              <span key={mIndex} className="text-sm text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30">
                                {member.designation} ({formatName(member.poiId)})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No leadership structure defined</div>
              )}

              {/* Key NPCs */}
              {faction.keyNPCs && faction.keyNPCs.length > 0 && (
                <div>
                  <div className="text-lg font-bold text-cyan-400 mb-3">Key NPCs</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {faction.keyNPCs.map((npc, index) => (
                      <div key={index} className="bg-black/30 rounded-lg p-3 border border-cyan-500/30">
                        <div className="text-white font-medium">{formatName(npc.poiId)}</div>
                        <p className="text-gray-400 text-sm">{npc.rolePurpose}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-GROUPS TAB (DM ONLY) */}
          {activeTab === 'subgroups' && userIsDM && (
            <div className="space-y-6">
              {/* DM Notice */}
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Organizational sub-groups, departments, and teams are only visible to Game Masters.
                    </p>
                  </div>
                </div>
              </div>

              {faction.subGroups && faction.subGroups.length > 0 ? (
                <div className="space-y-6">
                  {faction.subGroups.map((subGroup, index) => (
                    <div key={index} className="bg-black/30 rounded-lg border border-white/10 overflow-hidden">
                      {/* Sub-Group Header */}
                      <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 p-4 border-b border-white/10">
                        <h3 className="text-lg font-bold text-cyan-400">{subGroup.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{subGroup.focus}</p>
                        {subGroup.headId && (
                          <div className="text-sm text-gray-500 mt-2">
                            Head: <span className="text-cyan-300">{formatName(subGroup.headId)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Description */}
                      {subGroup.description && (
                        <div className="p-4 border-b border-white/10">
                          <p className="text-gray-300 text-sm">{subGroup.description}</p>
                        </div>
                      )}

                      {/* Teams */}
                      {subGroup.teams && subGroup.teams.length > 0 && (
                        <div className="p-4">
                          <div className="text-sm text-gray-400 font-semibold mb-3">TEAMS</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {subGroup.teams.map((team, tIndex) => (
                              <div key={tIndex} className="bg-black/30 rounded-lg p-3 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-white font-medium">{team.name}</span>
                                  <span className="text-xs text-gray-500">{team.personnel} personnel</span>
                                </div>
                                <p className="text-gray-400 text-xs mb-2">{team.specialization}</p>
                                {team.overseers && team.overseers.length > 0 && (
                                  <div className="text-xs text-cyan-400">
                                    Overseers: {team.overseers.map(o => formatName(o)).join(', ')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-gray-400 text-lg">No sub-groups defined</p>
                  <p className="text-gray-500 mt-2">This faction has no documented internal divisions</p>
                </div>
              )}
            </div>
          )}

          {/* TERRITORY TAB (DM ONLY) */}
          {activeTab === 'territory' && userIsDM && (
            <div className="space-y-6">
              {/* DM Notice */}
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Territory details and outpost locations are only visible to Game Masters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Headquarters */}
              <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg p-4 border border-amber-500/30">
                <div className="text-sm text-amber-400 font-semibold mb-2">HEADQUARTERS</div>
                <div className="text-xl font-bold text-white">{faction.territory?.headquarters || 'Unknown'}</div>
              </div>

              {/* Outposts */}
              {faction.territory?.outposts && faction.territory.outposts.length > 0 ? (
                <div>
                  <div className="text-lg font-bold text-cyan-400 mb-3">Outposts ({faction.territory.outposts.length})</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {faction.territory.outposts.map((outpost, index) => (
                      <div key={index} className="bg-black/30 rounded-lg p-4 border border-cyan-500/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-white font-medium">{outpost.name}</div>
                            <div className="text-gray-400 text-sm">{outpost.location}</div>
                          </div>
                          {outpost.outpostId && (
                            <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                              {outpost.outpostId}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No outposts documented</div>
              )}
            </div>
          )}

          {/* RELATIONS TAB (DM ONLY) */}
          {activeTab === 'relations' && userIsDM && (
            <div className="space-y-6">
              {/* DM Notice */}
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Diplomatic relations and faction politics are only visible to Game Masters.
                    </p>
                  </div>
                </div>
              </div>

              {faction.relations && faction.relations.length > 0 ? (
                <div className="space-y-3">
                  {faction.relations.map((relation, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold">{formatName(relation.factionId)}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getStatusColor(relation.status)}`}>
                            {relation.status}
                          </span>
                        </div>
                        {relation.coinExchangeRate !== undefined && (
                          <div className="text-right">
                            <div className="text-xs text-gray-400">Exchange Rate</div>
                            <div className={`font-bold ${relation.coinExchangeRate === 0 ? 'text-red-400' : relation.coinExchangeRate >= 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                              {relation.coinExchangeRate === 0 ? 'No Trade' : `${relation.coinExchangeRate}x`}
                            </div>
                          </div>
                        )}
                      </div>
                      {relation.quickSummary && (
                        <p className="text-gray-400 text-sm">{relation.quickSummary}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No documented relations</p>
                  <p className="text-gray-500 mt-2">Diplomatic ties have not been recorded</p>
                </div>
              )}
            </div>
          )}

          {/* GAMEPLAY TAB (DM ONLY) */}
          {activeTab === 'gameplay' && userIsDM && (
            <div className="space-y-6">
              {/* DM Notice */}
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Gameplay mechanics and reputation system are only visible to Game Masters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Join Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-lg p-4 border ${faction.gameplay?.playerCanJoin ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                  <div className="text-sm text-gray-400 mb-1">Player Can Join</div>
                  <div className={`text-xl font-bold ${faction.gameplay?.playerCanJoin ? 'text-green-400' : 'text-red-400'}`}>
                    {faction.gameplay?.playerCanJoin ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className={`rounded-lg p-4 border ${faction.gameplay?.reputationEnabled ? 'bg-blue-900/20 border-blue-500/30' : 'bg-gray-900/20 border-gray-500/30'}`}>
                  <div className="text-sm text-gray-400 mb-1">Reputation Tracking</div>
                  <div className={`text-xl font-bold ${faction.gameplay?.reputationEnabled ? 'text-blue-400' : 'text-gray-400'}`}>
                    {faction.gameplay?.reputationEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>

              {/* Join Requirements */}
              {faction.gameplay?.joinRequirements && (
                <div className="bg-black/30 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-400 font-semibold mb-2">JOIN REQUIREMENTS</div>
                  <p className="text-gray-300">{faction.gameplay.joinRequirements}</p>
                </div>
              )}

              {/* Benefits & Drawbacks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faction.gameplay?.benefits && (
                  <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                    <div className="text-sm text-green-400 font-semibold mb-2">MEMBER BENEFITS</div>
                    <p className="text-gray-300 text-sm">{faction.gameplay.benefits}</p>
                  </div>
                )}
                {faction.gameplay?.drawbacks && (
                  <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                    <div className="text-sm text-red-400 font-semibold mb-2">MEMBER DRAWBACKS</div>
                    <p className="text-gray-300 text-sm">{faction.gameplay.drawbacks}</p>
                  </div>
                )}
              </div>

              {/* Reputation Scale Reference */}
              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 font-semibold mb-3">REPUTATION SCALE REFERENCE</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-400">Hated (-100 to -51)</span>
                    <span className="text-gray-500">Attack on sight, bounty placed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-400">Hostile (-50 to -26)</span>
                    <span className="text-gray-500">Expelled, denied services</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400">Unfriendly (-25 to -1)</span>
                    <span className="text-gray-500">50% price markup</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Neutral (0)</span>
                    <span className="text-gray-500">Standard treatment</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400">Friendly (1 to 25)</span>
                    <span className="text-gray-500">10% discount</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-400">Trusted (26 to 50)</span>
                    <span className="text-gray-500">25% discount, quest access</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Honored (51 to 75)</span>
                    <span className="text-gray-500">50% discount, faction support</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-400">Revered (76 to 100)</span>
                    <span className="text-gray-500">Free services, unique quests</span>
                  </div>
                </div>
              </div>

              {/* Player Reputation Management */}
              {faction.gameplay?.reputationEnabled && (
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg text-purple-400 font-bold">PLAYER REPUTATION MANAGEMENT</div>
                    <span className="text-xs text-gray-500">Session: {sessionId}</span>
                  </div>
                  
                  {loadingMembers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                      <p className="text-gray-400 mt-2 text-sm">Loading session members...</p>
                    </div>
                  ) : sessionMembers.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-gray-400">No players in this session</p>
                      <p className="text-gray-500 text-sm mt-1">Players will appear here once they join</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sessionMembers.map((member) => {
                        const currentRep = playerReputations[member.id] ?? 0;
                        const tier = getReputationTier(currentRep);
                        
                        return (
                          <div key={member.id} className={`${tier.bg} rounded-lg p-4 border ${tier.border}`}>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                              {/* Player Info */}
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                                  {member.userName?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div>
                                  <div className="text-white font-medium">{member.userName || 'Unknown Player'}</div>
                                  <div className={`text-sm ${tier.color}`}>{tier.label}</div>
                                </div>
                              </div>
                              
                              {/* Reputation Controls */}
                              <div className="flex items-center space-x-2">
                                {/* Quick Adjust Buttons */}
                                <button
                                  onClick={() => updatePlayerReputation(member.id, member.userId, currentRep - 10)}
                                  className="w-8 h-8 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold transition-colors"
                                  title="-10"
                                >
                                  --
                                </button>
                                <button
                                  onClick={() => updatePlayerReputation(member.id, member.userId, currentRep - 1)}
                                  className="w-8 h-8 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold transition-colors"
                                  title="-1"
                                >
                                  -
                                </button>
                                
                                {/* Input Field */}
                                <input
                                  type="number"
                                  value={currentRep}
                                  onChange={(e) => updatePlayerReputation(member.id, member.userId, e.target.value)}
                                  min="-100"
                                  max="100"
                                  className="w-20 bg-black/50 border border-white/20 rounded px-2 py-1 text-center text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                
                                <button
                                  onClick={() => updatePlayerReputation(member.id, member.userId, currentRep + 1)}
                                  className="w-8 h-8 rounded bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold transition-colors"
                                  title="+1"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => updatePlayerReputation(member.id, member.userId, currentRep + 10)}
                                  className="w-8 h-8 rounded bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold transition-colors"
                                  title="+10"
                                >
                                  ++
                                </button>
                                
                                {/* Reset Button */}
                                <button
                                  onClick={() => updatePlayerReputation(member.id, member.userId, 0)}
                                  className="px-2 py-1 rounded bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 text-xs transition-colors"
                                  title="Reset to 0"
                                >
                                  Reset
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Quick Reference */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold">Quick Reference:</span> Complete quests (+5 to +25) • Help members (+1 to +10) • Donate resources (+1 to +5) • Attack members (-10 to -50) • Betray faction (-50 to -100)
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DM NOTES TAB */}
          {activeTab === 'dm-notes' && userIsDM && (
            <div className="space-y-6">
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      This tab is only visible to Game Masters. Use this information to run the faction effectively.
                    </p>
                  </div>
                </div>
              </div>

              {/* How To Run */}
              {faction.dmNotes?.howToRun && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">HOW TO RUN</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{faction.dmNotes.howToRun}</p>
                </div>
              )}

              {/* Interaction Guidelines */}
              {faction.dmNotes?.interactionGuidelines && (
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-400 font-semibold mb-2">INTERACTION GUIDELINES</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{faction.dmNotes.interactionGuidelines}</p>
                </div>
              )}

              {/* Common Scenarios */}
              {faction.dmNotes?.commonScenarios && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-400 font-semibold mb-2">COMMON SCENARIOS</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{faction.dmNotes.commonScenarios}</p>
                </div>
              )}

              {/* Roleplay Tips */}
              {faction.dmNotes?.roleplayTips && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-400 font-semibold mb-2">ROLEPLAY TIPS</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{faction.dmNotes.roleplayTips}</p>
                </div>
              )}

              {/* Balance Tips */}
              {faction.dmNotes?.balanceTips && (
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                  <div className="text-sm text-cyan-400 font-semibold mb-2">BALANCE TIPS</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{faction.dmNotes.balanceTips}</p>
                </div>
              )}

              {/* Quest Hooks */}
              {faction.dmNotes?.questHooks && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-400 font-semibold mb-2">QUEST HOOKS</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{faction.dmNotes.questHooks}</p>
                </div>
              )}

              {/* Tags */}
              {faction.tags && faction.tags.length > 0 && (
                <div>
                  <div className="text-sm text-gray-400 font-semibold mb-2">TAGS</div>
                  <div className="flex flex-wrap gap-2">
                    {faction.tags.map((tag, index) => (
                      <span key={index} className="text-sm text-gray-300 bg-gray-500/20 px-3 py-1 rounded-full border border-gray-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}