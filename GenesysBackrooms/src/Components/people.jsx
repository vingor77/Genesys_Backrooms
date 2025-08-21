import React, { useState } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import db from '../Components/firebase';
import EntityItem from "./entityItem";

export default function People(props) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [showCombatStats, setShowCombatStats] = useState(false);

  const affiliations = props.currPerson.importantAffiliations
    ? props.currPerson.importantAffiliations.split('/').filter(Boolean)
    : [];

  // Get person theme based on fighter status and group
  const getPersonTheme = () => {
    if (props.currPerson.fighter === 'Yes') {
      return {
        primary: '#dc2626',
        secondary: '#ef4444',
        accent: '#f87171',
        name: 'FIGHTER',
        icon: '⚔️',
        gradient: 'from-red-600 to-red-700',
        ring: 'ring-red-500/30',
        bg: 'bg-red-500/10'
      };
    }
    
    if (props.currPerson.associatedGroup) {
      return {
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
        name: 'SOCIAL',
        icon: '👤',
        gradient: 'from-purple-600 to-purple-700',
        ring: 'ring-purple-500/30',
        bg: 'bg-purple-500/10'
      };
    }
    
    return {
      primary: '#0ea5e9',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      name: 'CIVILIAN',
      icon: '🧑',
      gradient: 'from-blue-600 to-blue-700',
      ring: 'ring-blue-500/30',
      bg: 'bg-blue-500/10'
    };
  };

  const personTheme = getPersonTheme();
  const isAdmin = localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
  const isHidden = props.currPerson.hidden === 'Yes';
  const isFighter = props.currPerson.fighter === 'Yes';

  const flipHidden = () => {
    updateDoc(doc(db, 'PeopleOfInterest', props.currPerson.name), {
      hidden: props.currPerson.hidden === 'Yes' ? 'No' : 'Yes'
    });
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const infoSections = [
    { key: 'introduction', label: 'Introduction', content: props.currPerson.introduction, icon: '📋' },
    { key: 'reason', label: 'Reason for Interest', content: props.currPerson.reason, icon: '🎯' },
    { key: 'personality', label: 'Personality', content: props.currPerson.personality, icon: '🧠' },
  ];

  return (
    <>
      <div className="w-96 h-[700px] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-auto flex flex-col">
        
        {/* Header Section */}
        <div className={`relative p-6 bg-gradient-to-br ${personTheme.gradient}`}>
          {/* Main Header Info */}
          <div className="text-center text-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
              {personTheme.icon}
            </div>
            <h2 className="text-2xl font-bold mb-2">{props.currPerson.name}</h2>
            
            {/* Status Badge */}
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-3 backdrop-blur-sm">
              <span className="mr-1">{personTheme.icon}</span>
              {personTheme.name}
            </div>
            
            {props.currPerson.associatedGroup && (
              <div className="text-sm opacity-90 bg-white/10 rounded-full px-3 py-1 inline-block backdrop-blur-sm">
                {props.currPerson.associatedGroup}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col">
          
          {/* Affiliations */}
          {affiliations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Affiliations ({affiliations.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {affiliations.map((affiliation, idx) => (
                  <span key={idx} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-500/30">
                    {affiliation}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Expandable Info Sections */}
          <div className="flex-1 mb-4">
            <div className="h-64 overflow-y-auto space-y-3 pr-2">
              {infoSections.map((section) => 
                section.content ? (
                  <div key={section.key} className="border border-slate-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{section.icon}</span>
                        <span className="text-white font-medium">{section.label}</span>
                      </div>
                      <span className={`text-gray-400 transition-transform ${expandedSection === section.key ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    {expandedSection === section.key && (
                      <div className="px-4 py-3 bg-slate-750 border-t border-slate-600">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    )}
                  </div>
                ) : null
              )}
            </div>
          </div>

          {/* Action Buttons - Always takes same space */}
          <div className="space-y-2 h-20 flex flex-col justify-end">
            {isFighter && (
              <button
                onClick={() => setShowCombatStats(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <span className="mr-2">⚔️</span>
                View Combat Stats
              </button>
            )}
            
            {isAdmin && (
              <button
                onClick={flipHidden}
                className={`w-full bg-gray-600 hover:bg-gray-700 text-white px-4 rounded-lg font-medium transition-colors ${isFighter ? 'py-2' : 'py-3'}`}
              >
                {isHidden ? 'Unhide' : 'Hide'} Person
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Combat Stats Modal */}
      {showCombatStats && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-600 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className={`p-6 border-b border-slate-600 bg-gradient-to-r ${personTheme.gradient}`}>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                    ⚔️
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{props.currPerson.name}</h2>
                    <p className="text-white/80">Combat Statistics</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCombatStats(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <EntityItem entity={props.currPerson} person={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}