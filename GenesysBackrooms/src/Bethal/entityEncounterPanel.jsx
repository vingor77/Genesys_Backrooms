import React, { useState, useEffect } from 'react';

const EntityEncounterPanel = ({ entity, onClose, onEntityUpdate }) => {
  const [currentWounds, setCurrentWounds] = useState(0);
  const [currentStrain, setCurrentStrain] = useState(0);

  // Initialize health values when entity changes
  useEffect(() => {
    if (entity?.derived_attributes) {
      setCurrentWounds(entity.currentWounds || 0);
      setCurrentStrain(entity.currentStrain || 0);
    }
  }, [entity]);

  const handleHealthUpdate = (type, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const entityKey = entity.id || entity.name;
    
    if (type === 'wounds') {
      const maxWounds = entity.derived_attributes?.wound_threshold || 0;
      const clampedValue = Math.min(numValue, maxWounds);
      setCurrentWounds(clampedValue);
      
      // Call parent update function if provided
      if (onEntityUpdate) {
        console.log('Calling onEntityUpdate for wounds:', entityKey, { currentWounds: clampedValue }); // Debug log
        onEntityUpdate(entityKey, { currentWounds: clampedValue });
      }
    } else if (type === 'strain') {
      const maxStrain = entity.derived_attributes?.strain_threshold || 0;
      const clampedValue = Math.min(numValue, maxStrain);
      setCurrentStrain(clampedValue);
      
      // Call parent update function if provided
      if (onEntityUpdate) {
        console.log('Calling onEntityUpdate for strain:', entityKey, { currentStrain: clampedValue }); // Debug log
        onEntityUpdate(entityKey, { currentStrain: clampedValue });
      }
    }
  };

  if (!entity) return null;

  const renderCharacteristics = (characteristics) => {
    if (!characteristics) return null;
    
    return (
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(characteristics).map(([key, value]) => (
          <div key={key} className="bg-white/10 p-3 rounded-lg border border-white/20">
            <div className="text-sm text-white/70 capitalize font-medium">{key.replace('_', ' ')}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderDerivedAttributes = (attributes) => {
    if (!attributes) return null;
    
    const otherAttributes = Object.entries(attributes).filter(([key]) => 
      key !== 'wound_threshold' && key !== 'strain_threshold'
    );
    
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

  const renderHealthTracking = (attributes) => {
    if (!attributes) return null;
    
    return (
      <div className="bg-red-500/20 p-4 rounded-lg border border-red-400/30">
        <h4 className="text-red-300 font-semibold mb-3 text-lg">Health Tracking</h4>
        <div className="grid grid-cols-2 gap-6">
          {/* Wounds */}
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
              <div className="text-red-400 text-xs font-bold animate-pulse">💀 INCAPACITATED</div>
            )}
          </div>

          {/* Strain */}
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
              <div className="text-red-400 text-xs font-bold animate-pulse">🥴 STRAINED OUT</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWeaponsAttacks = (weapons) => {
    if (!weapons || weapons.length === 0) return null;
    
    return (
      <div className="space-y-3">
        {weapons.map((weapon, index) => (
          <div key={index} className="bg-red-500/20 p-4 rounded-lg border border-red-400/30">
            <h4 className="text-red-300 font-semibold text-lg mb-2">{weapon.name}</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-white/70">Type:</span> <span className="text-white font-medium">{weapon.type}</span></div>
              <div><span className="text-white/70">Skill:</span> <span className="text-white font-medium">{weapon.skill}</span></div>
              <div><span className="text-white/70">Damage:</span> <span className="text-white font-medium">{weapon.damage}</span></div>
              <div><span className="text-white/70">Critical:</span> <span className="text-white font-medium">{weapon.critical}</span></div>
              <div><span className="text-white/70">Range:</span> <span className="text-white font-medium">{weapon.range}</span></div>
              <div><span className="text-white/70">Qualities:</span> <span className="text-white font-medium">{weapon.qualities}</span></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTalents = (talents) => {
    if (!talents || talents.length === 0) return null;
    
    return (
      <div className="grid grid-cols-1 gap-3">
        {talents.map((talent, index) => (
          <div key={index} className="bg-purple-500/20 p-3 rounded-lg border border-purple-400/30">
            <h4 className="text-purple-300 font-semibold mb-1">{talent.name}</h4>
            <p className="text-white/80 text-sm">{talent.description}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderAbilities = (abilities) => {
    if (!abilities || abilities.length === 0) return null;
    
    return (
      <div className="grid grid-cols-1 gap-3">
        {abilities.map((ability, index) => (
          <div key={index} className="bg-green-500/20 p-3 rounded-lg border border-green-400/30">
            <h4 className="text-green-300 font-semibold mb-1">{ability.name}</h4>
            <p className="text-white/80 text-sm">{ability.description}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderSkills = (skills) => {
    if (!skills || skills.length === 0) return null;
    
    return (
      <div className="grid grid-cols-2 gap-2">
        {skills.map((skill, index) => (
          <div key={index} className="bg-yellow-500/20 p-2 rounded border border-yellow-400/30">
            <span className="text-yellow-200 text-sm font-medium">{skill}</span>
          </div>
        ))}
      </div>
    );
  };

  // For simpler entity types (daytime/nighttime)
  const renderSimpleEntity = () => (
    <div className="space-y-6">
      <div className="bg-white/10 p-4 rounded-lg border border-white/20">
        <h3 className="text-white font-semibold mb-3 text-lg">Description</h3>
        <p className="text-white/80 text-sm leading-relaxed">{entity.description}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
          <div className="text-blue-300 text-sm font-medium">Movement</div>
          <div className="text-white font-bold text-xl">{entity.movement}</div>
        </div>
        
        <div className="bg-red-500/20 p-4 rounded-lg border border-red-400/30">
          <div className="text-red-300 text-sm font-medium">Damage Capable</div>
          <div className="text-white font-bold text-xl">{entity.damage_capable ? 'Yes' : 'No'}</div>
        </div>
        
        {entity.damage_capable && (
          <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-400/30">
            <div className="text-orange-300 text-sm font-medium">Damage Amount</div>
            <div className="text-white font-bold text-xl">{entity.damage_amount}</div>
          </div>
        )}
      </div>
      
      {entity.damage_trigger && (
        <div className="bg-red-500/20 p-4 rounded-lg border border-red-400/30">
          <h4 className="text-red-300 font-semibold mb-2 text-lg">Damage Trigger</h4>
          <p className="text-white/80 text-sm">{entity.damage_trigger}</p>
        </div>
      )}
    </div>
  );

  // Check if this is a complex entity (indoor/nighttime with full stats) or simple entity (daytime)
  const isComplexEntity = entity.characteristics && entity.derived_attributes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-white/20 shadow-2xl max-w-7xl max-h-[95vh] w-full mx-4 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">{entity.name}</h2>
              {entity.alternate_name && (
                <p className="text-blue-300 text-xl">"{entity.alternate_name}"</p>
              )}
              {entity.type && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  entity.type === 'Nemesis' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                  entity.type === 'Rival' ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30' :
                  'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                }`}>
                  {entity.type}
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

        {/* Content - All visible at once for RPG play */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          
          {isComplexEntity ? (
            <div className="space-y-6">
              
              {/* Description */}
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <h3 className="text-white font-semibold mb-3 text-lg">Description</h3>
                <p className="text-white/80 text-sm leading-relaxed">{entity.description}</p>
              </div>

              {/* Characteristics */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Characteristics</h3>
                {renderCharacteristics(entity.characteristics)}
              </div>

              {/* Health Tracking - Most Important for RPG */}
              {renderHealthTracking(entity.derived_attributes)}

              {/* Other Derived Attributes */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Derived Attributes</h3>
                {renderDerivedAttributes(entity.derived_attributes)}
              </div>

              {/* Skills */}
              {entity.skills && (
                <div>
                  <h3 className="text-white font-semibold mb-4 text-lg">Skills</h3>
                  <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-400/30">
                    {renderSkills(entity.skills)}
                  </div>
                </div>
              )}

              {/* Weapons & Attacks */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Weapons & Attacks</h3>
                {renderWeaponsAttacks(entity.weapons_attacks)}
              </div>

              {/* Talents and Abilities in two columns */}
              <div className="grid grid-cols-2 gap-6">
                {/* Talents */}
                <div>
                  <h3 className="text-white font-semibold mb-4 text-lg">Talents</h3>
                  {renderTalents(entity.talents)}
                </div>

                {/* Special Abilities */}
                <div>
                  <h3 className="text-white font-semibold mb-4 text-lg">Special Abilities</h3>
                  {renderAbilities(entity.abilities)}
                </div>
              </div>

            </div>
          ) : (
            /* Simple Entity Display */
            renderSimpleEntity()
          )}
        </div>
      </div>
    </div>
  );
};

export default EntityEncounterPanel;