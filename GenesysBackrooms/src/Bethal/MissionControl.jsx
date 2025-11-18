import React, { useState } from 'react';
import { roundToTime } from './weatherHelpers.jsx';

// Overtime Calculator Modal Component
const OvertimeModal = ({ isOpen, onClose, currentQuota, daysUntilDeadline }) => {
  const [desiredTotal, setDesiredTotal] = useState('');
  const [amountSold, setAmountSold] = useState('');

  if (!isOpen) return null;

  const calculateRequiredSales = (desiredAmount) => {
    if (!desiredAmount || isNaN(desiredAmount)) return 0;
    return Math.ceil((5 * parseFloat(desiredAmount) + currentQuota + 75) / 6);
  };

  const calculateOvertimeBonus = (soldAmount) => {
    if (!soldAmount || isNaN(soldAmount)) return 0;
    return Math.round((parseFloat(soldAmount) - currentQuota) / 5 + 15 * (daysUntilDeadline - 1));
  };

  const calculateFinalTotal = (soldAmount) => {
    if (!soldAmount || isNaN(soldAmount)) return 0;
    return parseFloat(soldAmount) + calculateOvertimeBonus(soldAmount);
  };

  const requiredSales = calculateRequiredSales(desiredTotal);
  const overtimeBonus = calculateOvertimeBonus(amountSold);
  const finalTotal = calculateFinalTotal(amountSold);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 rounded-2xl border border-white/30 shadow-2xl w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-black/30">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              OVERTIME CALCULATOR
            </h1>
            <p className="text-green-300 text-lg">Plan your quota strategy</p>
          </div>
          
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-3 transition-all duration-200"
            title="Close Calculator"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-bold text-lg mb-3 flex items-center space-x-2">
              <span className="text-blue-400">📊</span>
              <span>Current Status</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Current Quota:</span>
                <span className="text-white font-bold">{currentQuota}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Days Until Deadline:</span>
                <span className="text-white font-bold">{daysUntilDeadline}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 1: Desired Amount Calculator */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center space-x-2">
                <span className="text-green-400">🎯</span>
                <span>Planning Calculator</span>
              </h3>
              <p className="text-green-300 text-sm mb-4">
                Enter your desired final total (after overtime bonus) to see how much you need to sell. Calculated at 0 days left.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Desired Final Total:
                  </label>
                  <input
                    type="number"
                    value={desiredTotal}
                    onChange={(e) => setDesiredTotal(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter desired amount..."
                  />
                </div>

                {desiredTotal && !isNaN(desiredTotal) && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-green-300 font-medium">Required Sales:</span>
                      <span className="text-white font-bold text-xl">{requiredSales}</span>
                    </div>
                    <p className="text-green-200 text-xs mt-2">
                      You need to sell {requiredSales} credits to reach your goal of {desiredTotal} total.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Amount Sold Calculator */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center space-x-2">
                <span className="text-blue-400">💰</span>
                <span>Bonus Calculator</span>
              </h3>
              <p className="text-blue-300 text-sm mb-4">
                Enter the amount you actually sold to calculate your overtime bonus.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Amount Actually Sold:
                  </label>
                  <input
                    type="number"
                    value={amountSold}
                    onChange={(e) => setAmountSold(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount sold..."
                  />
                </div>

                {amountSold && !isNaN(amountSold) && (
                  <div className="space-y-3">
                    <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-300 font-medium">Overtime Bonus:</span>
                        <span className="text-white font-bold text-xl">+{overtimeBonus}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300 font-medium">Final Total:</span>
                        <span className="text-green-400 font-bold text-2xl">{finalTotal}</span>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/20 border border-purple-400/30 rounded-lg">
                      <p className="text-purple-200 text-xs">
                        Sold: {amountSold} + Bonus: {overtimeBonus} = Total: {finalTotal}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formula Information */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-bold text-lg mb-3 flex items-center space-x-2">
              <span className="text-purple-400">🧮</span>
              <span>Formula Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
              <div>
                <p className="font-medium text-green-400 mb-1">Required Sales Formula:</p>
                <p className="font-mono">⌈(5 × Desired + Quota + 75) ÷ 6⌉</p>
              </div>
              <div>
                <p className="font-medium text-blue-400 mb-1">Overtime Bonus Formula:</p>
                <p className="font-mono">⌊(Sold - Quota) ÷ 5 + 15 × (Days - 1)⌋</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <span>✓</span>
              <span>Close Calculator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shop Modal Component (keeping the same as it was working well)
const ShopModal = ({ isOpen, onClose, weapons, suits, baseStore }) => {
  const [selectedTab, setSelectedTab] = useState('weapons');

  if (!isOpen) return null;

  // Group weapons by category for better organization
  const weaponsByCategory = weapons.reduce((acc, weapon) => {
    if (!acc[weapon.category]) {
      acc[weapon.category] = [];
    }
    acc[weapon.category].push(weapon);
    return acc;
  }, {});

  // Sort suits by price (cheapest to most expensive)
  const sortedSuits = [...suits].sort((a, b) => a.price - b.price);

  // Group base store items by type (equipment vs ship upgrades)
  const equipmentItems = baseStore.filter(item => 
    !['Cozy Lights', 'Goldfish', 'Jack O\' Lantern', 'Television', 'Record Player', 
      'Romantic Table', 'Shower', 'Table', 'Toilet', 'Welcome Mat', 'Plushie Pajama Man', 
      'Disco Ball'].includes(item.name)
  );
  
  const shipUpgrades = baseStore.filter(item => 
    ['Cozy Lights', 'Goldfish', 'Jack O\' Lantern', 'Television', 'Record Player', 
     'Romantic Table', 'Shower', 'Table', 'Toilet', 'Welcome Mat', 'Plushie Pajama Man', 
     'Disco Ball'].includes(item.name)
  );

  const WeaponCard = ({ weapon }) => (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 hover:bg-gray-750 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-white font-bold text-lg">{weapon.name}</h3>
        <div className="text-right">
          {weapon.price > 0 ? (
            <span className="text-green-400 font-bold text-lg">${weapon.price}</span>
          ) : (
            <span className="text-red-400 font-bold text-sm">FOUND ONLY</span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="text-gray-300">
          <span className="text-blue-400">Skill:</span> {weapon.skill}
        </div>
        <div className="text-gray-300">
          <span className="text-blue-400">Damage:</span> {weapon.damage}
        </div>
        <div className="text-gray-300">
          <span className="text-blue-400">Critical:</span> {weapon.critical}
        </div>
        <div className="text-gray-300">
          <span className="text-blue-400">Range:</span> {weapon.range}
        </div>
        <div className="text-gray-300">
          <span className="text-blue-400">Weight:</span> {weapon.weight}
        </div>
        <div className="text-gray-300">
          <span className="text-blue-400">Two-Handed:</span> {weapon.two_handed ? 'Yes' : 'No'}
        </div>
      </div>

      <div className="mb-2">
        <span className="text-blue-400 text-sm">Conductive:</span> 
        <span className={`ml-2 text-sm ${weapon.conductive ? 'text-red-400' : 'text-green-400'}`}>
          {weapon.conductive ? 'YES ⚡' : 'NO'}
        </span>
      </div>

      {weapon.uses_ammo && (
        <div className="mb-2">
          <span className="text-yellow-400 text-sm">Ammo Type:</span> 
          <span className="text-gray-300 ml-2 text-sm">{weapon.ammo_type}</span>
        </div>
      )}

      {weapon.special && (
        <div className="bg-gray-700 rounded p-2 mt-2">
          <span className="text-purple-400 text-sm font-semibold">Special:</span>
          <p className="text-gray-300 text-sm mt-1">{weapon.special}</p>
        </div>
      )}
    </div>
  );

  const SuitCard = ({ suit }) => (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 hover:bg-gray-750 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-white font-bold text-lg">{suit.name}</h3>
        <span className="text-green-400 font-bold text-lg">${suit.price}</span>
      </div>
      
      <p className="text-gray-300 text-sm mb-3">{suit.description}</p>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="text-gray-300">
          <span className="text-blue-400">Melee Defense:</span> {suit.defense_melee}
        </div>
        <div className="text-gray-300">
          <span className="text-blue-400">Ranged Defense:</span> {suit.defense_ranged}
        </div>
        <div className="text-gray-300">
          <span className="text-blue-400">Soak Value:</span> {suit.soak}
        </div>
        <div className="text-gray-300">
          <span className="text-blue-400">Weight:</span> {suit.encumbrance}
        </div>
      </div>

      <div className="mb-2">
        <span className="text-blue-400 text-sm">Conductive:</span> 
        <span className={`ml-2 text-sm ${suit.conductive ? 'text-red-400' : 'text-green-400'}`}>
          {suit.conductive ? 'YES ⚡' : 'NO'}
        </span>
      </div>

      {suit.special && suit.special !== 'Basic protection' && (
        <div className="bg-gray-700 rounded p-2 mt-2">
          <span className="text-purple-400 text-sm font-semibold">Special:</span>
          <p className="text-gray-300 text-sm mt-1">{suit.special}</p>
        </div>
      )}
    </div>
  );

  const EquipmentCard = ({ item }) => (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 hover:bg-gray-750 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-white font-bold text-lg">{item.name}</h3>
        <span className="text-green-400 font-bold text-lg">${item.price}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="text-gray-300">
          <span className="text-blue-400">Weight:</span> {item.weight}
        </div>
        {item.batteryCharge > 0 && (
          <div className="text-gray-300">
            <span className="text-blue-400">Battery:</span> {item.batteryCharge}
          </div>
        )}
        {item.useCount < 999 && (
          <div className="text-gray-300">
            <span className="text-blue-400">Uses:</span> {item.useCount}
          </div>
        )}
        <div className="text-gray-300">
          <span className="text-blue-400">Conductive:</span> {item.conductive === 'Yes' ? 'YES ⚡' : 'NO'}
        </div>
      </div>

      <div className="bg-gray-700 rounded p-2 mt-2">
        <span className="text-purple-400 text-sm font-semibold">Function:</span>
        <p className="text-gray-300 text-sm mt-1">{item.use}</p>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-2xl border border-white/30 shadow-2xl w-full max-w-7xl my-4 min-h-[80vh] max-h-none flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-black/30 flex-shrink-0">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              COMPANY STORE
            </h1>
            <p className="text-blue-300 text-lg">Equipment • Protection • Weapons</p>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-3 transition-all duration-200 flex-shrink-0"
            title="Close Shop"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content continues with same structure as before... */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center mb-6">
            <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-3 max-w-2xl mx-auto">
              <p className="text-yellow-300 text-sm">
                ⚠️ <strong>CONDUCTIVITY WARNING:</strong> Conductive items attract lightning during storms!
              </p>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-1 border border-white/20">
              <button
                onClick={() => setSelectedTab('weapons')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                  selectedTab === 'weapons'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                ⚔️ Weapons & Combat
              </button>
              <button
                onClick={() => setSelectedTab('suits')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                  selectedTab === 'suits'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                🛡️ Protective Suits
              </button>
              <button
                onClick={() => setSelectedTab('equipment')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                  selectedTab === 'equipment'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                🔧 Equipment & Tools
              </button>
            </div>
          </div>

          {/* Content sections continue with same structure... */}
          {selectedTab === 'weapons' && (
            <div className="space-y-6">
              {Object.entries(weaponsByCategory).map(([category, categoryWeapons]) => (
                <div key={category} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="p-4 border-b border-white/10 bg-gradient-to-r from-red-600/20 to-orange-600/20">
                    <h2 className="text-white font-bold text-xl capitalize flex items-center space-x-2">
                      <span>
                        {category === 'melee' && '⚔️'}
                        {category === 'ranged' && '🎯'}
                        {category === 'hand_to_hand' && '👊'}
                      </span>
                      <span>{category.replace('_', '-')} Weapons</span>
                      <span className="text-sm text-gray-300 ml-4">({categoryWeapons.length} items)</span>
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryWeapons.map((weapon, index) => (
                        <WeaponCard key={index} weapon={weapon} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'suits' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                <h2 className="text-white font-bold text-xl flex items-center space-x-2">
                  <span>🛡️</span>
                  <span>Protective Suits</span>
                  <span className="text-sm text-gray-300 ml-4">({sortedSuits.length} suits available)</span>
                </h2>
                <p className="text-blue-300 mt-2">Ordered by price - Basic to Premium Protection</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sortedSuits.map((suit, index) => (
                    <SuitCard key={index} suit={suit} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'equipment' && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-green-600/20 to-teal-600/20">
                  <h2 className="text-white font-bold text-xl flex items-center space-x-2">
                    <span>🔧</span>
                    <span>Field Equipment</span>
                    <span className="text-sm text-gray-300 ml-4">({equipmentItems.length} items)</span>
                  </h2>
                  <p className="text-green-300 mt-2">Essential tools for exploration and survival</p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {equipmentItems.map((item, index) => (
                      <EquipmentCard key={index} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                  <h2 className="text-white font-bold text-xl flex items-center space-x-2">
                    <span>🚀</span>
                    <span>Ship Upgrades & Comfort</span>
                    <span className="text-sm text-gray-300 ml-4">({shipUpgrades.length} items)</span>
                  </h2>
                  <p className="text-purple-300 mt-2">Improve morale and working conditions - Each provides 10% overtime bonus</p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {shipUpgrades.map((item, index) => (
                      <EquipmentCard key={index} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-8 p-4 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
            <h3 className="text-white font-bold text-lg mb-2">Company Store - Authorized Equipment Only</h3>
            <p className="text-gray-300 text-sm mb-4">
              All prices subject to Company policy. Items marked "FOUND ONLY" cannot be purchased.
            </p>
            <div className="flex justify-center space-x-8 text-xs text-gray-400">
              <span>⚡ Conductive items carry electrical risk</span>
              <span>🔋 Battery items require charge management</span>
              <span>📦 Encumbrance affects movement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MissionControl = ({ 
  selectedMoon, 
  dailyWeather, 
  currentRound, 
  gameStarted, 
  quotaFailed,
  currentQuota,
  daysUntilDeadline,
  quotasFulfilled,
  onStartGame, 
  onNextRound, 
  onResetGame, 
  onAdvanceDay,
  onResetCampaign,
  players,
  totalEntities,
  powerStatus,
  weapons = [],
  suits = [],
  baseStore = []
}) => {
  const [showShop, setShowShop] = useState(false);
  const [showOvertime, setShowOvertime] = useState(false);

  const getCurrentMoonWeather = () => {
    if (!selectedMoon) return '';
    return dailyWeather[selectedMoon] || '';
  };

  return (
    <div className="space-y-4">
      {/* Quick Action Buttons - Top Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <button
          onClick={onStartGame}
          disabled={!selectedMoon || gameStarted || quotaFailed}
          className="p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span className="text-xl">🚀</span>
          <span>{gameStarted ? 'Mission Active' : 'Start Mission'}</span>
        </button>
        
        <button
          onClick={onNextRound}
          disabled={!gameStarted || currentRound >= 128 || quotaFailed}
          className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span className="text-xl">⏭️</span>
          <span>Next Round ({currentRound}/128)</span>
        </button>
      </div>

      {/* Company Store */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-xl p-4 border border-emerald-400/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div>
            <h3 className="text-white font-semibold text-lg flex items-center space-x-2">
              <span className="text-2xl">🏪</span>
              <span>Company Store</span>
            </h3>
            <p className="text-emerald-300 text-sm">Equipment, weapons, and protective gear</p>
          </div>
          <button
            onClick={() => setShowShop(true)}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span className="text-xl">🛒</span>
            <span>Browse Store</span>
          </button>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mission Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <span className="text-blue-400">🎯</span>
            <span>Mission Status</span>
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Selected Moon:</span>
              <span className="text-white font-medium">{selectedMoon || 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Weather:</span>
              <span className="text-white font-medium">{getCurrentMoonWeather() || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Status:</span>
              <span className={`font-medium ${gameStarted ? 'text-green-400' : 'text-yellow-400'}`}>
                {gameStarted ? 'Active' : 'Standby'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Time:</span>
              <span className="text-white font-medium">{roundToTime(currentRound)}</span>
            </div>
          </div>
        </div>

        {/* Company Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <span className="text-purple-400">🏢</span>
            <span>Company Status</span>
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Current Quota:</span>
              <span className="text-white font-medium">{currentQuota}</span>
            </div>
            <div className="flex justify-between">
             <span className="text-white/70">Days Left:</span>
             <span className={`font-medium ${daysUntilDeadline <= 1 ? 'text-red-400' : daysUntilDeadline <= 2 ? 'text-yellow-400' : 'text-green-400'}`}>
               {daysUntilDeadline}
             </span>
           </div>
           <div className="flex justify-between">
             <span className="text-white/70">Quotas Completed:</span>
             <span className="text-white font-medium">{quotasFulfilled}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-white/70">Sell Day:</span>
             <span className={`font-medium ${daysUntilDeadline === 0 ? 'text-green-400' : 'text-red-400'}`}>
               {daysUntilDeadline === 0 ? 'Yes' : 'No'}
             </span>
           </div>
         </div>
       </div>
     </div>

     {/* Entity & Power Status */}
     {gameStarted && selectedMoon && (
       <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
         <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
           <span className="text-orange-400">⚡</span>
           <span>Power & Entity Status</span>
         </h3>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
           <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
             <div className="text-blue-300 font-medium text-sm">Indoor</div>
             <div className="text-white text-xl font-bold">{powerStatus.indoor.current}/{powerStatus.indoor.max}</div>
             <div className="text-blue-200 text-xs">Power Used</div>
           </div>
           <div className="text-center p-3 bg-green-500/20 rounded-lg border border-green-400/30">
             <div className="text-green-300 font-medium text-sm">Outdoor</div>
             <div className="text-white text-xl font-bold">{powerStatus.outdoor.current}/{powerStatus.outdoor.max}</div>
             <div className="text-green-200 text-xs">Power Used</div>
           </div>
           <div className="text-center p-3 bg-orange-500/20 rounded-lg border border-orange-400/30">
             <div className="text-orange-300 font-medium text-sm">Daytime</div>
             <div className="text-white text-xl font-bold">{powerStatus.daytime.current}/{powerStatus.daytime.max}</div>
             <div className="text-orange-200 text-xs">Power Used</div>
           </div>
         </div>
         <div className="mt-4 pt-3 border-t border-white/20">
           <div className="flex justify-between items-center">
             <span className="text-white/70">Total Active Entities:</span>
             <span className="text-white font-bold text-lg">{totalEntities}</span>
           </div>
         </div>
       </div>
     )}

     {/* Secondary Controls */}
     <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
       <button
         onClick={onResetGame}
         disabled={!gameStarted}
         className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
       >
         <span>🔄</span>
         <span>Reset Mission</span>
       </button>
       
       <button
         onClick={onAdvanceDay}
         disabled={quotaFailed}
         className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
       >
         <span>📅</span>
         <span>Advance Day</span>
       </button>
       
       <button
         onClick={onResetCampaign}
         className="p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
       >
         <span>💀</span>
         <span>Reset Campaign</span>
       </button>

      <button
        onClick={() => setShowOvertime(true)}
        className="p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <span>💰</span>
        <span>Overtime Calculator</span>
      </button>
     </div>

     {/* Status Messages */}
     {quotaFailed && (
       <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
         <div className="flex items-center space-x-3">
           <span className="text-red-400 text-2xl">💀</span>
           <div>
             <h4 className="text-red-300 font-bold text-lg">Mission Terminated</h4>
             <p className="text-red-200 text-sm">The Company has terminated your crew. Reset campaign to continue.</p>
           </div>
         </div>
       </div>
     )}

     {!selectedMoon && (
       <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 backdrop-blur-sm">
         <div className="flex items-center space-x-3">
           <span className="text-yellow-400 text-2xl">⚠️</span>
           <div>
             <h4 className="text-yellow-300 font-bold text-lg">No Moon Selected</h4>
             <p className="text-yellow-200 text-sm">Please select a moon from the Weather Forecast to start your mission.</p>
           </div>
         </div>
       </div>
     )}

     {/* Modals */}
     {showShop && (
       <ShopModal 
         isOpen={showShop}
         onClose={() => setShowShop(false)}
         weapons={weapons}
         suits={suits}
         baseStore={baseStore}
       />
     )}

     {showOvertime && (
       <OvertimeModal 
         isOpen={showOvertime}
         onClose={() => setShowOvertime(false)}
         currentQuota={currentQuota}
         daysUntilDeadline={daysUntilDeadline}
       />
     )}
   </div>
 );
};

export default MissionControl;