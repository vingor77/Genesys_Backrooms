import React, { useState } from 'react';
import ObjectItem from '../Components/objectItem';
import WeaponItem from '../Components/weaponItem';
import ArmorItem from '../Components/armorItem';
import MundaneItem from '../Components/mundaneItem';
import People from '../Components/people';
import PhenomenonItem from '../Components/phenomenonItem';
import EntityItem from '../Components/entityItem';

export default function LevelItem(props) {
  const [refresh, setRefresh] = useState(false);

  const level = props.data.level;
  const lightLevel = Math.floor(Math.random() * (parseInt(level.lightLevels.split('/')[1]) - parseInt(level.lightLevels.split('/')[0]) + 1)) + parseInt(level.lightLevels.split('/')[0]);
  const corrosion = Math.floor(Math.random() * 100) <= level.chanceOfCorrosion ? Math.floor(Math.random() * (level.corrosiveAtmosphere + 1)) : 0;
  const heat = Math.floor(Math.random() * (parseInt(level.heat.split('/')[1]) - parseInt(level.heat.split('/')[0]) + 1)) + parseInt(level.heat.split('/')[0]);
  const effectCount = Math.floor(Math.random() * (level.effectCount + 1));
  const effects = level.effects.split('/');
  const roomSizes = level.roomSize.split('/');
  const width = Math.floor(Math.random() * (parseInt(roomSizes[0].split('!')[1]) - parseInt(roomSizes[0].split('!')[0]) + 1)) + parseInt(roomSizes[0].split('!')[0]);
  const length = Math.floor(Math.random() * (parseInt(roomSizes[1].split('!')[1]) - parseInt(roomSizes[1].split('!')[0]) + 1)) + parseInt(roomSizes[1].split('!')[0]);
  const exitCount = Math.floor(Math.random() * parseInt(level.exitCount)) + 1;
  const exitTypes = level.exitTypes.split('/');
  const exitFromLevelCount = Math.floor(Math.random() * 100) <= parseInt(level.exitFromLevelChance) ? 1: 0;
  const levelExits = level.exitFromLevel.split('/');
  const defectCount = Math.floor(Math.random() * (parseInt(level.defectCount) + 1));
  const defects = level.defects.split('/');
  const spawnChances = level.spawnChances.split('/');

  // Get level difficulty theme
  const getLevelTheme = () => {
    const difficulty = parseInt(level.sdClass);
    if (difficulty <= 1) {
      return {
        color: 'from-green-900 via-emerald-900 to-green-800',
        category: 'Safe',
        icon: '🏠'
      };
    } else if (difficulty > 1 && difficulty <= 3) {
      return {
        color: 'from-blue-900 via-cyan-900 to-blue-800',
        category: 'Moderate',
        icon: '🏢'
      };
    } else if (difficulty > 3 && difficulty <= 4) {
      return {
        color: 'from-orange-900 via-yellow-900 to-orange-800',
        category: 'Dangerous',
        icon: '⚠️'
      };
    } else {
      return {
        color: 'from-red-900 via-rose-900 to-red-800',
        category: 'Lethal',
        icon: '💀'
      };
    }
  };

  const levelTheme = getLevelTheme();

  const StatCard = ({ icon, label, value, color = 'text-white' }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-3 text-center min-h-[80px] flex flex-col justify-center">
      <div className="flex items-center justify-center space-x-1 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-bold text-white">{label}</span>
      </div>
      <div className={`text-lg font-bold ${color}`}>
        {value}
      </div>
    </div>
  );

  const SectionCard = ({ icon, title, children, defaultExpanded = true }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors rounded-t-xl"
        >
          <div className="flex items-center space-x-2">
            <span className="text-xl">{icon}</span>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <svg
            className={`w-5 h-5 text-white transform transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
        {expanded && (
          <div className="p-4 pt-0">
            {children}
          </div>
        )}
      </div>
    );
  };

  const FiniteRoom = () => {
    const level = props.data.level;

    const renderRoom = (roomIndex) => {
      // Parse room-specific data
      const exitsPerRoom = level.exitsPerRoom.split('/')[roomIndex];
      const exitTypes = level.exitTypesPerRoom.split('/')[roomIndex].split('!');
      const lightLevel = level.lightLevelPerRoom.split('/')[roomIndex];
      const heat = level.heatPerRoom.split('/')[roomIndex];
      const effects = level.effectPerRoom.split('/')[roomIndex].split('!');
      const spawns = level.spawnPerRoom.split('/')[roomIndex].split('!');
      const defects = level.defectsPerRoom.split('/')[roomIndex].split('!');
      const roomSizes = level.sizeOfRooms.split('/');
      const width = roomSizes[roomIndex].split('!')[0];
      const length = roomSizes[roomIndex].split('!')[1];
      const corrosion = level.useAtmosphere?.split('/')[roomIndex] === 'Yes' ? (Math.floor(Math.random() * level.corrosiveAtmosphere) + 1) : 0;
      const exitFromLevelCount = Math.floor(Math.random() * 100) <= parseInt(level.exitFromLevelChance) ? 1: 0;

      return (
        <div 
          key={roomIndex} 
          className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 mb-6"
        >
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Room {roomIndex + 1}</h2>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard 
                icon="📐" 
                label="Size" 
                value={`${width}×${length}×${level.roomHeight} ft`} 
              />
              <StatCard 
                icon="💡" 
                label="Light" 
                value={lightLevel} 
              />
              <StatCard 
                icon="🌡️" 
                label="Heat" 
                value={heat} 
              />
              <StatCard 
                icon="☢️" 
                label="Corrosion" 
                value={corrosion} 
                color={corrosion > 0 ? 'text-red-400' : 'text-white'}
              />
            </div>

            <SectionCard icon="🚪" title={`Exits (${exitsPerRoom})`}>
              <div className="flex flex-wrap gap-2">
                {exitTypes.map((exit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30"
                  >
                    {exit}
                  </span>
                ))}
              </div>
            </SectionCard>

            <SectionCard icon="🗺️" title="Level Exits">
              <SelectFromCount count={exitFromLevelCount} list={levelExits} type={'exitsFromLevel'}/>
            </SectionCard>

            <SectionCard icon="✨" title="Effects">
              <div className="flex flex-wrap gap-2">
                {effects.map((effect, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30"
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </SectionCard>

            <SectionCard icon="👥" title="Spawns">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spawns.map((spawn, index) => (
                  <div key={index}>
                    {determineSpawns(spawn)}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard icon="🔧" title="Defects">
              <div className="flex flex-wrap gap-2">
                {defects.map((defect, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30"
                  >
                    {defect}
                  </span>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      );
    };
    
    return (
      <div>
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Finite Level Layout
        </h2>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4 mb-6 text-center">
          <p className="text-xl text-white">Total Rooms: {level.roomCount}</p>
        </div>
        
        {[...Array(parseInt(level.roomCount))].map((_, index) => renderRoom(index))}
      </div>
    );
  }

  const SelectFromCount = (props) => {
    if(props.count === 0) return (
      <p className="text-white/70 italic">None</p>
    );

    const chosen = [];
    for(let i = 0; i < props.count; i++) {
      chosen.push(props.list[Math.floor(Math.random() * props.list.length)]);
    }

    let exitNum = -1;
    if(props.count > 0 && props.type === 'exitsFromLevel') exitNum = Math.floor(Math.random() * level.exitCount);

    return (
      <div className="flex flex-wrap gap-2">
        {chosen.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30"
          >
            {item} {props.type === 'exitsFromLevel' ? `(${exitNum})` : ""}
          </span>
        ))}
      </div>
    );
  }

  const determineSpawns = (spawn) => {
    let runningTotal = 0;
    for(let i = 0; i < spawnChances.length; i++) {
      runningTotal += parseInt(spawnChances[i]);
    }
  
    const values = [parseFloat(spawnChances[0] / runningTotal) * 100];
    for(let i = 1; i < spawnChances.length; i++) {
      values.push(parseFloat(spawnChances[i]) / runningTotal * 100 + values[i - 1]);
    }
  
    const value = ((Math.random() * 100) + 1);
    const spawnTypes = ['NOTHING', 'OBJECT', 'ENTITY', 'SOCIAL', 'PHENOMENA'];
    let selectedType = spawnTypes[0];

    // Similar spawn logic as original but simplified for space
    for(let i = 0; i < values.length; i++) {
      if(value <= values[i]) {
        selectedType = spawnTypes[i];
        if(spawn !== null) selectedType = spawn.toUpperCase();
        
        if(selectedType === 'OBJECT') {
          const objectRoll = Math.floor(Math.random() * 100) + 1;
          const rarity = Math.floor(Math.random() * 10) + 1;
          
          if(objectRoll <= 25 && props.data.armor?.length > 0) {
            const chosen = props.data.armor[Math.floor(Math.random() * props.data.armor.length)];
            return <ArmorItem currArmor={chosen}/>;
          } else if(objectRoll <= 50 && props.data.weapons?.length > 0) {
            const chosen = props.data.weapons[Math.floor(Math.random() * props.data.weapons.length)];
            return <WeaponItem currWeapon={chosen}/>;
          } else if(objectRoll <= 75 && props.data.objects?.length > 0) {
            const chosen = props.data.objects[Math.floor(Math.random() * props.data.objects.length)];
            return <ObjectItem currObject={chosen}/>;
          } else if(props.data.mundane?.length > 0) {
            const chosen = props.data.mundane[Math.floor(Math.random() * props.data.mundane.length)];
            return <MundaneItem currMundane={chosen}/>;
          }
        }
        
        if(selectedType === 'ENTITY' && props.data.entities?.length > 0) {
          const chosen = props.data.entities[Math.floor(Math.random() * props.data.entities.length)];
          return <EntityItem entity={chosen} person={false} />;
        }
        
        if(selectedType === 'SOCIAL' && props.data.interest?.length > 0) {
          const chosen = props.data.interest[Math.floor(Math.random() * props.data.interest.length)];
          return <People currPerson={chosen}/>;
        }
        
        if(selectedType === 'PHENOMENA' && props.data.phenomena?.length > 0) {
          const chosen = props.data.phenomena[Math.floor(Math.random() * props.data.phenomena.length)];
          return <PhenomenonItem currPhenomenon={chosen}/>;
        }
        break;
      }
    }

    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-3 text-center">
        <p className="text-white/70 text-sm">Nothing spawned</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${levelTheme.color} p-4`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl border-2 border-white/30">
              {levelTheme.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Level {level.level}: {level.name}
              </h1>
              <p className="text-white/90 text-lg leading-relaxed">
                {level.description}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-white font-bold">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {level.tags.split('/').map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {level.finite === 'Yes' ? (
          <FiniteRoom />
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">
                  Procedural Room Generator
                </h2>
                <button
                  onClick={() => setRefresh(!refresh)}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 border border-white/30"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
                  </svg>
                  <span>Generate New Room</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Current Environment */}
              {level.environments !== 'None' && level.environments && (
                <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4 mb-6 text-center">
                  <p className="text-xl font-bold text-white">
                    Current Environment: {level.environments.split('/')[Math.floor(Math.random() * level.environments.split('/').length)]}
                  </p>
                </div>
              )}

              {/* Room Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard 
                  icon="📐" 
                  label="Room Size" 
                  value={`${width}×${length}×${level.roomHeight} ft`} 
                />
                <StatCard 
                  icon="💡" 
                  label="Light Level" 
                  value={lightLevel} 
                />
                <StatCard 
                  icon="🌡️" 
                  label="Heat Level" 
                  value={heat} 
                />
                <StatCard 
                  icon="☢️" 
                  label="Corrosion" 
                  value={corrosion} 
                  color={corrosion > 0 ? 'text-red-400' : 'text-white'}
                />
              </div>

              {/* Room Content Sections */}
              <SectionCard icon="🚪" title={`Exits (${exitCount})`}>
                <SelectFromCount count={exitCount} list={exitTypes} type={'exits'}/>
              </SectionCard>

              <SectionCard icon="🗺️" title="Level Exits">
                <SelectFromCount count={exitFromLevelCount} list={levelExits} type={'exitsFromLevel'}/>
              </SectionCard>

              <SectionCard icon="✨" title="Environmental Effects">
                <SelectFromCount count={effectCount} list={effects} type={'effects'}/>
              </SectionCard>

              <SectionCard icon="👥" title="Spawned Objects & Entities" defaultExpanded={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(Math.floor(Math.random() * parseInt(level.maxSpawns || 3)) + 1)].map((_, index) => (
                    <div key={index}>
                      {determineSpawns(null)}
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard icon="🔧" title="Room Defects">
                <SelectFromCount count={defectCount} list={defects} type={'defects'}/>
              </SectionCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}