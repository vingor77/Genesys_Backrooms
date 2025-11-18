import React, { useState, useEffect } from 'react';

// Entity rage configurations with max values and alt names
export const RAGE_CONFIG = {
  'Jester': { maxRage: 15, altNames: ['Music Box', 'Wind-up', 'Toy'] },
  'Bracken': { maxRage: 5, altNames: ['Flowerman', 'Red Eyes'] },
  'Ghost Girl': { maxRage: 3, altNames: ['Little Girl', 'Apparition'] },
  'Earth Leviathan': { maxRage: 8, altNames: ['Worm', 'Sand Worm', 'Leviathan'] },
  'Forest Keeper': { maxRage: 8, altNames: ['Giant', 'Tree Giant', 'Keeper'] },
  'Eyeless Dog': { maxRage: 9, altNames: ['Blind Dog', 'Dog'] },
  'Maneater': { maxRage: 10, altNames: ['Plant', 'Venus Flytrap', 'Carnivorous Plant'] },
  'Coil-Head': { maxRage: 1, altNames: ['Spring Man', 'Spring Head'] }
};

// Global rage state - single source of truth
const globalRageState = new Map();
const rageUpdateCallbacks = new Set();

// Global rage management functions
export const initializeEntityRage = (entityId, entityName) => {
  const config = findEntityRageConfig(entityName);
  if (config) {
    if (!globalRageState.has(entityId)) {
      globalRageState.set(entityId, {
        entityName: entityName,
        configName: config.name,
        currentRage: 0,
        maxRage: config.maxRage
      });
      notifyRageUpdate();
    }
    return true;
  }
  return false;
};

export const updateEntityRage = (entityId, newRage) => {
  const entityRage = globalRageState.get(entityId);
  if (entityRage) {
    const clampedRage = Math.max(0, Math.min(newRage, entityRage.maxRage));
    globalRageState.set(entityId, {
      ...entityRage,
      currentRage: clampedRage
    });
    notifyRageUpdate();
  }
};

export const removeEntityRage = (entityId) => {
  globalRageState.delete(entityId);
  notifyRageUpdate();
};

export const getEntityRage = (entityId) => {
  return globalRageState.get(entityId) || null;
};

export const clearAllRage = () => {
  globalRageState.clear();
  notifyRageUpdate();
};

export const isEntityAtMaxRage = (entityId) => {
  const rageData = globalRageState.get(entityId);
  return rageData && rageData.currentRage >= rageData.maxRage;
};

export const getAllRageStates = () => {
  return new Map(globalRageState);
};

// Callback system to notify components of updates
const notifyRageUpdate = () => {
  rageUpdateCallbacks.forEach(callback => callback());
};

export const subscribeToRageUpdates = (callback) => {
  rageUpdateCallbacks.add(callback);
  return () => rageUpdateCallbacks.delete(callback);
};

// Helper function to find entity config by name (including alt names)
export const findEntityRageConfig = (entityName) => {
  const normalizedName = entityName.toLowerCase();
  
  for (const [configName, config] of Object.entries(RAGE_CONFIG)) {
    // Check main name
    if (configName.toLowerCase().includes(normalizedName) || normalizedName.includes(configName.toLowerCase())) {
      return { name: configName, ...config };
    }
    
    // Check alt names
    const matchingAltName = config.altNames.find(altName => 
      altName.toLowerCase().includes(normalizedName) || normalizedName.includes(altName.toLowerCase())
    );
    
    if (matchingAltName) {
      return { name: configName, ...config };
    }
  }
  
  return null;
};

// Custom hook for components that need to react to rage changes
export const useRageSystem = () => {
  const [, setUpdateTrigger] = useState(0);
  
  useEffect(() => {
    const unsubscribe = subscribeToRageUpdates(() => {
      setUpdateTrigger(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);

  return {
    rageStates: getAllRageStates(),
    initializeEntityRage,
    updateEntityRage,
    removeEntityRage,
    getEntityRage,
    clearAllRage,
    isEntityAtMaxRage
  };
};

// Simplified Rage Meter Component
export const RageMeter = ({ entityId, entityName, onRageChange }) => {
  const [, setUpdateTrigger] = useState(0);
  
  // Subscribe to rage updates
  useEffect(() => {
    const unsubscribe = subscribeToRageUpdates(() => {
      setUpdateTrigger(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);

  // Initialize entity if not already done
  useEffect(() => {
    initializeEntityRage(entityId, entityName);
  }, [entityId, entityName]);

  const rageData = getEntityRage(entityId);
  if (!rageData) {
    return null; // Entity doesn't have rage tracking
  }

  const { currentRage, maxRage, configName } = rageData;

  const adjustRage = (delta) => {
    const newRage = Math.max(0, Math.min(currentRage + delta, maxRage));
    updateEntityRage(entityId, newRage);
    if (onRageChange) {
      onRageChange(entityId, newRage);
    }
  };

  const setRageDirectly = (value) => {
    const newRage = Math.max(0, Math.min(parseInt(value) || 0, maxRage));
    updateEntityRage(entityId, newRage);
    if (onRageChange) {
      onRageChange(entityId, newRage);
    }
  };

  const ragePercentage = (currentRage / maxRage) * 100;
  const getRageColor = () => {
    if (ragePercentage <= 25) return 'from-green-500 to-green-600';
    if (ragePercentage <= 50) return 'from-yellow-500 to-yellow-600';
    if (ragePercentage <= 75) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600 w-120 flex-shrink-0">
      <div className="flex items-center space-x-3">
        {/* Entity Name */}
        <div className="flex flex-col min-w-0">
          <span className="text-white font-medium text-sm truncate">{configName}</span>
          <span className="text-gray-400 text-sm truncate">({entityName})</span>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => adjustRage(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 text-sm font-bold transition-colors"
            disabled={currentRage <= 0}
          >
            -
          </button>

          <input
            type="number"
            min="0"
            max={maxRage}
            value={currentRage}
            onChange={(e) => setRageDirectly(e.target.value)}
            className="bg-gray-700 text-white rounded px-2 py-1 w-12 text-center text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
          />

          <button
            onClick={() => adjustRage(1)}
            className="bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 text-sm font-bold transition-colors"
            disabled={currentRage >= maxRage}
          >
            +
          </button>
        </div>

        {/* Rage Bar */}
        <div className="w-20 bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full bg-gradient-to-r ${getRageColor()} transition-all duration-300`}
            style={{ width: `${ragePercentage}%` }}
          />
        </div>

        {/* Rage Count and Status */}
        <div className="flex flex-col items-end">
          <span className="text-gray-300 text-sm">{currentRage}/{maxRage}</span>
          {currentRage > 0 && (
            <span className={`px-2 py-1 rounded text-sm ${
              ragePercentage <= 25 ? 'bg-green-600/20 text-green-400' :
              ragePercentage <= 50 ? 'bg-yellow-600/20 text-yellow-400' :
              ragePercentage <= 75 ? 'bg-orange-600/20 text-orange-400' :
              'bg-red-600/20 text-red-400'
            }`}>
              {ragePercentage <= 25 ? 'Calm' :
               ragePercentage <= 50 ? 'Agitated' :
               ragePercentage <= 75 ? 'Angry' : 'ENRAGED'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Simplified Rage Management Panel Component
export const RageManagementPanel = ({ entities, onRageUpdate }) => {
  const [, setUpdateTrigger] = useState(0);
  
  // Subscribe to rage updates
  useEffect(() => {
    const unsubscribe = subscribeToRageUpdates(() => {
      setUpdateTrigger(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);

  // Initialize rage for new entities
  useEffect(() => {
    entities.forEach(entity => {
      initializeEntityRage(entity.id, entity.name);
    });
  }, [entities]);

  // Clean up rage states for removed entities
  useEffect(() => {
    const entityIds = new Set(entities.map(e => e.id));
    const rageStates = getAllRageStates();
    Array.from(rageStates.keys()).forEach(rageEntityId => {
      if (!entityIds.has(rageEntityId)) {
        removeEntityRage(rageEntityId);
      }
    });
  }, [entities]);

  const handleRageChange = (entityId, newRage) => {
    if (onRageUpdate) {
      onRageUpdate(entityId, newRage);
    }
  };

  // Filter entities that have rage tracking
  const entitiesWithRage = entities.filter(entity => 
    findEntityRageConfig(entity.name) !== null
  );

  if (entitiesWithRage.length === 0) {
    return (
      <div className="text-center text-gray-400 text-sm py-4">
        <p>No entities with rage tracking are currently active.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Horizontal scrolling container for rage meters */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {entitiesWithRage.map(entity => (
          <RageMeter
            key={entity.id}
            entityId={entity.id}
            entityName={entity.name}
            onRageChange={handleRageChange}
          />
        ))}
      </div>

      <div className="text-xs text-gray-400 text-center">
        <p>Rage affects entity behavior and aggression levels. Monitor carefully!</p>
      </div>
      
      {/* Debug info */}
      <div className="text-xs text-gray-500">
        <p>Debug: Entities at max rage: {
          entitiesWithRage
            .filter(entity => isEntityAtMaxRage(entity.id))
            .map(entity => entity.name)
            .join(', ') || 'None'
        }</p>
      </div>
    </div>
  );
};