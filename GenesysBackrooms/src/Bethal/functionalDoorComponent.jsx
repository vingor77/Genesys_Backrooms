// Functional Door Interaction Component - Themed for Interior Grid
import React, { useState } from 'react';
import { handleDoorInteraction, getAvailableActions, isSecureDoor } from './doorSystem.jsx';
import { DOOR_TYPES } from './indoorData.jsx';

// Enhanced functional door action handler (no keycards) - FIXED CONNECTED DOORS
export const useDoorActions = (setBuildingData, currentFloor, setSelectedCell) => {
  const [doorMessage, setDoorMessage] = useState('');
  
  const handleDoorAction = (door, cellKey, action) => {
    const result = handleDoorInteraction(door, cellKey, action);
    
    // Show message to user
    setDoorMessage(result.message);
    setTimeout(() => setDoorMessage(''), 3000); // Clear message after 3 seconds
    
    if (result.success) {
      // Update the building data
      setBuildingData(prev => {
        const newFloors = { ...prev.floors };
        const layout = { ...newFloors[currentFloor] };
        
        // Update the main door cell
        const cell = { ...layout[cellKey] };
        cell.door = result.newDoorType;
        layout[cellKey] = cell;
        
        // FIXED: Update connected door if it exists
        if (door.connectsTo && door.id) {
          const connectedCellKey = door.connectsTo;
          const connectedCell = layout[connectedCellKey];
          
          if (connectedCell && connectedCell.door && connectedCell.door.id === door.id) {
            const oppositeSides = { north: 'south', south: 'north', east: 'west', west: 'east' };
            
            // Create updated connected door with same state but opposite side
            const updatedConnectedCell = { ...connectedCell };
            updatedConnectedCell.door = { 
              ...result.newDoorType, 
              side: oppositeSides[result.newDoorType.side || door.side || 'north'],
              connectsTo: cellKey, // Points back to the original cell
              id: door.id
            };
            
            layout[connectedCellKey] = updatedConnectedCell;
          }
        }
        
        newFloors[currentFloor] = layout;
        return { ...prev, floors: newFloors };
      });
      
      // Update selected cell to reflect changes immediately
      setSelectedCell(prev => prev ? { 
        ...prev, 
        door: result.newDoorType 
      } : null);
    }
    
    return result;
  };
  
  return { handleDoorAction, doorMessage };
};

// Enhanced Door Interaction Panel Component - THEMED
export const FunctionalDoorPanel = ({ selectedCell, playerKeycards, onDoorAction, doorMessage }) => {
  if (!selectedCell || !selectedCell.door) return null;
  
  const door = selectedCell.door;
  const availableActions = getAvailableActions(door, playerKeycards);
  
  // Helper function to get button color - DARK THEME
  const getButtonColor = (color, enabled) => {
    if (!enabled) return 'bg-slate-600 text-slate-400 cursor-not-allowed';
    
    switch(color) {
      case 'green': return 'bg-green-600 hover:bg-green-700 text-white';
      case 'blue': return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'orange': return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700 text-white';
      default: return 'bg-slate-600 hover:bg-slate-700 text-white';
    }
  };
  
  // Helper function to get door status color - DARK THEME
  const getDoorStatusColor = (door) => {
    if (door.passable) return 'text-green-400';
    if (isSecureDoor(door)) return 'text-orange-400';
    if (door.name.includes('Locked')) return 'text-red-400';
    return 'text-blue-400';
  };
  
  // Get door icon and status
  const getDoorIcon = (door) => {
    if (door.passable) return '🟢';
    if (door.name.includes('Locked')) return '🔒';
    if (isSecureDoor(door)) return '🛡️';
    return '🔴';
  };
  
  return (
    <div className="bg-slate-600/80 p-2 rounded text-white mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm flex items-center space-x-1">
          <span>🚪</span>
          <span>{door.name}</span>
        </span>
        <span className={`text-xs font-bold ${getDoorStatusColor(door)}`}>
          {getDoorIcon(door)} {door.passable ? 'Open' : 'Closed'}
        </span>
      </div>
      
      {/* Compact Door Info */}
      <div className="text-xs text-slate-200 mb-2 bg-slate-700/50 p-1 rounded">
        <div className="flex justify-between">
          <span>Type: {isSecureDoor(door) ? 'Secure' : 'Regular'}</span>
          <span>Side: {door.side?.toUpperCase() || 'Unknown'}</span>
        </div>
        {door.connectsTo && (
          <div className="text-slate-300 mt-1">Connects to: {door.connectsTo}</div>
        )}
      </div>
      
      {/* Compact Action Buttons */}
      {availableActions.length === 0 ? (
        <div className="text-xs text-slate-400 italic text-center py-1">
          No actions available
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1">
          {availableActions.map((actionData, index) => (
            <button
              key={index}
              onClick={() => onDoorAction(door, `${selectedCell.x},${selectedCell.y}`, actionData.action)}
              disabled={!actionData.enabled}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                getButtonColor(actionData.color, actionData.enabled)
              }`}
            >
              {actionData.label}
            </button>
          ))}
        </div>
      )}
      
      {/* Compact Security Notice */}
      {isSecureDoor(door) && (
        <div className="mt-2 text-xs text-orange-300 bg-orange-500/20 p-1 rounded">
          ⚠️ Secure door - keycard required
        </div>
      )}
    </div>
  );
};

// Helper function to get enhanced door indicator for grid
export const getEnhancedDoorIndicator = (door) => {
  if (!door) return null;
  
  // Helper function to check door types by comparing properties
  const isDoorType = (doorToCheck, targetType) => {
    return doorToCheck.name === targetType.name && 
           doorToCheck.passable === targetType.passable;
  };
  
  if (isDoorType(door, DOOR_TYPES.OPEN) || isDoorType(door, DOOR_TYPES.SECURE_OPEN)) {
    return 'bg-lime-500 border-lime-700'; // Bright green for open doors
  } else if (isDoorType(door, DOOR_TYPES.LOCKED)) {
    return 'bg-red-600 border-red-800'; // Red for locked doors
  } else if (isSecureDoor(door)) {
    return 'bg-indigo-500 border-indigo-700'; // Indigo for secure doors (was orange)
  } else {
    return 'bg-blue-500 border-blue-700'; // Blue for closed doors
  }
};

// Enhanced tooltip for doors
export const getEnhancedDoorTooltip = (door) => {
  if (!door) return '';
  
  const doorStatus = door.passable ? 'Open' : 'Closed';
  const doorTypeInfo = isSecureDoor(door) ? ' (Secure)' : '';
  const lockStatus = door.name.includes('Locked') ? ' (Locked)' : '';
  
  return `🚪 ${door.name}${doorTypeInfo}${lockStatus} - ${doorStatus} (${door.side || 'unknown'} side)`;
};