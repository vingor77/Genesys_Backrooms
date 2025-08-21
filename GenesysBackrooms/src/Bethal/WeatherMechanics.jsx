import React, { useState } from 'react';
import { weatherData, weatherTypes } from './weatherData.jsx';

const WeatherMechanics = ({ currentWeatherType }) => {
  const [selectedWeather, setSelectedWeather] = useState(currentWeatherType || weatherTypes[0]);
  const [expandedMechanic, setExpandedMechanic] = useState(null);

  // Get the selected weather data
  const weatherInfo = weatherData[selectedWeather];

  // Simplified mechanics for tabletop use - COMPLETELY REWRITTEN
  const getSimplifiedMechanics = (weatherType) => {
    const weather = weatherData[weatherType];
    if (!weather || !weather.mechanical_effects) return [];

    const simplified = [];

    switch (weatherType) {
      case 'clear':
        simplified.push({
          name: 'Perfect Conditions',
          summary: 'No weather penalties - standard Genesys mechanics',
          keyRules: [
            'NO DICE MODIFICATIONS - All checks are normal',
            'ADVANTAGE OPTION: Spend 2 Advantage on Perception to spot extra scrap/hazards'
          ],
          icon: '☀️'
        });
        break;

      case 'rainy':
        simplified.push({
          name: 'Spot Quicksand',
          summary: 'WHEN: Moving to new location OR looking for hazards',
          keyRules: [
            'ROLL: Perception (Cunning) vs 2 Difficulty dice (Average)',
            'MODIFIERS: +1 Boost (cautious), +2 Setback (nighttime), +1 Setback (rushing)',
            'SUCCESS: Spot quicksand, can avoid it',
            'FAILURE: Step into quicksand if moving there'
          ],
          icon: '👁️'
        });
        simplified.push({
          name: 'Escape Quicksand',
          summary: 'WHEN: Trapped in quicksand',
          keyRules: [
            'ROLL: Athletics (Brawn) vs 3 Difficulty dice (Hard) - Full Action',
            'MODIFIERS: +2 Boost (rope/equipment), +1 Setback (after 2+ rounds trapped)',
            'SUCCESS: Escape to safety',
            'FAILURE: Sink deeper (Shallow → Deep → Critical)',
            'DROWNING: Round 4+ = 4 wounds per round (ignores Soak)'
          ],
          icon: '🏃'
        });
        simplified.push({
          name: 'Rain Effects',
          summary: 'AUTOMATIC EFFECTS',
          keyRules: [
            'ALL OUTDOOR ATHLETICS/COORDINATION: +1 Setback die (slippery)',
            'PERCEPTION BEYOND MEDIUM RANGE: +1 Setback die (rain)',
            'INITIAL: 3 quicksand puddles at mission start (Round 0)',
            'NEW QUICKSAND: Every 12 rounds (Rounds 12, 24, 36, 48, 60, 72, 84, 96, 108, 120)'
          ],
          icon: '🌧️'
        });
        break;

      case 'stormy':
        simplified.push({
          name: 'Detect Lightning Buildup',
          summary: 'WHEN: Each round carrying metal items',
          keyRules: [
            'ROLL: Vigilance (Cunning) vs 1 Difficulty die (Easy)',
            'MODIFIERS: +1 Setback (multiple metal items), +1 Boost (experienced lightning)',
            'SUCCESS: Notice sparking, can drop item as Free Action',
            'FAILURE: Lightning strikes at end of round',
            'CHARGE BUILDUP: Level 1 (warm) → Level 2 (sparks) → Level 3 (STRIKE!)',
            'ENTIRE GRID AT RISK: No safe zones during storms'
          ],
          icon: '⚡'
        });
        simplified.push({
          name: 'Lightning Strike Damage',
          summary: 'WHEN: Lightning hits metal items at Level 3 charge',
          keyRules: [
            'DIRECT HIT (holding item): 12 wounds + Critical Injury (+50)',
            'AREA EFFECT (Engaged range): 8 wounds + Critical Injury (+25)',
            'ITEM DESTRUCTION: 50% chance item is destroyed',
            'PHASE 1 (Rounds 0-30): Every 16 rounds',
            'PHASE 2 (Rounds 31-46): Every 12 rounds',
            'PHASE 3 (Rounds 47-62): Every 8 rounds',
            'PHASE 4 (Rounds 63-128): Every 6 rounds, multiple strikes',
            'AFTERMATH: Strike locations unsafe for 2 rounds'
          ],
          icon: '💥'
        });
        simplified.push({
          name: 'Equipment Malfunction',
          summary: 'WHEN: Each round using electronics',
          keyRules: [
            'PHASE 1: 15% chance (Rounds 0-30)',
            'PHASE 2: 20% chance (Rounds 31-46)',
            'PHASE 3: 25% chance (Rounds 47-62)',
            'PHASE 4: 30% chance (Rounds 63-128)',
            'EFFECTS: +1-2 Setback dice to equipment checks, or complete failure',
            'REPAIR: Mechanics (Intellect) vs 2 Difficulty dice (Average)',
            'DURATION: 1d5 rounds (minor) or 2d10 rounds (major)'
          ],
          icon: '🔧'
        });
        break;

      case 'foggy':
        simplified.push({
          name: 'Visibility Penalties',
          summary: 'AUTOMATIC EFFECTS based on current fog level',
          keyRules: [
            'PERCEPTION CHECKS: +X Setback dice (X = current fog level)',
            'LEVEL 1-2: Clear to Short range only',
            'LEVEL 3-4: Clear to Engaged range only', 
            'LEVEL 5: AUTO-FAIL beyond Engaged range',
            'FOG CHANGES EACH ROUND: 45% thicker, 15% same, 40% thinner',
            'STARTS AT LEVEL 2: Moderate fog at mission start'
          ],
          icon: '👁️'
        });
        simplified.push({
          name: 'Navigation Check',
          summary: 'WHEN: Moving beyond Short range without landmarks',
          keyRules: [
            'ROLL: Survival (Cunning) vs 1/2/3 Difficulty dice',
            'DIFFICULTY: Easy (familiar) → Average (known route) → Hard (unfamiliar)',
            'MODIFIERS: +1 Setback (Fog Level 3), +2 Setback (Fog Level 4-5)',
            'SUCCESS: Reach destination',
            'FAILURE: Become lost (GM places 1-2 squares off course)'
          ],
          icon: '🧭'
        });
        simplified.push({
          name: 'Communication Range',
          summary: 'AUTOMATIC EFFECTS',
          keyRules: [
            'VOICE RANGE: Reduced by one range band',
            'RADIO RANGE: Reduced by 1-2 range bands based on fog level',
            'SHIP HORN: Still audible at Long range through any fog',
            'STATIC: Heavy interference at Level 4-5 fog'
          ],
          icon: '📻'
        });
        break;

        case 'flooded':
        simplified.push({
          name: 'Initial Flood Targeting',
          summary: 'WHEN: Round 20 (first flood event)',
          keyRules: [
            'TARGETS: Lowest elevation tiles on the map',
            'PRIORITY: Height 0 tiles first, then height 1 if no height 0 exists',
            'FALLBACK: Continues to next height level if lower ones unavailable',
            'CHANCE: 25% probability per targeted tile to flood',
            'EXCLUSIONS: Ship and facility positions never flood',
            'RESULT: Random scattered puddles in lowest-lying areas'
          ],
          icon: '🎯'
        });
        simplified.push({
          name: 'Flood Spreading',
          summary: 'WHEN: Round 40, 60, 80... (every 20 rounds after initial)',
          keyRules: [
            'TARGETS: Any tile adjacent to existing flooded areas (8 directions)',
            'CHANCE: 50% probability per adjacent tile to flood',
            'GROWTH PATTERN: Organic expansion based on random chance',
            'BOUNDARIES: Natural barriers can contain flooding by chance',
            'RATE: Variable - depends on luck and terrain layout',
            'CUMULATIVE: Each phase builds on previous flood areas'
          ],
          icon: '🌊'
        });
        simplified.push({
          name: 'Elevation Strategy',
          summary: 'TACTICAL CONSIDERATIONS',
          keyRules: [
            'HIGH GROUND: Higher elevation = safer from initial flooding',
            'MAP ANALYSIS: Study height maps to predict vulnerable areas',
            'EARLY WARNING: Round 20 shows initial flood pattern',
            'EQUIPMENT PLACEMENT: Move valuable gear to higher terrain',
            'ESCAPE ROUTES: Plan paths through unflooded areas',
            'RANDOM FACTOR: Even low areas might stay dry by chance'
          ],
          icon: '🏔️'
        });
        break;

      case 'eclipsed':
        simplified.push({
          name: 'Eclipse Fear Check',
          summary: 'WHEN: Eclipse begins (Round 0) OR first entity encounter',
          keyRules: [
            'ROLL: Discipline (Willpower) vs 2 Difficulty dice (Average)',
            'MODIFIERS: +1 Boost (experienced eclipse), +1 Setback (alone), +2 Setback (high anxiety)',
            'SUCCESS: Maintain composure',
            'FAILURE: 2 strain + 1 Setback die to actions for 1 hour',
            'DESPAIR: 3 strain + no actions next round (panic attack)'
          ],
          icon: '😰'
        });
        simplified.push({
          name: 'Eclipse Strain',
          summary: 'AUTOMATIC EFFECTS while outside during eclipse',
          keyRules: [
            'STRAIN ACCUMULATION: 1 strain per round outside',
            'REDUCED RATE: 1 strain per 2 rounds if within Engaged range of ally',
            'IMMUNITY: No strain while inside facilities or ship',
            'ENTITY ENCOUNTERS: Additional Discipline check when first seeing entity'
          ],
          icon: '💀'
        });
        simplified.push({
          name: 'Eclipse Entity Enhancement',
          summary: 'WHEN: Every 16 rounds during eclipse',
          keyRules: [
            'ENHANCEMENT ROUNDS: 0, 16, 32, 48, 64, 80, 96, 112',
            'EFFECT: All existing entities gain +X power boost (X = eclipse intensity)',
            'INTENSITY SCALING: Round 0-15 = +1, Round 16-31 = +2, etc.',
            'NO NEW SPAWNS: Eclipse enhances existing threats instead',
            'CUMULATIVE: Each enhancement stacks with previous boosts'
          ],
          icon: '👹'
        });
        break;
    }

    return simplified;
  };

  const getWeatherTimeline = (weatherType) => {
    const timelines = {
      clear: [
        { round: '0-128', event: 'Perfect conditions maintained', severity: 'none' }
      ],
      rainy: [
        { round: '0', event: '3 initial quicksand puddles spawn + rain penalties begin', severity: 'moderate' },
        { round: '12, 24, 36...', event: 'New quicksand puddle forms every 12 rounds', severity: 'moderate' },
        { round: 'All', event: '+1 Setback to outdoor Athletics/Coordination (slippery)', severity: 'low' },
        { round: 'All', event: '+1 Setback to Perception beyond Medium range', severity: 'low' }
      ],
      stormy: [
        { round: '0-30', event: 'Phase 1: Lightning every 16 rounds, 15% equipment malfunction', severity: 'moderate' },
        { round: '16, 32...', event: 'Lightning strikes (Phase 1) - ENTIRE GRID AT RISK', severity: 'high' },
        { round: '31-46', event: 'Phase 2: Lightning every 12 rounds, 20% equipment malfunction', severity: 'high' },
        { round: '36, 48...', event: 'Lightning strikes (Phase 2) - More frequent', severity: 'high' },
        { round: '47-62', event: 'Phase 3: Lightning every 8 rounds, 25% equipment malfunction', severity: 'critical' },
        { round: '48, 56...', event: 'Lightning strikes (Phase 3) - Dangerous frequency', severity: 'critical' },
        { round: '63-128', event: 'Phase 4: Lightning every 6 rounds, 30% malfunction, multiple strikes', severity: 'lethal' }
      ],
      foggy: [
        { round: '0', event: 'Fog Level 2 begins (Moderate fog)', severity: 'low' },
        { round: 'Each round', event: '45% thicker, 15% same, 40% thinner (random changes)', severity: 'moderate' },
        { round: 'Level 3-4', event: 'Heavy fog - visibility to Engaged range only', severity: 'high' },
        { round: 'Level 5', event: 'Impenetrable fog - auto-fail Perception beyond Engaged', severity: 'critical' }
      ],
      flooded: [
        { round: '0-19', event: 'Phase 1: Initial 4x4 flood zone at lowest terrain (ankle-deep)', severity: 'low' },
        { round: '20-39', event: 'Phase 2: Spreads to adjacent low areas (knee-deep water)', severity: 'moderate' },
        { round: '40-59', event: 'Phase 3: Water pressure enables uphill spread (waist-deep)', severity: 'high' },
        { round: '60-79', event: 'Phase 4: Significant coverage, deep pockets form (chest-deep)', severity: 'critical' },
        { round: '80-99', event: 'Phase 5: Critical flooding, widespread deep water (neck-deep)', severity: 'lethal' },
        { round: '100-119', event: 'Phase 6: Severe flooding, drowning risk zones (deep water)', severity: 'lethal' },
        { round: '120-128', event: 'Phase 7: Maximum flood extent, evacuation critical', severity: 'lethal' }
      ],
      eclipsed: [
        { round: '0', event: 'Eclipse begins, 1 strain/round outside, fear checks required', severity: 'high' },
        { round: '16, 32, 48...', event: 'Eclipse intensity increases, all entities enhanced', severity: 'high' },
        { round: '48+', event: 'Peak eclipse - maximum entity enhancement (+3 or higher)', severity: 'lethal' },
        { round: 'All', event: '10-25% equipment interference (increases with intensity)', severity: 'moderate' }
      ]
    };
    return timelines[weatherType] || [];
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'none': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'low': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'moderate': return 'bg-orange-500/20 text-orange-300 border-orange-400/30';
      case 'high': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'critical': return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'lethal': return 'bg-gray-900/40 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Current Weather Status Bar */}
      <div className="bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-xl p-4 border border-cyan-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {currentWeatherType === 'clear' ? '☀️' :
               currentWeatherType === 'rainy' ? '🌧️' :
               currentWeatherType === 'stormy' ? '⚡' :
               currentWeatherType === 'foggy' ? '🌫️' :
               currentWeatherType === 'flooded' ? '🌊' :
               currentWeatherType === 'eclipsed' ? '🌑' : '🌤️'}
            </span>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Current Weather: {(currentWeatherType || 'clear').charAt(0).toUpperCase() + (currentWeatherType || 'clear').slice(1)}
              </h3>
              <p className="text-cyan-300 text-sm">
                {weatherData[currentWeatherType || 'clear']?.description || 'No weather effects active'}
              </p>
            </div>
          </div>
          {currentWeatherType && currentWeatherType !== 'clear' && (
            <div className="bg-red-500/30 text-red-300 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
              ACTIVE WEATHER
            </div>
          )}
        </div>
      </div>

      {/* Weather Type Selector */}
      <div>
        <h3 className="text-white font-semibold text-lg mb-3">📚 Weather Reference Guide</h3>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {weatherTypes.map((weather) => (
            <button
              key={weather}
              onClick={() => setSelectedWeather(weather)}
              className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                selectedWeather === weather
                  ? 'bg-blue-500/30 border-blue-400 text-white shadow-lg scale-105'
                  : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40'
              } ${currentWeatherType === weather ? 'ring-2 ring-green-400' : ''}`}
            >
              <div className="text-center">
                <div className="text-xl mb-1">
                  {weather === 'clear' ? '☀️' :
                   weather === 'rainy' ? '🌧️' :
                   weather === 'stormy' ? '⚡' :
                   weather === 'foggy' ? '🌫️' :
                   weather === 'flooded' ? '🌊' :
                   weather === 'eclipsed' ? '🌑' : '🌤️'}
                </div>
                <div className="font-semibold text-xs capitalize">{weather}</div>
                {currentWeatherType === weather && (
                  <div className="text-xs text-green-400 mt-1 font-bold">ACTIVE</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Column: Summary & Timeline */}
        <div className="space-y-4">
          
          {/* Weather Summary */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-blue-400/30">
            <h4 className="text-blue-300 font-semibold mb-3 text-sm flex items-center space-x-2">
              <span>📋</span>
              <span>Summary</span>
            </h4>
            <p className="text-white/90 text-sm leading-relaxed mb-3">
              {weatherInfo.description}
            </p>
            <div className="text-xs text-blue-200 space-y-1">
              <p><strong>Frequency:</strong> {weatherInfo.frequency?.occurrence || 'Variable'}</p>
              <p><strong>Duration:</strong> {weatherInfo.frequency?.duration || 'Full day cycle'}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-400/30">
            <h4 className="text-purple-300 font-semibold mb-3 text-sm flex items-center space-x-2">
              <span>⏰</span>
              <span>Event Timeline</span>
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {getWeatherTimeline(selectedWeather).map((event, index) => (
                <div key={index} className={`p-2 rounded-lg border text-xs ${getSeverityColor(event.severity)}`}>
                  <div className="font-semibold mb-1">Round {event.round}</div>
                  <div>{event.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mechanics */}
        <div className="lg:col-span-3">
          <h4 className="text-white font-semibold mb-4 text-lg flex items-center space-x-2">
            <span>🎲</span>
            <span>Game Mechanics for {selectedWeather.charAt(0).toUpperCase() + selectedWeather.slice(1)}</span>
          </h4>
          
          {getSimplifiedMechanics(selectedWeather).length === 0 ? (
            <div className="text-center text-white/60 py-8 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-3">📖</div>
              <p>No special mechanics for this weather type.</p>
              <p className="text-sm mt-2">Standard Genesys rules apply.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getSimplifiedMechanics(selectedWeather).map((mechanic, index) => (
                <div key={index} className="bg-white/5 rounded-xl border border-white/20 overflow-hidden">
                  
                  {/* Mechanic Header */}
                  <div 
                    className="p-4 bg-gradient-to-r from-gray-700/30 to-gray-600/30 cursor-pointer hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-200"
                    onClick={() => setExpandedMechanic(expandedMechanic === `${selectedWeather}-${index}` ? null : `${selectedWeather}-${index}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{mechanic.icon}</span>
                        <div>
                          <h5 className="text-white font-semibold">{mechanic.name}</h5>
                          <p className="text-white/70 text-sm">{mechanic.summary}</p>
                        </div>
                      </div>
                      <div className={`transform transition-transform duration-200 ${
                        expandedMechanic === `${selectedWeather}-${index}` ? 'rotate-180' : 'rotate-0'
                      }`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Rules */}
                  <div className={`transition-all duration-300 overflow-hidden ${
                    expandedMechanic === `${selectedWeather}-${index}` 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}>
                    <div className="p-4 bg-gray-800/20 border-t border-white/10">
                      <h6 className="text-white font-semibold mb-3 text-sm">📋 Key Rules:</h6>
                      <div className="space-y-2">
                        {mechanic.keyRules.map((rule, ruleIndex) => (
                          <div key={ruleIndex} className="flex items-start space-x-2">
                            <span className="text-blue-400 mt-1 text-xs font-bold">•</span>
                            <span className="text-white/90 text-sm">{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Reference Panel */}
          {selectedWeather !== 'clear' && (
            <div className="mt-6 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl p-4 border border-amber-400/30">
              <h5 className="text-amber-300 font-semibold mb-3 text-sm flex items-center space-x-2">
                <span>⚡</span>
                <span>Quick GM Reference</span>
              </h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-amber-200 font-semibold mb-2">🎯 Most Common Checks:</p>
                  <div className="text-white/90 space-y-1">
                    {selectedWeather === 'rainy' && (
                      <>
                        <p>• Perception (quicksand detection)</p>
                        <p>• Athletics (escape quicksand)</p>
                      </>
                    )}
                    {selectedWeather === 'stormy' && (
                      <>
                        <p>• Vigilance (lightning detection)</p>
                        <p>• Mechanics (equipment repairs)</p>
                        <p className="text-red-300">⚠️ ENTIRE GRID AT RISK</p>
                      </>
                    )}
                    {selectedWeather === 'foggy' && (
                      <>
                        <p>• Perception (visibility)</p>
                        <p>• Survival (navigation)</p>
                        <p className="text-yellow-300">📊 Fog changes randomly each round</p>
                      </>
                    )}
                    {selectedWeather === 'flooded' && (
                      <>
                        <p>• Athletics (swimming)</p>
                        <p>• Athletics (rescue operations)</p>
                        <p className="text-blue-300">🏔️ Height-based progression</p>
                      </>
                    )}
                    {selectedWeather === 'eclipsed' && (
                      <>
                        <p>• Discipline (fear management)</p>
                        <p>• Vigilance (entity detection)</p>
                        <p className="text-purple-300">👹 Entities enhanced every 16 rounds</p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-amber-200 font-semibold mb-2">🚨 Emergency Triggers:</p>
                  <div className="text-white/90 space-y-1">
                    {selectedWeather === 'rainy' && (
                      <>
                        <p>• 3+ failed quicksand escapes</p>
                        <p>• New quicksand every 12 rounds</p>
                      </>
                    )}
                    {selectedWeather === 'stormy' && (
                      <>
                        <p>• Phase 4 storm (Round 63+)</p>
                        <p>• Multiple simultaneous strikes</p>
                      </>
                    )}
                    {selectedWeather === 'foggy' && (
                      <>
                        <p>• Level 5 fog + lost players</p>
                        <p>• Unpredictable fog changes</p>
                      </>
                    )}
                    {selectedWeather === 'flooded' && (
                      <>
                        <p>• Level 4+ flooding (Round 60+)</p>
                        <p>• Swimming required in deep water</p>
                      </>
                    )}
                    {selectedWeather === 'eclipsed' && (
                      <>
                        <p>• Multiple enhanced entities</p>
                        <p>• Peak eclipse (Round 48+)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherMechanics;