import React from 'react';

export default function CharacterSheet({ character, onSave, readOnly }) {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-yellow-300">
        <strong>Character Sheet</strong> - To be implemented
        <p className="text-sm text-yellow-400 mt-1">
          Characteristics, Skills, Derived Stats, Motivations, Talents, Abilities
        </p>
      </div>
      
      {/* Placeholder structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2">Characteristics</h3>
          <p className="text-gray-500 text-sm">Brawn, Agility, Intellect, Cunning, Willpower, Presence</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2">Derived Stats</h3>
          <p className="text-gray-500 text-sm">Soak, Defense, Encumbrance</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2">Motivations</h3>
          <p className="text-gray-500 text-sm">Strength, Flaw, Desire, Fear</p>
        </div>
      </div>
      
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-2">Skills (All + 8 Custom)</h3>
        <p className="text-gray-500 text-sm">Standard Genesys skills + Fear, Knowledge (Lore), Scavenging, Metalworking, Leatherworking, Alchemy, Carpentry, Cooking</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2">Talents</h3>
          <p className="text-gray-500 text-sm">List of purchased talents</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2">Abilities</h3>
          <p className="text-gray-500 text-sm">Archetype abilities, special abilities</p>
        </div>
      </div>
      
      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}