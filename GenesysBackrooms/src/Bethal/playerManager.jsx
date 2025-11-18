import React, { useState, useRef } from 'react';
import { addItemToShipInventory } from './ShipInventory.jsx';

export const updatePlayerInventory = (players, setPlayers, playerId, itemIndex, field, value) => {
  setPlayers(prev => prev.map(player => {
    if (player.id === playerId) {
      const currentInventory = player.inventory || [
        { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
        { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
        { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
        { name: '', weight: 0, price: 0, conductive: false, twoHanded: false }
      ];
      
      const newInventory = [...currentInventory];
      newInventory[itemIndex] = {
        ...newInventory[itemIndex],
        [field]: field === 'name' ? value : 
                 field === 'conductive' || field === 'twoHanded' ? Boolean(value) :
                 (parseFloat(value) || 0)
      };
      return { ...player, inventory: newInventory };
    }
    return player;
  }));
};

export const addItemToPlayerInventory = (players, setPlayers, playerId, item) => {
  // Find player and check for empty slot
  const player = players.find(p => p.id === playerId);
  if (!player) return false;
  
  const inventory = player.inventory || [];
  const filledSlots = inventory.filter(slot => slot.name && slot.name.trim()).length;
  
  if (filledSlots >= 4) return false; // Inventory full
  
  const emptySlotIndex = inventory.findIndex(slot => !slot.name || !slot.name.trim());
  if (emptySlotIndex === -1) return false;
  
  updatePlayerInventory(players, setPlayers, playerId, emptySlotIndex, 'name', item.name);
  updatePlayerInventory(players, setPlayers, playerId, emptySlotIndex, 'weight', item.weight);
  updatePlayerInventory(players, setPlayers, playerId, emptySlotIndex, 'price', item.price);
  updatePlayerInventory(players, setPlayers, playerId, emptySlotIndex, 'conductive', item.conductive);
  updatePlayerInventory(players, setPlayers, playerId, emptySlotIndex, 'twoHanded', item.twoHanded);
  
  return true;
};

// Export these functions outside the component
export const updatePlayerHealth = (players, setPlayers, playerId, wounds, strain) => {
  setPlayers(prev => prev.map(player => {
    if (player.id === playerId) {
      const newWounds = Math.min(player.maxWounds * 2, Math.max(0, wounds));
      const newStrain = Math.min(player.maxStrain, Math.max(0, strain));
      
      const updatedPlayer = { ...player, wounds: newWounds, strain: newStrain };
      
      // Recalculate status
      const statusInfo = determinePlayerStatus(updatedPlayer);
      updatedPlayer.status = statusInfo.overallStatus;
      updatedPlayer.woundStatus = statusInfo.woundStatus;
      updatedPlayer.strainStatus = statusInfo.strainStatus;
      
      return updatedPlayer;
    }
    return player;
  }));
};

export const applyDamageToPlayer = (players, setPlayers, playerId, woundDamage, strainDamage) => {
  const player = players.find(p => p.id === playerId);
  if (!player) return false;
  
  const newWounds = woundDamage >= player.soak ? player.wounds + (woundDamage - player.soak) : player.wounds;
  const newStrain = player.strain + (strainDamage || 0);
  
  updatePlayerHealth(players, setPlayers, playerId, newWounds, newStrain);
  return true;
};

// You'll also need to export the determinePlayerStatus function
export const determinePlayerStatus = (player) => {
  const woundPercentage = (player.wounds / player.maxWounds) * 100;
  const strainPercentage = (player.strain / player.maxStrain) * 100;

  let woundStatus = 'healthy';
  let strainStatus = 'normal';
  let overallStatus = 'healthy';

  if (woundPercentage >= 200) {
    woundStatus = 'dead';
  } else if (woundPercentage >= 100) {
    woundStatus = 'incapacitated';
  } else if (woundPercentage >= 50) {
    woundStatus = 'injured';
  }

  if (strainPercentage >= 100) {
    strainStatus = 'incapacitated';
  } else if (strainPercentage >= 50) {
    strainStatus = 'critical';
  }

  if (woundPercentage >= 200) {
    overallStatus = 'dead';
  } else if (woundPercentage >= 100 || strainPercentage >= 100) {
    overallStatus = 'incapacitated';
  } else if (strainPercentage >= 50) {
    overallStatus = 'critical';
  } else if (woundPercentage >= 50) {
    overallStatus = 'injured';
  }

  return { overallStatus, woundStatus, strainStatus };
};

const PlayerManager = ({ 
  players, 
  setPlayers, 
  selectedMoon,
  currentRound,
  buildingData = null,
  setBuildingData,  // Add this line
  currentFloor = 0,
  onPlayerPositionChange
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [showPositioning, setShowPositioning] = useState(false);
  const [positioningPlayer, setPositioningPlayer] = useState(null);
  const [positionMode, setPositionMode] = useState('interior');
  const dropInProgressRef = useRef(new Set());

  const statusOptions = [
    { value: 'healthy', label: 'Healthy', color: 'bg-green-500', textColor: 'text-green-800' },
    { value: 'injured', label: 'Injured', color: 'bg-yellow-500', textColor: 'text-yellow-800' },
    { value: 'critical', label: 'Critical', color: 'bg-orange-500', textColor: 'text-orange-800' },
    { value: 'incapacitated', label: 'Incapacitated', color: 'bg-red-500', textColor: 'text-red-800' },
    { value: 'dead', label: 'Dead', color: 'bg-gray-500', textColor: 'text-gray-800' }
  ];

  const INTERIOR_GRID_SIZE = 21;
  const EXTERIOR_GRID_SIZE = 13;

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      alert('Please enter a player name!');
      return;
    }
  
    const newPlayer = {
      id: Date.now(),
      name: newPlayerName.trim(),
      status: 'healthy',
      woundStatus: 'healthy',
      strainStatus: 'normal',
      wounds: 0,
      maxWounds: 12,
      strain: 0,
      maxStrain: 12,
      brawn: 2, // Default Brawn for encumbrance calculation
      soak: 2, //Default
      meleeDefense: 0,
      rangedDefense: 0,
      notes: '',
      inventory: [
        { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
        { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
        { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
        { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
        { name: 'Pro Flashlight', weight: 5, price: 0, conductive: false, twoHanded: false },
        { name: 'Walkie-Talkie', weight: 0, price: 0, conductive: false, twoHanded: false }
      ],
      position: {
        interior: { x: null, y: null, floor: 0, room: null },
        exterior: { x: null, y: null, terrain: null },
        currentArea: 'exterior'
      }
    };
  
    setPlayers(prev => [...prev, newPlayer]);
    setNewPlayerName('');
    setShowAddPlayer(false);
  };

  const removePlayer = (playerId) => {
    if (window.confirm('Are you sure you want to remove this player?')) {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
      if (editingPlayerId === playerId) setEditingPlayerId(null);
      if (positioningPlayer?.id === playerId) {
        setPositioningPlayer(null);
        setShowPositioning(false);
      }
    }
  };

  const updatePlayer = (playerId, property, value) => {
    setPlayers(prev => prev.map(player => {
      if (player.id === playerId) {
        const updatedPlayer = { ...player, [property]: value };

        if (property === 'wounds' || property === 'maxWounds' || property === 'strain' || property === 'maxStrain') {
          const statusInfo = determinePlayerStatus(updatedPlayer);
          updatedPlayer.status = statusInfo.overallStatus;
          updatedPlayer.woundStatus = statusInfo.woundStatus;
          updatedPlayer.strainStatus = statusInfo.strainStatus;
        }

        return updatedPlayer;
      }
      return player;
    }));
  };

  const updateInventoryItem = (playerId, itemIndex, field, value) => {
    setPlayers(prev => prev.map(player => {
      if (player.id === playerId) {
        // Ensure inventory exists
        const currentInventory = player.inventory || [
          { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
          { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
          { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
          { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
          { name: 'Pro Flashlight', weight: 5, price: 0, conductive: false, twoHanded: false },
          { name: 'Walkie-Talkie', weight: 0, price: 0, conductive: false, twoHanded: false }
        ];
        
        const newInventory = [...currentInventory];
        newInventory[itemIndex] = {
          ...newInventory[itemIndex],
          [field]: field === 'name' ? value : 
                   field === 'conductive' || field === 'twoHanded' ? Boolean(value) :
                   (parseFloat(value) || 0)
        };
        return { ...player, inventory: newInventory };
      }
      return player;
    }));
  };

  const calculateEncumbrance = (player) => {
    // Ensure inventory exists, create default if not
    const inventory = player.inventory || [
      { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
      { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
      { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
      { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
      { name: 'Pro Flashlight', weight: 5, price: 0, conductive: false, twoHanded: false },
      { name: 'Walkie-Talkie', weight: 0, price: 0, conductive: false, twoHanded: false }
    ];
    
    const totalWeight = inventory.reduce((sum, item) => sum + (item.weight || 0), 0);
    const totalPrice = inventory.reduce((sum, item) => sum + (item.price || 0), 0);
    const encumbrance = Math.floor(totalWeight / 15);
    const threshold = (player.brawn || 2) + 5;
    
    return {
      totalWeight,
      totalPrice,
      encumbrance,
      threshold,
      overEncumbered: encumbrance > threshold,
      encumbranceLevel: encumbrance - threshold
    };
  };

  const determinePlayerStatus = (player) => {
    const woundPercentage = (player.wounds / player.maxWounds) * 100;
    const strainPercentage = (player.strain / player.maxStrain) * 100;

    let woundStatus = 'healthy';
    let strainStatus = 'normal';
    let overallStatus = 'healthy';

    if (woundPercentage >= 200) {
      woundStatus = 'dead';
    } else if (woundPercentage >= 100) {
      woundStatus = 'incapacitated';
    } else if (woundPercentage >= 50) {
      woundStatus = 'injured';
    }

    if (strainPercentage >= 100) {
      strainStatus = 'incapacitated';
    } else if (strainPercentage >= 50) {
      strainStatus = 'critical';
    }

    if (woundPercentage >= 200) {
      overallStatus = 'dead';
    } else if (woundPercentage >= 100 || strainPercentage >= 100) {
      overallStatus = 'incapacitated';
    } else if (strainPercentage >= 50) {
      overallStatus = 'critical';
    } else if (woundPercentage >= 50) {
      overallStatus = 'injured';
    }

    return { overallStatus, woundStatus, strainStatus };
  };

  const updatePlayerPosition = (playerId, area, x, y, additionalData = {}) => {
    setPlayers(prev => prev.map(player => {
      if (player.id === playerId) {
        const newPosition = { ...player.position };
        newPosition[area] = { x, y, ...additionalData };
        newPosition.currentArea = area;
        return { ...player, position: newPosition };
      }
      return player;
    }));

    if (onPlayerPositionChange) {
      onPlayerPositionChange(playerId, area, x, y, additionalData);
    }
  };

  const startPositioning = (player) => {
    setPositioningPlayer(player);
    setShowPositioning(true);
  };

  const handlePositionSelect = (x, y) => {
    if (!positioningPlayer) return;

    let additionalData = {};

    if (positionMode === 'interior' && buildingData) {
      const cellKey = `${x},${y}`;
      const cell = buildingData.floors[currentFloor]?.[cellKey];
      
      if (cell && cell.type === 'room' && cell.room) {
        additionalData = {
          floor: currentFloor,
          room: cell.room.name,
          roomType: cell.room
        };
      } else {
        alert('Invalid position! Please select a room cell.');
        return;
      }
    } else if (positionMode === 'exterior') {
      additionalData = { terrain: 'normal' };
    }

    updatePlayerPosition(positioningPlayer.id, positionMode, x, y, additionalData);
    setPositioningPlayer(null);
    setShowPositioning(false);
  };

  const clearPlayerPosition = (playerId, area) => {
    updatePlayerPosition(playerId, area, null, null, {});
  };

  const startEditingName = (player) => {
    setEditingPlayerId(player.id);
    setEditingName(player.name);
  };

  const saveEditedName = () => {
    if (editingName.trim()) {
      updatePlayer(editingPlayerId, 'name', editingName.trim());
    }
    setEditingPlayerId(null);
    setEditingName('');
  };

  const cancelEditingName = () => {
    setEditingPlayerId(null);
    setEditingName('');
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const quickAdjust = (playerId, type, amount) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const currentValue = player[type];
    const maxValue = player[`max${type.charAt(0).toUpperCase() + type.slice(1)}`];
    const absoluteMax = type === 'wounds' ? maxValue * 2 : maxValue;
    const newValue = Math.max(0, Math.min(absoluteMax, currentValue + amount));
    
    updatePlayer(playerId, type, newValue);
  };

  const getPositionDisplay = (player) => {
    const position = player.position;
    if (!position) return 'No position';

    const currentArea = position.currentArea;
    const areaData = position[currentArea];

    if (!areaData || areaData.x === null || areaData.y === null) {
      return `${currentArea === 'interior' ? 'Interior' : 'Exterior'}: Not set`;
    }

    if (currentArea === 'interior') {
      const roomText = areaData.room ? ` ${areaData.room}` : '';
      return `Interior: (${areaData.x},${areaData.y}) F${areaData.floor}${roomText}`;
    } else {
      return `Exterior: (${areaData.x},${areaData.y})`;
    }
  };

  const dropItemInRoom = (playerId, itemIndex) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
  
    // Check if player is in a valid interior room
    if (player.position?.currentArea !== 'interior' || 
        !player.position.interior.x || 
        !player.position.interior.room) {
      alert('Player must be in a valid interior room to drop items!');
      return;
    }
  
    const item = player.inventory[itemIndex];
    if (!item || !item.name || item.name.trim() === '') {
      alert('No item to drop!');
      return;
    }
  
    // Create truly unique ID using crypto random values
    const dropId = `dropped_${Date.now()}_${Math.random().toString(36).substr(2, 16)}_${Math.random().toString(36).substr(2, 16)}`;
  
    // Add item to building data as scrap at player's current position
    if (buildingData && buildingData.floors) {
      const floor = player.position.interior.floor;
      const cellKey = `${player.position.interior.x},${player.position.interior.y}`;
      
      setBuildingData(prev => {
        const newData = { ...prev };
        if (newData.floors[floor] && newData.floors[floor][cellKey]) {
          // Create scrap object with truly unique ID
          const droppedScrap = {
            id: dropId,
            name: item.name,
            weight: item.weight || 0,
            value: item.price || 0,
            conductive: item.conductive || false,
            twoHanded: item.twoHanded || false
          };
          
          // Add to scraps array
          if (!newData.floors[floor][cellKey].scraps) {
            newData.floors[floor][cellKey].scraps = [];
          }
          newData.floors[floor][cellKey].scraps.push(droppedScrap);
        
          // FIXED: Remove duplicates by ID, not name
          const scrapsArray = newData.floors[floor][cellKey].scraps;
          const seenIds = new Set();
          const uniqueScraps = [];
        
          scrapsArray.forEach(scrap => {
            if (!seenIds.has(scrap.id)) {
              seenIds.add(scrap.id);
              uniqueScraps.push(scrap);
            } else {
              console.log(`Removed duplicate scrap with ID: ${scrap.id}`);
            }
          });
        
          newData.floors[floor][cellKey].scraps = uniqueScraps;
        }
        return newData;
      });
    
      // Clear the inventory slot
      setPlayers(prev => prev.map(p => {
        if (p.id === playerId) {
          const newInventory = [...p.inventory];
          newInventory[itemIndex] = {
            name: '',
            weight: 0,
            price: 0,
            conductive: false,
            twoHanded: false
          };
          return { ...p, inventory: newInventory };
        }
        return p;
      }));
    
      alert(`${item.name} dropped in ${player.position.interior.room}!`);
    }
  };

  const sendItemToShip = (playerId, itemIndex) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const item = player.inventory[itemIndex];
    if (!item || !item.name || item.name.trim() === '') {
      alert('No item to send!');
      return;
    }

    // Use the exported function
    const success = addItemToShipInventory({
      name: item.name,
      weight: item.weight || 0,
      price: item.price || 0, // Note: using 'price' here, function will map it to 'value'
      conductive: item.conductive || false,
      twoHanded: item.twoHanded || false
    });

    if (success) {
      // Clear the inventory slot
      updateInventoryItem(playerId, itemIndex, 'name', '');
      updateInventoryItem(playerId, itemIndex, 'weight', 0);
      updateInventoryItem(playerId, itemIndex, 'price', 0);
      updateInventoryItem(playerId, itemIndex, 'conductive', false);
      updateInventoryItem(playerId, itemIndex, 'twoHanded', false);

      alert(`${item.name} sent to ship inventory!`);
    } else {
      alert('Failed to send item to ship!');
    }
  };

  const renderPositioningGrid = () => {
    if (!showPositioning || !positioningPlayer) return null;

    const gridSize = positionMode === 'interior' ? INTERIOR_GRID_SIZE : EXTERIOR_GRID_SIZE;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">
              Position {positioningPlayer.name} - {positionMode === 'interior' ? 'Interior' : 'Exterior'} Grid
            </h3>
            <button
              onClick={() => {
                setShowPositioning(false);
                setPositioningPlayer(null);
              }}
              className="text-white/70 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="mb-4 flex items-center space-x-4">
            <label className="text-white font-medium">Grid Mode:</label>
            <select
              value={positionMode}
              onChange={(e) => setPositionMode(e.target.value)}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white"
            >
              <option value="interior" className="bg-gray-800">Interior Building</option>
              <option value="exterior" className="bg-gray-800">Exterior Map</option>
            </select>
            {positionMode === 'interior' && (
              <span className="text-white/70">Floor {currentFloor}</span>
            )}
          </div>

          <div 
            className="grid gap-1 bg-gray-900 p-4 rounded-lg border border-white/20 mb-4"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              maxWidth: positionMode === 'interior' ? '800px' : '400px'
            }}
          >
            {Array.from({length: gridSize}, (_, y) => 
              Array.from({length: gridSize}, (_, x) => {
                const isCurrentPosition = positioningPlayer.position[positionMode]?.x === x && 
                                        positioningPlayer.position[positionMode]?.y === y;
                
                let cellClass = 'w-6 h-6 border border-gray-600 flex items-center justify-center text-xs cursor-pointer hover:bg-blue-500/30 transition-all ';
                
                if (isCurrentPosition) {
                  cellClass += 'bg-green-500 text-white ring-2 ring-green-400 ';
                } else {
                  cellClass += 'bg-gray-700 text-gray-300 hover:text-white ';
                }

                let isValid = true;
                let cellContent = `${x},${y}`;

                if (positionMode === 'interior' && buildingData) {
                  const cellKey = `${x},${y}`;
                  const cell = buildingData.floors[currentFloor]?.[cellKey];
                  
                  if (!cell || cell.type !== 'room' || !cell.room) {
                    isValid = false;
                    cellClass += 'opacity-50 cursor-not-allowed ';
                    cellContent = '█';
                  } else {
                    cellContent = cell.room.name?.charAt(0) || 'R';
                  }
                }

                return (
                  <div
                    key={`${x}-${y}`}
                    className={cellClass}
                    onClick={() => isValid && handlePositionSelect(x, y)}
                    title={isValid ? `Position: (${x},${y})` : 'Invalid position'}
                  >
                    {cellContent}
                  </div>
                );
              })
            ).flat()}
          </div>

          <div className="text-sm text-white/70 mb-4">
            Click on a {positionMode === 'interior' ? 'room' : 'terrain'} cell to position {positioningPlayer.name}
            {positionMode === 'interior' && ' (gray cells are walls/invalid)'}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => clearPlayerPosition(positioningPlayer.id, positionMode)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Clear Position
            </button>
            <button
              onClick={() => {
                setShowPositioning(false);
                setPositioningPlayer(null);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Header Bar */}
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold flex items-center space-x-2">
              <span>👥</span>
              <span>Players ({players.length})</span>
            </span>
            <span className="text-slate-400 text-sm">Manage crew status & positioning</span>
          </div>
          <button
            onClick={() => setShowAddPlayer(!showAddPlayer)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            ➕ Add Player
          </button>
        </div>
      </div>

      {/* Add Player Form */}
      {showAddPlayer && (
        <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Enter player name..."
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              autoFocus
            />
            <button
              onClick={addPlayer}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddPlayer(false);
                setNewPlayerName('');
              }}
              className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Players List */}
      {players.length === 0 ? (
        <div className="text-center text-slate-300 py-8">
          <div className="text-4xl mb-3">👤</div>
          <p className="text-lg mb-2">No players added yet</p>
          <p className="text-sm text-slate-400">Click "Add Player" to start building your crew!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {players.map((player) => {
            const statusInfo = getStatusInfo(player.status);
            const woundPercent = Math.round((player.wounds / player.maxWounds) * 100);
            const strainPercent = Math.round((player.strain / player.maxStrain) * 100);
            const encumbranceData = calculateEncumbrance(player);
            
            return (
              <div key={player.id} className="bg-slate-700 rounded-lg border border-slate-500">
                
                {/* Player Header */}
                <div className="p-3 border-b border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${statusInfo.color}`}></div>
                      {editingPlayerId === player.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveEditedName();
                              if (e.key === 'Escape') cancelEditingName();
                            }}
                            autoFocus
                          />
                          <button onClick={saveEditedName} className="text-green-400 hover:text-green-300">✓</button>
                          <button onClick={cancelEditingName} className="text-red-400 hover:text-red-300">✗</button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white">{player.name}</span>
                          <button
                            onClick={() => startEditingName(player)}
                            className="text-slate-400 hover:text-slate-200 text-sm"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-300 text-sm">
                        {getPositionDisplay(player)}
                      </span>
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Player Content - Horizontal Layout */}
                <div className="p-3">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    
                    {/* Health Stats */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white text-sm">Health Status</h4>
                      
                      {/* Brawn */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-blue-300 text-xs">Brawn</span>
                        </div>
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={player.brawn || 2}
                          onChange={(e) => updatePlayer(player.id, 'brawn', Math.max(1, Math.min(6, parseInt(e.target.value) || 2)))}
                          className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-xs text-white"
                        />

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-green-300 text-xs">Soak</span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={player.soak < player.brawn ? player.brawn : player.soak || 0}
                            onChange={(e) => updatePlayer(player.id, 'soak', Math.max(0, Math.min(20, parseInt(e.target.value) || 0)))}
                            className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-xs text-white"
                          />
                        </div>
                                            
                        {/* Melee Defense */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-red-300 text-xs">Melee Def</span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={player.meleeDefense || 0}
                            onChange={(e) => updatePlayer(player.id, 'meleeDefense', Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
                            className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-xs text-white"
                          />
                        </div>
                                            
                        {/* Ranged Defense */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-purple-300 text-xs">Ranged Def</span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={player.rangedDefense || 0}
                            onChange={(e) => updatePlayer(player.id, 'rangedDefense', Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
                            className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-xs text-white"
                          />
                        </div>
                      </div>
                      
                      {/* Wounds */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-red-300 text-xs">Wounds</span>
                          <span className="text-slate-300 text-xs">{player.wounds}/{player.maxWounds} ({woundPercent}%)</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 mb-2">
                          <button
                            onClick={() => quickAdjust(player.id, 'wounds', -1)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                            disabled={player.wounds === 0}
                          >
                            -1
                          </button>
                          
                          <div className="flex-1 bg-slate-600 rounded-full h-3 overflow-hidden relative">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                player.wounds >= player.maxWounds * 2 ? 'bg-black animate-pulse' :
                                player.wounds >= player.maxWounds ? 'bg-red-600' :
                                player.wounds >= player.maxWounds * 0.5 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(100, (player.wounds / player.maxWounds) * 100)}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                              {player.woundStatus.toUpperCase()}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => quickAdjust(player.id, 'wounds', 1)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                            disabled={player.wounds >= player.maxWounds * 2}
                          >
                            +1
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-1">
                          <input
                            type="number"
                            min="0"
                            max={player.maxWounds * 2}
                            value={player.wounds}
                            onChange={(e) => updatePlayer(player.id, 'wounds', Math.max(0, Math.min(player.maxWounds * 2, parseInt(e.target.value) || 0)))}
                            className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-xs text-white"
                          />
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={player.maxWounds}
                            onChange={(e) => updatePlayer(player.id, 'maxWounds', Math.max(1, parseInt(e.target.value) || 12))}
                            className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Strain */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-orange-300 text-xs">Strain</span>
                          <span className="text-slate-300 text-xs">{player.strain}/{player.maxStrain} ({strainPercent}%)</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 mb-2">
                          <button
                            onClick={() => quickAdjust(player.id, 'strain', -1)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                            disabled={player.strain === 0}
                          >
                            -1
                          </button>
                          
                          <div className="flex-1 bg-slate-600 rounded-full h-3 overflow-hidden relative">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                player.strain >= player.maxStrain ? 'bg-red-600 animate-pulse' :
                                player.strain >= player.maxStrain * 0.5 ? 'bg-orange-500' :
                                'bg-blue-500'
                              }`}
                              style={{ width: `${Math.max(5, (player.strain / player.maxStrain) * 100)}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                              {player.strainStatus.toUpperCase()}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => quickAdjust(player.id, 'strain', 1)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs"
                            disabled={player.strain >= player.maxStrain}
                          >
                            +1
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-1">
                          <input
                            type="number"
                            min="0"
                            max={player.maxStrain}
                            value={player.strain}
                            onChange={(e) => updatePlayer(player.id, 'strain', Math.max(0, Math.min(player.maxStrain, parseInt(e.target.value) || 0)))}
                            className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-xs text-white"
                          />
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={player.maxStrain}
                            onChange={(e) => updatePlayer(player.id, 'maxStrain', Math.max(1, parseInt(e.target.value) || 12))}
                            className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inventory & Encumbrance */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white text-sm">Inventory</h4>
                      
                      {/* Encumbrance Summary */}
                      <div className={`p-2 rounded border ${encumbranceData.overEncumbered ? 'bg-red-500/20 border-red-400/30' : 'bg-green-500/20 border-green-400/30'}`}>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-white">Weight:</span>
                            <span className="text-white">{encumbranceData.totalWeight} lbs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white">Encumbrance:</span>
                            <span className={encumbranceData.overEncumbered ? 'text-red-300' : 'text-green-300'}>
                              {encumbranceData.encumbrance}/{encumbranceData.threshold}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white">Total Value:</span>
                            <span className="text-yellow-300">{encumbranceData.totalPrice}¢</span>
                          </div>
                          {encumbranceData.overEncumbered && (
                            <div className="text-red-300 text-xs mt-1">
                              ⚠️ Over by {encumbranceData.encumbranceLevel}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Item Slots */}
                      <div className="space-y-2">
                        {(player.inventory || [
                          { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
                          { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
                          { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
                          { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
                          { name: 'Pro Flashlight', weight: 5, price: 0, conductive: false, twoHanded: false },
                          { name: 'Walkie-Talkie', weight: 0, price: 0, conductive: false, twoHanded: false }
                        ]).map((item, index) => (
                          <div key={index} className="space-y-1">
                            {/* Item Name */}
                            <input
                              type="text"
                              placeholder="Item name"
                              value={item.name}
                              onChange={(e) => updateInventoryItem(player.id, index, 'name', e.target.value)}
                              className="w-full px-1 py-1 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 text-xs"
                              disabled={index > 3}
                            />
                            
                            {/* Weight, Price, Conductive, Two-Handed, Clear Row */}
                            <div className="grid grid-cols-6 gap-1">
                              <input
                                type="number"
                                placeholder="lbs"
                                min="0"
                                step="0.1"
                                value={item.weight || ''}
                                onChange={(e) => updateInventoryItem(player.id, index, 'weight', e.target.value)}
                                className="px-1 py-1 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 text-xs"
                                disabled={index > 4}
                              />
                              <input
                                type="number"
                                placeholder="¢"
                                min="0"
                                value={item.price || ''}
                                onChange={(e) => updateInventoryItem(player.id, index, 'price', e.target.value)}
                                className="px-1 py-1 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 text-xs"
                                disabled={index > 3}
                              />
                              <div className="flex flex-col items-center">
                                <span className="text-blue-300 text-xs mb-1">⚡</span>
                                <input
                                  type="checkbox"
                                  checked={item.conductive || false}
                                  onChange={(e) => updateInventoryItem(player.id, index, 'conductive', e.target.checked)}
                                  className="w-3 h-3"
                                  disabled={index > 3}
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-orange-300 text-xs mb-1">🤲</span>
                                <input
                                  type="checkbox"
                                  checked={item.twoHanded || false}
                                  onChange={(e) => updateInventoryItem(player.id, index, 'twoHanded', e.target.checked)}
                                  className="w-3 h-3"
                                  disabled={index > 3}
                                />
                              </div>

                              {/* Drop in Room Button */}
                              <button
                                onClick={() => dropItemInRoom(player.id, index)}
                                disabled={index > 3 || !item.name || item.name.trim() === '' || player.position?.currentArea !== 'interior'}
                                className={`px-1 py-1 rounded text-xs ${
                                  index > 3 || !item.name || item.name.trim() === '' || player.position?.currentArea !== 'interior'
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                                title="Drop in current room"
                              >
                                🏠
                              </button>
                              
                              {/* Send to Ship Button */}
                              <button
                                onClick={() => sendItemToShip(player.id, index)}
                                disabled={index > 3 || !item.name || item.name.trim() === ''}
                                className={`px-1 py-1 rounded text-xs ${
                                  index > 3 || !item.name || item.name.trim() === ''
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                                title="Send to ship"
                              >
                                🚢
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Position Management */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white text-sm">Position</h4>
                      
                      <div className="space-y-2">
                        <div className="bg-blue-500/20 border border-blue-400/30 rounded p-2">
                          <div className="text-blue-300 text-xs mb-1">Current Location</div>
                          <div className="text-blue-200 text-xs">
                            {getPositionDisplay(player)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-1">
                          <button
                            onClick={() => startPositioning(player)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                          >
                            📍 Set Pos
                          </button>
                          <button
                            onClick={() => clearPlayerPosition(player.id, player.position?.currentArea || 'exterior')}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 py-1 rounded text-xs border border-red-400/30"
                          >
                            🗑️ Clear
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Notes & Quick Actions */}
                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="font-semibold text-white text-sm">Notes & Status</h4>
                      
                      <textarea
                        value={player.notes}
                        onChange={(e) => updatePlayer(player.id, 'notes', e.target.value)}
                        placeholder="Equipment, conditions, mission notes..."
                        className="w-full px-2 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-xs"
                        rows="3"
                      />
                      
                      {/* Quick Note Templates - Compact Grid */}
                      <div className="grid grid-cols-5 gap-1">
                        {[
                          '🔦 Flashlight',
                          '📻 Radio', 
                          '🔋 Low battery',
                          '🩹 Bandaged',
                          '😰 Stressed',
                          '🏃 Moving',
                          '🎒 Carrying',
                          '🚪 At entrance',
                          '⚡ In danger',
                          '🤝 With team'
                        ].map((template) => (
                          <button
                            key={template}
                            onClick={() => {
                              const currentNotes = player.notes;
                              const newNote = currentNotes ? `${currentNotes}\n${template}` : template;
                              updatePlayer(player.id, 'notes', newNote);
                            }}
                            className="bg-slate-600 hover:bg-slate-500 text-slate-300 hover:text-white px-1 py-1 rounded text-xs transition-colors border border-slate-500"
                            title={template}
                          >
                            {template.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Positioning Modal */}
      {renderPositioningGrid()}
    </div>
  );
};

export default PlayerManager;