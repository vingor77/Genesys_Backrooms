import React, { useState } from 'react';
import SessionDashboard from './SessionDashboard';
import EncounterTracker from './EncounterTracker';
import TimeTracker from './TimeTracker';
import SessionNotes from './SessionNotes';

export default function DMPage({ session, onSave, readOnly = false }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Session Dashboard', icon: '🎯', component: SessionDashboard },
    { id: 'encounter', label: 'Encounter Tracker', icon: '⚔️', component: EncounterTracker },
    { id: 'time', label: 'Time Tracker', icon: '⏰', component: TimeTracker },
    { id: 'notes', label: 'Session Notes', icon: '📝', component: SessionNotes }
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-white">
              🎲 DM Control Panel
            </h1>
            {readOnly && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg text-sm">
                👁️ Read-only Mode
              </span>
            )}
          </div>
          <p className="text-gray-400">
            {session?.campaignName || 'Campaign Management'} - Session #{session?.sessionNumber || '—'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-700">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap flex items-center space-x-2 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-indigo-400 border-indigo-500 bg-indigo-900/20'
                    : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          {ActiveComponent && (
            <ActiveComponent 
              session={session} 
              onSave={onSave} 
              readOnly={readOnly}
            />
          )}
        </div>
      </div>
    </div>
  );
}
