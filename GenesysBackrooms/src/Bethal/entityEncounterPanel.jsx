import React, { useState, useEffect } from 'react';
import { getEntityByName } from './entityData.jsx';

const EntityEncounterPanel = ({ entity, onClose, onEntityUpdate, onSpecialAbility }) => {
  const [currentWounds, setCurrentWounds] = useState(0);
  const [currentStrain, setCurrentStrain] = useState(0);
  const [groupWounds, setGroupWounds] = useState(0);
  const [fullEntityData, setFullEntityData] = useState(null);

  // Fetch full entity data when entity changes
  useEffect(() => {
    if (entity?.name) {
      // Determine entity type for fetching - map to correct types
      let entityType = 'all';
      if (entity.type === 'indoor') entityType = 'indoor';
      else if (entity.type === 'outdoor') entityType = 'night'; // Fix: outdoor entities are in nightEntities
      else if (entity.type === 'daytime') entityType = 'daytime';

      // Fetch full entity data from entityData.jsx
      const fetchedData = getEntityByName(entity.name, entityType);
      
      if (fetchedData) {
        // Merge fetched data with current entity tracking data
        setFullEntityData({
          ...fetchedData,
          // Keep the tracking data from the spawned entity
          id: entity.id,
          currentWounds: entity.currentWounds || 0,
          currentStrain: entity.currentStrain || 0,
          currentGroupWounds: entity.currentGroupWounds || 0,
          specialState: entity.specialState,
          timerState: entity.timerState,
          powerLevel: entity.powerLevel,
          type: entity.type,
          spawnLocation: entity.spawnLocation,
          location: entity.location
        });
      } else {
        // Fallback - use the basic entity data
        setFullEntityData(entity);
      }

      // Initialize health values
      setCurrentWounds(entity.currentWounds || 0);
      setCurrentStrain(entity.currentStrain || 0);
      setGroupWounds(entity.currentGroupWounds || 0);
    }
  }, [entity]);

  const handleHealthUpdate = (type, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const entityKey = entity.id || entity.name;
    
    if (type === 'wounds' && fullEntityData?.derived_attributes?.wound_threshold) {
      const maxWounds = fullEntityData.derived_attributes.wound_threshold;
      const clampedValue = Math.min(numValue, maxWounds);
      setCurrentWounds(clampedValue);
      
      if (onEntityUpdate) {
        onEntityUpdate(entityKey, { currentWounds: clampedValue });
      }
    } else if (type === 'strain' && fullEntityData?.derived_attributes?.strain_threshold) {
      const maxStrain = fullEntityData.derived_attributes.strain_threshold;
      const clampedValue = Math.min(numValue, maxStrain);
      setCurrentStrain(clampedValue);
      
      if (onEntityUpdate) {
        onEntityUpdate(entityKey, { currentStrain: clampedValue });
      }
    } else if (type === 'groupWounds' && fullEntityData?.derived_attributes?.group_wound_threshold) {
      const maxGroupWounds = fullEntityData.derived_attributes.group_wound_threshold;
      const clampedValue = Math.min(numValue, maxGroupWounds);
      setGroupWounds(clampedValue);
      
      if (onEntityUpdate) {
        onEntityUpdate(entityKey, { currentGroupWounds: clampedValue });
      }
    }
  };

  // Determine entity type based on data structure
  const getEntityType = (entityData) => {
    if (entityData?.characteristics && entityData?.derived_attributes) {
      return 'complex'; // Indoor or Night entities
    }
    return 'simple'; // Daytime entities
  };

  const entityType = getEntityType(fullEntityData);

  // Render special state information for complex entities
  const renderSpecialState = (specialState, timerState) => {
    if (!specialState && !timerState) return null;
    
    return (
      <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-400/30">
        <h4 className="text-purple-300 font-semibold mb-3 text-lg">Entity State & Mechanics</h4>
        
        {/* Movement State */}
        {timerState && (
          <div className="mb-4 bg-blue-500/20 p-3 rounded border border-blue-400/30">
            <h5 className="text-blue-300 font-medium mb-2">Movement Status</h5>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-white/70">Current Mode:</span>
                <span className={`ml-2 font-bold ${timerState.isChasing ? 'text-red-400' : 'text-green-400'}`}>
                  {timerState.isChasing ? 'CHASING' : 'PASSIVE'}
                </span>
              </div>
              <div>
                <span className="text-white/70">Move Timer:</span>
                <span className="text-white font-bold ml-2">{timerState.currentTimer} rounds</span>
              </div>
              {specialState?.extraMovement > 0 && (
                <div className="col-span-2">
                  <span className="text-orange-300 font-bold">Extra Movement: +{specialState.extraMovement} tiles</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Special Mechanics by Entity */}
        {specialState && renderEntitySpecificMechanics(fullEntityData, specialState)}
        
        {/* Manual Control Buttons */}
        {renderSpecialAbilityButtons(fullEntityData)}
      </div>
    );
  };

  // Render entity-specific special mechanics
  const renderEntitySpecificMechanics = (entityData, specialState) => {
    const entityName = entityData?.name || '';
    
    if (entityName.includes("Bracken")) {
      return (
        <div className="mb-3 bg-red-500/20 p-3 rounded border border-red-400/30">
          <h5 className="text-red-300 font-medium mb-2">Anger Meter</h5>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-black/30 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-300"
                style={{ width: `${(specialState.angerMeter / 5) * 100}%` }}
              />
            </div>
            <span className="text-white font-bold">{specialState.angerMeter}/5</span>
          </div>
          {specialState.angerMeter >= 5 && (
            <div className="text-red-400 text-sm font-bold mt-1">ENRAGED - Gains Vicious 2!</div>
          )}
          {specialState.targetedPlayer && (
            <div className="text-blue-300 text-sm mt-1">Targeting: Player {specialState.targetedPlayer}</div>
          )}
        </div>
      );
    }

    if (entityName.includes("Jester")) {
      return (
        <div className="mb-3 bg-red-500/20 p-3 rounded border border-red-400/30">
          <h5 className="text-red-300 font-medium mb-2">Rage Meter</h5>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-black/30 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-300"
                style={{ width: `${(specialState.rageMeter / 15) * 100}%` }}
              />
            </div>
            <span className="text-white font-bold">{specialState.rageMeter}/15</span>
          </div>
          {specialState.rageMeter >= 15 && (
            <div className="text-red-400 text-sm font-bold mt-1 animate-pulse">CHASE MODE - Playing music!</div>
          )}
        </div>
      );
    }

    if (entityName.includes("Earth Leviathan") || entityName.includes("Eyeless Dog") || entityName.includes("Forest Keeper")) {
      const threshold = entityName.includes("Earth Leviathan") ? 8 : 9;
      return (
        <div className="mb-3 bg-yellow-500/20 p-3 rounded border border-yellow-400/30">
          <h5 className="text-yellow-300 font-medium mb-2">Suspicion Meter</h5>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-black/30 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-300"
                style={{ width: `${(specialState.suspicionMeter / threshold) * 100}%` }}
              />
            </div>
            <span className="text-white font-bold">{specialState.suspicionMeter}/{threshold}</span>
          </div>
          {specialState.suspicionMeter >= threshold && (
            <div className="text-red-400 text-sm font-bold mt-1">TRIGGERED - Entering attack mode!</div>
          )}
        </div>
      );
    }

    if (entityName.includes("Maneater")) {
      return (
        <div className="space-y-2">
          <div className="bg-purple-500/20 p-3 rounded border border-purple-400/30">
            <h5 className="text-purple-300 font-medium mb-2">Form Status</h5>
            <div className="text-sm">
              <div className={`font-bold ${specialState.isAdult ? 'text-red-400' : 'text-green-400'}`}>
                {specialState.isAdult ? 'ADULT FORM' : 'BABY FORM'}
              </div>
              {!specialState.isAdult && (
                <div className="mt-2">
                  <div className="text-white/70">Stress Meter:</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-black/30 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 transition-all duration-300"
                        style={{ width: `${(specialState.stressMeter / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-bold text-sm">{specialState.stressMeter}/10</span>
                  </div>
                  {specialState.stressMeter >= 10 && (
                    <div className="text-red-400 text-xs font-bold mt-1">READY TO TRANSFORM!</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (entityName.includes("Ghost Girl")) {
      return (
        <div className="mb-3 bg-indigo-500/20 p-3 rounded border border-indigo-400/30">
          <h5 className="text-indigo-300 font-medium mb-2">Haunting Status</h5>
          <div className="text-sm space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-white/70">Haunting Points:</span>
              <span className="text-white font-bold">{specialState.hauntingMeter}/3</span>
            </div>
            {specialState.targetedPlayer && (
              <div className="text-indigo-300">Haunting: Player {specialState.targetedPlayer}</div>
            )}
            {specialState.hauntingMeter >= 3 && (
              <div className="text-red-400 font-bold">85% chance to enter chase mode each round!</div>
            )}
          </div>
        </div>
      );
    }

    if (entityName.includes("Coil-Head")) {
      return (
        <div className="mb-3 bg-cyan-500/20 p-3 rounded border border-cyan-400/30">
          <h5 className="text-cyan-300 font-medium mb-2">Quantum Lock Status</h5>
          <div className={`font-bold text-lg ${specialState.isBeingObserved ? 'text-red-400' : 'text-green-400'}`}>
            {specialState.isBeingObserved ? 'FROZEN (Observed)' : 'MOBILE (Unobserved)'}
          </div>
          <div className="text-xs text-cyan-300 mt-1">
            Cannot move while being observed by employees within Medium range
          </div>
        </div>
      );
    }

    return null;
  };

  // Render special ability control buttons
  const renderSpecialAbilityButtons = (entityData) => {
    const buttons = [];
    
    if (entityData?.name?.includes("Maneater") && !entityData.specialState?.isAdult) {
      buttons.push(
        <button
          key="transform"
          onClick={() => onSpecialAbility?.(entityData.id, 'maneater_transform')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
        >
          Transform to Adult
        </button>
      );
    }

    if (entityData?.name?.includes("Coil-Head")) {
      buttons.push(
        <button
          key="observe"
          onClick={() => onSpecialAbility?.(entityData.id, 'coilhead_observe')}
          className={`${entityData.specialState?.isBeingObserved ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white px-3 py-2 rounded text-sm font-medium transition-colors`}
        >
          {entityData.specialState?.isBeingObserved ? 'Stop Observing' : 'Start Observing'}
        </button>
      );
    }

    if (buttons.length === 0) return null;

    return (
      <div className="mt-4 pt-3 border-t border-purple-400/30">
        <h5 className="text-purple-300 font-medium mb-2">Manual Controls</h5>
        <div className="flex flex-wrap gap-2">
          {buttons}
        </div>
      </div>
    );
  };

  if (!entity || !fullEntityData) return null;

  // Render characteristics for complex entities
  const renderCharacteristics = (characteristics) => {
    if (!characteristics) return null;
    
    return (
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(characteristics).map(([key, value]) => (
          <div key={key} className="bg-white/10 p-3 rounded-lg border border-white/20">
            <div className="text-sm text-white/70 capitalize font-medium">{key}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  // Render derived attributes (excluding health thresholds)
  const renderDerivedAttributes = (attributes) => {
    if (!attributes) return null;
    
    const otherAttributes = Object.entries(attributes).filter(([key]) => 
      !['wound_threshold', 'strain_threshold', 'group_wound_threshold'].includes(key)
    );
    
    if (otherAttributes.length === 0) return null;
    
    return (
      <div className="grid grid-cols-4 gap-3">
        {otherAttributes.map(([key, value]) => (
          <div key={key} className="bg-blue-500/20 p-3 rounded-lg border border-blue-400/30">
            <div className="text-sm text-blue-300 capitalize font-medium">{key.replace('_', ' ')}</div>
            <div className="text-xl font-bold text-white">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  // Render health tracking for complex entities
  const renderHealthTracking = (attributes) => {
    if (!attributes) return null;
    
    const hasWounds = attributes.wound_threshold !== undefined;
    const hasStrain = attributes.strain_threshold !== undefined;
    const hasGroupWounds = attributes.group_wound_threshold !== undefined;
    
    if (!hasWounds && !hasStrain && !hasGroupWounds) return null;
    
    return (
      <div className="bg-red-500/20 p-4 rounded-lg border border-red-400/30">
        <h4 className="text-red-300 font-semibold mb-3 text-lg">Health Tracking</h4>
        <div className="grid grid-cols-2 gap-6">
          
          {/* Individual Wounds */}
          {hasWounds && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-red-300 text-sm font-medium">Current Wounds</label>
                <span className="text-red-200 text-xs">Max: {attributes.wound_threshold}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max={attributes.wound_threshold}
                  value={currentWounds}
                  onChange={(e) => handleHealthUpdate('wounds', e.target.value)}
                  className="w-20 px-3 py-2 bg-black/30 border border-red-400/50 rounded text-white text-center focus:outline-none focus:border-red-400"
                />
                <span className="text-white">/ {attributes.wound_threshold}</span>
                <div className="flex-1 bg-black/30 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-300"
                    style={{ 
                      width: `${(currentWounds / attributes.wound_threshold) * 100}%`
                    }}
                  />
                </div>
              </div>
              {currentWounds >= attributes.wound_threshold && (
                <div className="text-red-400 text-xs font-bold animate-pulse">INCAPACITATED</div>
              )}
            </div>
          )}

          {/* Strain */}
          {hasStrain && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-blue-300 text-sm font-medium">Current Strain</label>
                <span className="text-blue-200 text-xs">Max: {attributes.strain_threshold}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max={attributes.strain_threshold}
                  value={currentStrain}
                  onChange={(e) => handleHealthUpdate('strain', e.target.value)}
                  className="w-20 px-3 py-2 bg-black/30 border border-blue-400/50 rounded text-white text-center focus:outline-none focus:border-blue-400"
                />
                <span className="text-white">/ {attributes.strain_threshold}</span>
                <div className="flex-1 bg-black/30 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 transition-all duration-300"
                    style={{ 
                      width: `${(currentStrain / attributes.strain_threshold) * 100}%`
                    }}
                  />
                </div>
              </div>
              {currentStrain >= attributes.strain_threshold && (
                <div className="text-red-400 text-xs font-bold animate-pulse">STRAINED OUT</div>
              )}
            </div>
          )}
        </div>
        
        {/* Group Wounds for Minion Groups */}
        {hasGroupWounds && (
          <div className="space-y-2 mt-4 pt-4 border-t border-red-400/30">
            <div className="flex items-center justify-between">
              <label className="text-orange-300 text-sm font-medium">Group Wounds</label>
              <span className="text-orange-200 text-xs">Max: {attributes.group_wound_threshold}</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max={attributes.group_wound_threshold}
                value={groupWounds}
                onChange={(e) => handleHealthUpdate('groupWounds', e.target.value)}
                className="w-20 px-3 py-2 bg-black/30 border border-orange-400/50 rounded text-white text-center focus:outline-none focus:border-orange-400"
              />
              <span className="text-white">/ {attributes.group_wound_threshold}</span>
              <div className="flex-1 bg-black/30 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-300"
                  style={{ 
                    width: `${(groupWounds / attributes.group_wound_threshold) * 100}%`
                  }}
                />
              </div>
            </div>
            <div className="text-orange-200 text-xs">
              Each threshold ({Math.floor(attributes.group_wound_threshold / (fullEntityData.type?.includes('3') ? 3 : 4))}) removes one group member
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render weapons for complex entities
  const renderWeapons = (weapons) => {
    if (!weapons || weapons.length === 0) return null;
    
    return (
      <div className="space-y-3">
        {weapons.map((weapon, index) => (
          <div key={index} className="bg-red-500/20 p-4 rounded-lg border border-red-400/30">
            <h4 className="text-red-300 font-semibold text-lg mb-2">{weapon.name}</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-white/70">Skill:</span> <span className="text-white font-medium">{weapon.skill}</span></div>
              <div><span className="text-white/70">Damage:</span> <span className="text-white font-medium">{weapon.damage}</span></div>
              <div><span className="text-white/70">Critical:</span> <span className="text-white font-medium">{weapon.critical}</span></div>
              <div><span className="text-white/70">Range:</span> <span className="text-white font-medium">{weapon.range}</span></div>
              {weapon.special && weapon.special.length > 0 && (
                <div className="col-span-3">
                  <span className="text-white/70">Special:</span> 
                  <span className="text-white font-medium ml-2">
                    {Array.isArray(weapon.special) ? weapon.special.join(', ') : weapon.special}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render talents
  const renderTalents = (talents) => {
    if (!talents || talents.length === 0) return null;
    
    return (
      <div className="space-y-3">
        {talents.map((talent, index) => (
          <div key={index} className="bg-purple-500/20 p-3 rounded-lg border border-purple-400/30">
            <h4 className="text-purple-300 font-semibold mb-1">{talent.name}</h4>
            <p className="text-white/80 text-sm">{talent.description}</p>
          </div>
        ))}
      </div>
    );
  };

  // Render abilities
  const renderAbilities = (abilities) => {
    if (!abilities || abilities.length === 0) return null;
    
    return (
      <div className="space-y-3">
        {abilities.map((ability, index) => (
          <div key={index} className="bg-green-500/20 p-3 rounded-lg border border-green-400/30">
            <h4 className="text-green-300 font-semibold mb-1">{ability.name}</h4>
            <p className="text-white/80 text-sm">{ability.description}</p>
          </div>
        ))}
      </div>
    );
  };

  // Render skills
  const renderSkills = (skills) => {
    if (!skills || Object.keys(skills).length === 0) return null;
    
    return (
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(skills).map(([skill, value], index) => (
          <div key={index} className="bg-yellow-500/20 p-2 rounded border border-yellow-400/30">
            <span className="text-yellow-200 text-sm font-medium capitalize">{skill}: {value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render movement info
  const renderMovement = (movement) => {
    if (!movement) return null;
    
    return (
      <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
        <h4 className="text-blue-300 font-semibold mb-3 text-lg">Movement</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-white/70">Passive:</span>
            <span className="text-white font-bold ml-2">{movement.passive}</span>
          </div>
          <div>
            <span className="text-white/70">Chasing:</span>
            <span className="text-white font-bold ml-2">{movement.chasing}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render complex entity (indoor/night entities)
  const renderComplexEntity = () => (
    <div className="space-y-6">
      
      {/* Special State Information - Show first for immediate reference */}
      {renderSpecialState(fullEntityData.specialState, fullEntityData.timerState)}

      {/* Entity Type Badge */}
      {fullEntityData.type && (
        <div className="flex justify-center">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
            fullEntityData.type.includes('Minion Group') ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30' :
            'bg-gray-500/20 text-gray-300 border border-gray-400/30'
          }`}>
            {fullEntityData.type}
          </span>
        </div>
      )}

      {/* Characteristics */}
      <div>
        <h3 className="text-white font-semibold mb-4 text-lg">Characteristics</h3>
        {renderCharacteristics(fullEntityData.characteristics)}
      </div>

      {/* Health Tracking */}
      {renderHealthTracking(fullEntityData.derived_attributes)}

      {/* Movement */}
      {renderMovement(fullEntityData.movement)}

      {/* Other Derived Attributes */}
      {renderDerivedAttributes(fullEntityData.derived_attributes) && (
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Combat Stats</h3>
          {renderDerivedAttributes(fullEntityData.derived_attributes)}
        </div>
      )}

      {/* Skills */}
      {fullEntityData.skills && (
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Skills</h3>
          <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-400/30">
            {renderSkills(fullEntityData.skills)}
          </div>
        </div>
      )}

      {/* Weapons & Attacks */}
      <div>
        <h3 className="text-white font-semibold mb-4 text-lg">Weapons & Attacks</h3>
        {renderWeapons(fullEntityData.weapons)}
      </div>

      {/* Talents and Abilities in two columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Talents */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Talents</h3>
          {renderTalents(fullEntityData.talents)}
        </div>

        {/* Special Abilities */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Special Abilities</h3>
          {renderAbilities(fullEntityData.abilities)}
        </div>
      </div>
    </div>
  );

  // Render simple entity (daytime entities)
  const renderSimpleEntity = () => (
    <div className="space-y-6">
      <div className="bg-white/10 p-4 rounded-lg border border-white/20">
        <h3 className="text-white font-semibold mb-3 text-lg">Description</h3>
        <p className="text-white/80 text-sm leading-relaxed">{fullEntityData.description}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
          <div className="text-blue-300 text-sm font-medium">Movement</div>
          <div className="text-white font-bold text-lg">
            P: {fullEntityData.movement?.passive} / C: {fullEntityData.movement?.chasing}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${fullEntityData.damage_capable ? 'bg-red-500/20 border-red-400/30' : 'bg-green-500/20 border-green-400/30'}`}>
          <div className={`text-sm font-medium ${fullEntityData.damage_capable ? 'text-red-300' : 'text-green-300'}`}>Threat Level</div>
          <div className="text-white font-bold text-lg">{fullEntityData.damage_capable ? 'DANGEROUS' : 'HARMLESS'}</div>
        </div>
        
        {fullEntityData.damage_capable && (
          <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-400/30">
            <div className="text-orange-300 text-sm font-medium">Damage</div>
            <div className="text-white font-bold text-lg">{fullEntityData.damage_amount}</div>
          </div>
        )}
      </div>
      
      {fullEntityData.damage_trigger && (
        <div className="bg-red-500/20 p-4 rounded-lg border border-red-400/30">
          <h4 className="text-red-300 font-semibold mb-2 text-lg">Damage Trigger</h4>
          <p className="text-white/80 text-sm leading-relaxed">{fullEntityData.damage_trigger}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-white/20 shadow-2xl max-w-7xl max-h-[95vh] w-full mx-4 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">{fullEntityData?.name || entity?.name}</h2>
              {fullEntityData?.type && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  fullEntityData.type.includes('Minion Group') ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30' :
                  'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                }`}>
                  {fullEntityData.type}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          {entityType === 'complex' ? renderComplexEntity() : renderSimpleEntity()}
        </div>
      </div>
    </div>
  );
};

export default EntityEncounterPanel;