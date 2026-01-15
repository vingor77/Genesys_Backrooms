import React, { useState, useEffect } from 'react';

export default function SessionDashboard({ session, onSave, readOnly }) {
  const dashboard = session?.dashboard || {
    currentTime: { date: '', time: '', dayOfWeek: '' },
    activePlayers: [],
    locations: [],
    activeQuests: [],
    recentNotes: []
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Session Dashboard</h2>
        <p className="text-gray-400">Quick reference for current session status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Time & Date */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              ⏰ Current Time
            </h3>
            {!readOnly && (
              <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors">
                Edit
              </button>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Date:</span>
              <span className="text-white font-medium">{dashboard.currentTime.date || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time:</span>
              <span className="text-white font-medium">{dashboard.currentTime.time || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Day:</span>
              <span className="text-white font-medium">{dashboard.currentTime.dayOfWeek || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Active Players */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              👥 Active Players
            </h3>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded border border-green-500/30">
              {dashboard.activePlayers.length} online
            </span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {dashboard.activePlayers.length === 0 ? (
              <p className="text-gray-500 text-sm">No players currently active</p>
            ) : (
              dashboard.activePlayers.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                  <span className="text-white">{player.name}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    player.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    player.status === 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {player.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Current Locations */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              📍 Current Locations
            </h3>
            {!readOnly && (
              <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors">
                Update
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {dashboard.locations.length === 0 ? (
              <p className="text-gray-500 text-sm">No locations tracked</p>
            ) : (
              dashboard.locations.map((loc, idx) => (
                <div key={idx} className="p-2 bg-gray-700/50 rounded">
                  <div className="text-white font-medium">{loc.name}</div>
                  <div className="text-gray-400 text-sm">{loc.players?.join(', ')}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Quests */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              📜 Active Quests
            </h3>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded border border-blue-500/30">
              {dashboard.activeQuests.length} active
            </span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {dashboard.activeQuests.length === 0 ? (
              <p className="text-gray-500 text-sm">No active quests</p>
            ) : (
              dashboard.activeQuests.map((quest, idx) => (
                <div key={idx} className="p-2 bg-gray-700/50 rounded">
                  <div className="text-white font-medium">{quest.name}</div>
                  <div className="text-gray-400 text-sm">{quest.status}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Notes */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            📝 Recent Session Notes
          </h3>
          {!readOnly && (
            <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors">
              Add Note
            </button>
          )}
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {dashboard.recentNotes.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent notes</p>
          ) : (
            dashboard.recentNotes.map((note, idx) => (
              <div key={idx} className="p-3 bg-gray-700/50 rounded border-l-2 border-indigo-500">
                <div className="text-gray-400 text-xs mb-1">{note.timestamp}</div>
                <div className="text-white">{note.content}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-1">Session #</div>
          <div className="text-white text-2xl font-bold">{session?.sessionNumber || '—'}</div>
        </div>
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-400 text-sm mb-1">In-Game Days</div>
          <div className="text-white text-2xl font-bold">{session?.daysElapsed || 0}</div>
        </div>
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="text-green-400 text-sm mb-1">Encounters</div>
          <div className="text-white text-2xl font-bold">{session?.encountersCompleted || 0}</div>
        </div>
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
          <div className="text-orange-400 text-sm mb-1">Total XP Awarded</div>
          <div className="text-white text-2xl font-bold">{session?.totalXpAwarded || 0}</div>
        </div>
      </div>

      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}
