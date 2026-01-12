import React, { useState, useEffect, useMemo } from 'react';
import { getActiveSession } from '../Structural/Session_Utils';

export default function OutpostModal({ outpost, onClose, userIsDM, onToggleVisibility, onUpdateSessionNotes }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sessionNoteText, setSessionNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const sessionId = getActiveSession();

  useEffect(() => {
    if (outpost?.dmNotes?.sessionNotes?.[sessionId]) {
      setSessionNoteText(outpost.dmNotes.sessionNotes[sessionId]);
    } else {
      setSessionNoteText('');
    }
  }, [outpost, sessionId]);

  if (!outpost) return null;

  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleVisibility = async () => {
    if (onToggleVisibility) {
      await onToggleVisibility(outpost.id, outpost.isHidden);
    }
  };

  const handleSaveSessionNote = async () => {
    if (!onUpdateSessionNotes) return;
    setIsSavingNote(true);
    try {
      await onUpdateSessionNotes(outpost.id, sessionId, sessionNoteText);
    } catch (error) {
      console.error('Error saving session note:', error);
    }
    setIsSavingNote(false);
  };

  const formatName = (str) => {
    if (!str) return '';
    return str.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-400';
      case 'Abandoned': return 'text-gray-400';
      case 'Ruined': return 'text-red-400';
      case 'Under Construction': return 'text-yellow-400';
      case 'Damaged': return 'text-orange-400';
      case 'Overrun': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getDefenseColor = (rating) => {
    if (rating <= 3) return 'text-red-400';
    if (rating <= 6) return 'text-yellow-400';
    if (rating <= 9) return 'text-green-400';
    return 'text-cyan-400';
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'High': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'Low': return 'text-green-400 bg-green-500/20 border-green-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Abundant': return 'text-green-400';
      case 'Available': return 'text-blue-400';
      case 'Scarce': return 'text-orange-400';
      case 'None': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Layout Map Component
  const LayoutMap = ({ rooms, selectedRoom, onSelectRoom }) => {
    // Calculate positions for rooms based on connections
    const roomPositions = useMemo(() => {
      if (!rooms || rooms.length === 0) return {};
      
      const positions = {};
      const visited = new Set();
      const queue = [];
      
      // Start with first room at center
      const startRoom = rooms[0];
      positions[startRoom.id] = { x: 0, y: 0 };
      visited.add(startRoom.id);
      queue.push(startRoom.id);
      
      // BFS to position rooms
      while (queue.length > 0) {
        const currentId = queue.shift();
        const current = rooms.find(r => r.id === currentId);
        if (!current) continue;
        
        const currentPos = positions[currentId];
        const connections = current.connections || {};
        
        const directions = {
          north: { dx: 0, dy: -1 },
          south: { dx: 0, dy: 1 },
          east: { dx: 1, dy: 0 },
          west: { dx: -1, dy: 0 }
        };
        
        Object.entries(directions).forEach(([dir, { dx, dy }]) => {
          const conn = connections[dir];
          if (!conn) return;
          
          const destId = typeof conn === 'string' ? conn : conn.destination;
          const destRoom = rooms.find(r => r.id === destId);
          
          if (destRoom && !visited.has(destId)) {
            positions[destId] = { 
              x: currentPos.x + dx, 
              y: currentPos.y + dy 
            };
            visited.add(destId);
            queue.push(destId);
          }
        });
      }
      
      // Handle any unvisited rooms
      rooms.forEach((room, idx) => {
        if (!positions[room.id]) {
          positions[room.id] = { x: idx % 4, y: Math.floor(idx / 4) + 3 };
        }
      });
      
      return positions;
    }, [rooms]);

    // Calculate bounds
    const bounds = useMemo(() => {
      const xs = Object.values(roomPositions).map(p => p.x);
      const ys = Object.values(roomPositions).map(p => p.y);
      return {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys)
      };
    }, [roomPositions]);

    const gridWidth = bounds.maxX - bounds.minX + 1;
    const gridHeight = bounds.maxY - bounds.minY + 1;
    const cellSize = 120;
    const padding = 40;

    return (
      <div className="relative overflow-auto bg-black/30 rounded-lg border border-white/10 p-4" style={{ maxHeight: '500px' }}>
        <svg 
          width={gridWidth * cellSize + padding * 2} 
          height={gridHeight * cellSize + padding * 2}
          className="mx-auto"
        >
          {/* Draw connections first (behind rooms) */}
          {rooms?.map(room => {
            const pos = roomPositions[room.id];
            if (!pos) return null;
            
            const x = (pos.x - bounds.minX) * cellSize + padding + cellSize / 2;
            const y = (pos.y - bounds.minY) * cellSize + padding + cellSize / 2;
            
            return Object.entries(room.connections || {}).map(([dir, conn]) => {
              if (!conn) return null;
              const destId = typeof conn === 'string' ? conn : conn.destination;
              const destPos = roomPositions[destId];
              
              if (!destPos) {
                // External connection (exits outpost)
                const offsets = {
                  north: { dx: 0, dy: -30 },
                  south: { dx: 0, dy: 30 },
                  east: { dx: 30, dy: 0 },
                  west: { dx: -30, dy: 0 }
                };
                const off = offsets[dir];
                return (
                  <g key={`${room.id}-${dir}-ext`}>
                    <line
                      x1={x} y1={y}
                      x2={x + off.dx} y2={y + off.dy}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    <circle
                      cx={x + off.dx * 1.5}
                      cy={y + off.dy * 1.5}
                      r="8"
                      fill="#f59e0b"
                    />
                  </g>
                );
              }
              
              const destX = (destPos.x - bounds.minX) * cellSize + padding + cellSize / 2;
              const destY = (destPos.y - bounds.minY) * cellSize + padding + cellSize / 2;
              
              return (
                <line
                  key={`${room.id}-${dir}`}
                  x1={x} y1={y}
                  x2={destX} y2={destY}
                  stroke="#6366f1"
                  strokeWidth="3"
                  opacity="0.6"
                />
              );
            });
          })}
          
          {/* Draw rooms */}
          {rooms?.map(room => {
            const pos = roomPositions[room.id];
            if (!pos) return null;
            
            const x = (pos.x - bounds.minX) * cellSize + padding;
            const y = (pos.y - bounds.minY) * cellSize + padding;
            const isSelected = selectedRoom?.id === room.id;
            const hasFacilities = room.facilitiesHere?.length > 0;
            
            return (
              <g 
                key={room.id} 
                onClick={() => onSelectRoom(room)}
                className="cursor-pointer"
              >
                <rect
                  x={x + 10}
                  y={y + 10}
                  width={cellSize - 20}
                  height={cellSize - 20}
                  rx="8"
                  fill={isSelected ? '#7c3aed' : hasFacilities ? '#1e3a5f' : '#1f2937'}
                  stroke={isSelected ? '#a78bfa' : hasFacilities ? '#3b82f6' : '#4b5563'}
                  strokeWidth={isSelected ? 3 : 2}
                />
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2 - 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {room.name.length > 15 ? room.name.substring(0, 15) + '...' : room.name}
                </text>
                {hasFacilities && (
                  <text
                    x={x + cellSize / 2}
                    y={y + cellSize / 2 + 15}
                    textAnchor="middle"
                    fill="#60a5fa"
                    fontSize="10"
                  >
                    🏪 {room.facilitiesHere.length}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#1e3a5f] border border-[#3b82f6] rounded"></div>
            <span>Has Facilities</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#1f2937] border border-[#4b5563] rounded"></div>
            <span>Passage/Hallway</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>External Exit</span>
          </div>
        </div>
      </div>
    );
  };

  const totalPopulation = (outpost.population?.personnel || 0) + (outpost.population?.civilians || 0);

  const playerTabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'layout', label: 'Layout', icon: '🗺️' },
    { id: 'facilities', label: 'Facilities', icon: '🏪' },
    { id: 'defenses', label: 'Defenses', icon: '🛡️' },
    { id: 'economy', label: 'Economy', icon: '💰' },
    { id: 'access', label: 'Access', icon: '🚪' },
    { id: 'history', label: 'History', icon: '📜' },
  ];

  const dmTabs = [
    { id: 'dm-notes', label: 'DM Notes', icon: '🎲' },
  ];

  const allTabs = userIsDM ? [...playerTabs, ...dmTabs] : playerTabs;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{outpost.name}</h2>
              {outpost.aliases?.length > 0 && (
                <div className="text-gray-400 text-sm mb-2">
                  Also known as: {outpost.aliases.join(', ')}
                </div>
              )}
              <div className="flex items-center space-x-4">
                <span className={`font-semibold ${getStatusColor(outpost.status)}`}>{outpost.status}</span>
                <span className="text-gray-400">•</span>
                <span className="text-purple-300">{outpost.classification}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">📍 {outpost.location}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {userIsDM && (
                <button
                  onClick={handleToggleVisibility}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${outpost.isHidden 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
                    }`}
                >
                  {outpost.isHidden ? <span>👁️ Show</span> : <span>🚫 Hide</span>}
                </button>
              )}
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto">
          {allTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 font-medium transition-all whitespace-nowrap text-sm
                ${activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-sm text-gray-400 mb-1">Population</div>
                  <div className="text-2xl font-bold text-white">👥 {totalPopulation.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {outpost.population?.personnel} staff / {outpost.population?.civilians} civilians
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-sm text-gray-400 mb-1">Defense Rating</div>
                  <div className={`text-2xl font-bold ${getDefenseColor(outpost.defenses?.rating)}`}>
                    🛡️ {outpost.defenses?.rating}/10
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-sm text-gray-400 mb-1">Founded</div>
                  <div className="text-2xl font-bold text-white">📅 {outpost.founded}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-sm text-gray-400 mb-1">Size</div>
                  <div className="text-lg font-bold text-white">📐 {outpost.size}</div>
                </div>
              </div>

              {/* Controlling Faction */}
              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                <div className="text-sm text-purple-300 font-semibold mb-2">CONTROLLING FACTION</div>
                <div className="text-xl font-bold text-white">{outpost.controllingFaction}</div>
              </div>

              {/* Resident Factions */}
              {outpost.residentFactions?.length > 0 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-3">RESIDENT FACTIONS</div>
                  <div className="flex flex-wrap gap-2">
                    {outpost.residentFactions.map((faction, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {faction}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stationed Sub-Groups */}
              {outpost.population?.stationedSubGroups?.length > 0 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-3">STATIONED UNITS</div>
                  <div className="space-y-2">
                    {outpost.population.stationedSubGroups.map((sg, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                        <div>
                          <span className="text-white font-medium">{sg.subGroupId}</span>
                          <span className="text-gray-500 ml-2">({sg.factionId})</span>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400">{sg.personnel} personnel</div>
                          <div className="text-gray-500 text-xs">{sg.purpose}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Threats */}
              {outpost.threats?.length > 0 && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <div className="text-sm text-red-300 font-semibold mb-3">⚠️ KNOWN THREATS</div>
                  <ul className="space-y-2">
                    {outpost.threats.map((threat, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-gray-300">
                        <span className="text-red-400">•</span>
                        <span>{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* LAYOUT TAB */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              {outpost.layout?.description && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">LAYOUT DESCRIPTION</div>
                  <p className="text-gray-300">{outpost.layout.description}</p>
                </div>
              )}

              {outpost.layout?.rooms?.length > 0 && (
                <>
                  <div className="text-xl font-bold text-amber-400 mb-3">🗺️ Outpost Map</div>
                  <p className="text-gray-400 text-sm mb-4">Click on a zone to see details. Orange dots indicate exits to other locations.</p>
                  
                  <LayoutMap 
                    rooms={outpost.layout.rooms} 
                    selectedRoom={selectedRoom}
                    onSelectRoom={setSelectedRoom}
                  />

                  {/* Selected Room Details */}
                  {selectedRoom && (
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30 mt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-bold text-white">{selectedRoom.name}</h4>
                          <span className="text-purple-400 text-sm">{selectedRoom.id}</span>
                        </div>
                        <button 
                          onClick={() => setSelectedRoom(null)}
                          className="text-gray-400 hover:text-white"
                        >✕</button>
                      </div>
                      
                      <p className="text-gray-300 mb-4">{selectedRoom.description}</p>

                      {/* Connections */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        {['north', 'south', 'east', 'west'].map(dir => {
                          const conn = selectedRoom.connections?.[dir];
                          if (!conn) return (
                            <div key={dir} className="bg-black/30 rounded p-2 text-center opacity-50">
                              <div className="text-xs text-gray-500 uppercase">{dir}</div>
                              <div className="text-gray-600">—</div>
                            </div>
                          );
                          
                          const destId = typeof conn === 'string' ? conn : conn.destination;
                          const desc = typeof conn === 'object' ? conn.description : null;
                          const isExternal = !outpost.layout.rooms.find(r => r.id === destId);
                          
                          return (
                            <div key={dir} className={`rounded p-2 text-center ${isExternal ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-indigo-500/20 border border-indigo-500/30'}`}>
                              <div className="text-xs text-gray-400 uppercase">{dir}</div>
                              <div className={`text-sm font-medium ${isExternal ? 'text-amber-300' : 'text-indigo-300'}`}>
                                {formatName(destId)}
                              </div>
                              {desc && <div className="text-xs text-gray-500 mt-1">{desc}</div>}
                              {isExternal && <div className="text-xs text-amber-400">↗ External</div>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Facilities in this room */}
                      {selectedRoom.facilitiesHere?.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-400 font-semibold mb-2">FACILITIES HERE</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedRoom.facilitiesHere.map((facId, idx) => {
                              const facility = outpost.facilities?.find(f => f.id === facId);
                              return (
                                <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  🏪 {facility?.name || facId}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* FACILITIES TAB */}
          {activeTab === 'facilities' && (
            <div className="space-y-4">
              <div className="text-xl font-bold text-cyan-400 mb-3">🏪 Facilities ({outpost.facilities?.length || 0})</div>
              
              {outpost.facilities?.length > 0 ? (
                outpost.facilities.map((facility, idx) => (
                  <div key={idx} className="bg-black/30 rounded-lg border border-cyan-500/20 overflow-hidden">
                    <button 
                      onClick={() => toggleExpanded(`fac-${idx}`)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🏪</span>
                        <div className="text-left">
                          <h4 className="text-white font-bold">{facility.name}</h4>
                          <span className="text-cyan-400 text-sm">{facility.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400 text-sm">{facility.hours}</span>
                        <span className={`transform transition-transform ${expandedItems[`fac-${idx}`] ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                    </button>
                    
                    {expandedItems[`fac-${idx}`] && (
                      <div className="p-4 border-t border-white/10 space-y-4">
                        <p className="text-gray-300">{facility.description}</p>
                        
                        {facility.layout && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-black/30 rounded p-3">
                              <div className="text-xs text-gray-500 mb-1">Size</div>
                              <div className="text-white text-sm">{facility.layout.size}</div>
                            </div>
                            <div className="bg-black/30 rounded p-3">
                              <div className="text-xs text-gray-500 mb-1">Atmosphere</div>
                              <div className="text-white text-sm">{facility.layout.atmosphere}</div>
                            </div>
                            <div className="bg-black/30 rounded p-3">
                              <div className="text-xs text-gray-500 mb-1">Staff</div>
                              <div className="text-white text-sm">{facility.operatedBy?.staff || 0} employees</div>
                            </div>
                          </div>
                        )}

                        {facility.layout?.features?.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 mb-2">Features</div>
                            <div className="flex flex-wrap gap-1">
                              {facility.layout.features.map((feat, fIdx) => (
                                <span key={fIdx} className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">{feat}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {facility.services?.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 mb-2">Services</div>
                            <ul className="space-y-1">
                              {facility.services.map((service, sIdx) => (
                                <li key={sIdx} className="text-gray-300 text-sm flex items-center space-x-2">
                                  <span className="text-green-400">✓</span>
                                  <span>{service}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <div className="text-sm">
                            <span className="text-gray-500">Operated by:</span>
                            <span className="text-purple-300 ml-2">{facility.operatedBy?.factionId || 'Unknown'}</span>
                          </div>
                          <div className="text-sm text-gray-400">{facility.accessRestrictions}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No facilities documented</div>
              )}
            </div>
          )}

          {/* DEFENSES TAB */}
          {activeTab === 'defenses' && (
            <div className="space-y-6">
              {outpost.defenses && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                      <div className="text-sm text-gray-400 mb-1">Defense Rating</div>
                      <div className={`text-4xl font-bold ${getDefenseColor(outpost.defenses.rating)}`}>
                        {outpost.defenses.rating}/10
                      </div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                      <div className="text-sm text-gray-400 mb-1">Security Personnel</div>
                      <div className="text-4xl font-bold text-blue-400">
                        {outpost.defenses.securityForces?.total || 0}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-gray-400 font-semibold mb-2">DEFENSE OVERVIEW</div>
                    <p className="text-gray-300">{outpost.defenses.description}</p>
                  </div>

                  {/* Physical Defenses */}
                  {outpost.defenses.physicalDefenses && (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-3">PHYSICAL DEFENSES</div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-500">Walls:</span>
                          <span className="text-white ml-2">{outpost.defenses.physicalDefenses.walls}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Gates:</span>
                          <span className="text-white ml-2">{outpost.defenses.physicalDefenses.gates}</span>
                        </div>
                        {outpost.defenses.physicalDefenses.barriers?.length > 0 && (
                          <div>
                            <span className="text-gray-500">Barriers:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {outpost.defenses.physicalDefenses.barriers.map((b, i) => (
                                <span key={i} className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">{b}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {outpost.defenses.physicalDefenses.traps?.length > 0 && (
                          <div>
                            <span className="text-gray-500">Traps:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {outpost.defenses.physicalDefenses.traps.map((t, i) => (
                                <span key={i} className="px-2 py-1 rounded text-xs bg-red-900/30 text-red-300">{t}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Security Forces */}
                  {outpost.defenses.securityForces && (
                    <div className="bg-black/30 rounded-lg p-4 border border-blue-500/30">
                      <div className="text-sm text-blue-300 font-semibold mb-3">SECURITY FORCES</div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-500">Training:</span>
                          <span className="text-white ml-2">{outpost.defenses.securityForces.training}</span>
                        </div>
                        {outpost.defenses.securityForces.equipment?.length > 0 && (
                          <div>
                            <span className="text-gray-500">Equipment:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {outpost.defenses.securityForces.equipment.map((e, i) => (
                                <span key={i} className="px-2 py-1 rounded text-xs bg-blue-900/30 text-blue-300">{e}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {outpost.defenses.securityForces.assignedSubGroups?.length > 0 && (
                          <div className="mt-3">
                            <span className="text-gray-500">Assigned Units:</span>
                            <div className="space-y-2 mt-2">
                              {outpost.defenses.securityForces.assignedSubGroups.map((sg, i) => (
                                <div key={i} className="bg-black/30 rounded p-2 flex justify-between">
                                  <span className="text-white">{sg.subGroupId}</span>
                                  <span className="text-gray-400">{sg.personnel} - {sg.role}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Surveillance */}
                  {outpost.defenses.surveillance && (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-3">SURVEILLANCE</div>
                      <div className="space-y-2">
                        <div><span className="text-gray-500">Cameras:</span><span className="text-white ml-2">{outpost.defenses.surveillance.cameras}</span></div>
                        <div><span className="text-gray-500">Coverage:</span><span className="text-white ml-2">{outpost.defenses.surveillance.coverage}</span></div>
                        {outpost.defenses.surveillance.sensors?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {outpost.defenses.surveillance.sensors.map((s, i) => (
                              <span key={i} className="px-2 py-1 rounded text-xs bg-green-900/30 text-green-300">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Response Protocols */}
                  {outpost.defenses.responseProtocols && (
                    <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                      <div className="text-sm text-amber-300 font-semibold mb-3">RESPONSE PROTOCOLS</div>
                      <div className="space-y-3">
                        <div><span className="text-red-400">Entity Breach:</span><p className="text-gray-300 mt-1">{outpost.defenses.responseProtocols.entityBreach}</p></div>
                        <div><span className="text-orange-400">Hostile Faction:</span><p className="text-gray-300 mt-1">{outpost.defenses.responseProtocols.hostileFaction}</p></div>
                        <div><span className="text-yellow-400">Internal Threat:</span><p className="text-gray-300 mt-1">{outpost.defenses.responseProtocols.internalThreat}</p></div>
                      </div>
                    </div>
                  )}

                  {/* Weaknesses (DM Only) */}
                  {userIsDM && outpost.defenses.weaknesses?.length > 0 && (
                    <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                      <div className="text-sm text-red-300 font-semibold mb-3">⚠️ WEAKNESSES (DM ONLY)</div>
                      <ul className="space-y-1">
                        {outpost.defenses.weaknesses.map((w, i) => (
                          <li key={i} className="text-gray-300 flex items-start space-x-2">
                            <span className="text-red-400">•</span><span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ECONOMY TAB */}
          {activeTab === 'economy' && (
            <div className="space-y-6">
              {outpost.economy && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                      <div className="text-sm text-gray-400 mb-1">Auto Update</div>
                      <div className={`text-xl font-bold ${outpost.economy.autoUpdate ? 'text-green-400' : 'text-red-400'}`}>
                        {outpost.economy.autoUpdate ? 'ON' : 'OFF'}
                      </div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                      <div className="text-sm text-gray-400 mb-1">Update Interval</div>
                      <div className="text-xl font-bold text-white capitalize">{outpost.economy.updateInterval}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                      <div className="text-sm text-gray-400 mb-1">Last Updated</div>
                      <div className="text-xl font-bold text-white">{outpost.economy.lastUpdated}</div>
                    </div>
                  </div>

                  {/* Supplies */}
                  <div>
                    <div className="text-xl font-bold text-green-400 mb-3">📦 Supplies (Selling)</div>
                    {outpost.economy.supplies?.length > 0 ? (
                      <div className="space-y-2">
                        {outpost.economy.supplies.map((supply, idx) => (
                          <div key={idx} className="bg-black/30 rounded-lg p-3 border border-green-500/20 flex items-center justify-between">
                            <div>
                              <span className="text-white font-medium">{formatName(supply.resourceId)}</span>
                              <span className={`ml-2 text-sm ${getAvailabilityColor(supply.availability)}`}>({supply.availability})</span>
                            </div>
                            <div className="text-right">
                              <div className="text-yellow-400 font-bold">{supply.price} AW</div>
                              <div className="text-gray-500 text-xs">Qty: {supply.quantity}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-center py-4">No supplies listed</div>
                    )}
                  </div>

                  {/* Demands */}
                  <div>
                    <div className="text-xl font-bold text-red-400 mb-3">📋 Demands (Buying)</div>
                    {outpost.economy.demands?.length > 0 ? (
                      <div className="space-y-2">
                        {outpost.economy.demands.map((demand, idx) => (
                          <div key={idx} className="bg-black/30 rounded-lg p-3 border border-red-500/20">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-white font-medium">{formatName(demand.resourceId)}</span>
                                <span className={`ml-2 px-2 py-0.5 rounded text-xs border ${getUrgencyColor(demand.urgency)}`}>{demand.urgency}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-green-400 font-bold">Paying {demand.willingToPay} AW</div>
                                <div className="text-gray-500 text-xs">Need: {demand.quantityNeeded}</div>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm">{demand.reason}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-center py-4">No demands listed</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ACCESS TAB */}
          {activeTab === 'access' && (
            <div className="space-y-6">
              {/* General Restrictions */}
              {outpost.access?.generalRestrictions && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-2">GENERAL ACCESS POLICY</div>
                  <p className="text-gray-300">{outpost.access.generalRestrictions}</p>
                </div>
              )}

              {/* Entrances */}
              <div>
                <div className="text-xl font-bold text-green-400 mb-3">🚪 Entrances</div>
                {outpost.access?.entrances?.length > 0 ? (
                  <div className="space-y-3">
                    {outpost.access.entrances.map((entrance, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-4 border border-green-500/20">
                        <div className="text-white font-medium mb-2">{entrance.method}</div>
                        <p className="text-gray-400 text-sm mb-2">{entrance.appearance}</p>
                        {entrance.restrictions && (
                          <div className="text-amber-400 text-sm">⚠️ {entrance.restrictions}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No entrances documented</div>
                )}
              </div>

              {/* Exits */}
              <div>
                <div className="text-xl font-bold text-blue-400 mb-3">↗️ Exits</div>
                {outpost.access?.exits?.length > 0 ? (
                  <div className="space-y-3">
                    {outpost.access.exits.map((exit, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">→ {formatName(exit.destination)}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{exit.method}</p>
                        {exit.restrictions && (
                          <div className="text-amber-400 text-sm mt-2">⚠️ {exit.restrictions}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No exits documented</div>
                )}
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-amber-400 mb-3">📜 History</div>
              {outpost.history?.length > 0 ? (
                outpost.history.map((period, pIdx) => (
                  <div key={pIdx} className="bg-black/30 rounded-lg p-4 border border-amber-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-bold text-lg">{period.title}</h4>
                      <span className="text-amber-400 text-sm">{period.period}</span>
                    </div>
                    <div className="space-y-3">
                      {period.events?.map((event, eIdx) => (
                        <div key={eIdx} className="border-l-2 border-amber-500/50 pl-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-amber-400 font-mono text-sm">{event.year}</span>
                            <span className="text-white font-medium">{event.event}</span>
                          </div>
                          <p className="text-gray-400 text-sm">{event.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-8">No history documented</div>
              )}
            </div>
          )}

          {/* DM NOTES TAB */}
          {activeTab === 'dm-notes' && userIsDM && (
            <div className="space-y-6">
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="text-purple-400 font-bold mb-1">🎲 DM ONLY</div>
                <p className="text-gray-300 text-sm">This tab is only visible to Game Masters.</p>
              </div>

              {/* How to Run */}
              {outpost.dmNotes?.howToRun && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">HOW TO RUN THIS OUTPOST</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{outpost.dmNotes.howToRun}</p>
                </div>
              )}

              {/* Quest Hooks */}
              {outpost.dmNotes?.questHooks?.length > 0 && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-300 font-semibold mb-3">🎯 QUEST HOOKS</div>
                  <ul className="space-y-2">
                    {outpost.dmNotes.questHooks.map((hook, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-gray-300">
                        <span className="text-green-400">•</span>
                        <span>{hook}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {outpost.tags?.length > 0 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-3">🏷️ TAGS</div>
                  <div className="flex flex-wrap gap-2">
                    {outpost.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Session Notes */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <div className="text-sm text-blue-400 font-semibold mb-2">📝 SESSION NOTES</div>
                <p className="text-xs text-gray-500 mb-3">Notes for this session ({sessionId}). Only you can see these.</p>
                <textarea
                  value={sessionNoteText}
                  onChange={(e) => setSessionNoteText(e.target.value)}
                  placeholder="Add notes for this outpost in the current session..."
                  className="w-full bg-black/30 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                />
                <button
                  onClick={handleSaveSessionNote}
                  disabled={isSavingNote}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
                >
                  {isSavingNote ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}