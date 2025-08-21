import React, { useState } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import db from '../Components/firebase';

export default function Craft(props) {
  const materials = props.currCraft.dynamicMaterial ? props.currCraft.dynamicMaterial.split('/') : [];
  const difficulties = props.currCraft.difficultyModifier ? props.currCraft.difficultyModifier.split('/') : [];
  const attempts = props.currCraft.attemptsModifier ? props.currCraft.attemptsModifier.split('/') : [];
  const effects = props.currCraft.dynamicEffect ? props.currCraft.dynamicEffect.split('/') : [];
  const [flipped, setFlipped] = useState(false);

  const getDifficultyStyle = (baseDifficulty) => {
    if (baseDifficulty === 'Dynamic') return { bg: '#6366f1', glow: '#818cf8', name: 'DYNAMIC' };
    const diff = parseInt(baseDifficulty);
    if (diff <= 2) return { bg: '#059669', glow: '#10b981', name: 'SIMPLE' };
    if (diff <= 4) return { bg: '#0369a1', glow: '#0ea5e9', name: 'MODERATE' };
    return { bg: '#dc2626', glow: '#ef4444', name: 'MASTER' };
  };

  const diffStyle = getDifficultyStyle(props.currCraft.baseDifficulty);
  const isAdmin = localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
  const isHidden = props.currCraft.hidden === 'Yes';
  const hasDynamicMaterials = materials.length > 0 && props.currCraft.dynamicMaterial !== 'None';

  const flipHidden = () => {
    updateDoc(doc(db, 'Crafts', props.currCraft.name), {
      hidden: props.currCraft.hidden === 'Yes' ? 'No' : 'Yes'
    });
  };

  const components = props.currCraft.components.split('/');
  const skills = props.currCraft.skills.split('/');

  return (
    <>
      {/* Card Container with 3D flip effect */}
      <div className="relative w-72 h-80 perspective-1000">
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${flipped ? 'rotate-y-180' : ''}`}
          onClick={() => setFlipped(!flipped)}
        >
          
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div 
              className="w-full h-full rounded-3xl p-1 shadow-2xl"
              style={{
                background: `linear-gradient(145deg, ${diffStyle.bg}, ${diffStyle.glow})`,
                boxShadow: `0 20px 40px ${diffStyle.bg}40, 0 0 60px ${diffStyle.glow}20`
              }}
            >
              <div className="w-full h-full bg-slate-900 rounded-3xl overflow-hidden relative">
                
                {/* Difficulty Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-black tracking-wider"
                    style={{ backgroundColor: diffStyle.bg, color: 'white' }}
                  >
                    {diffStyle.name}
                  </div>
                </div>

                {/* Hidden Badge */}
                {isHidden && isAdmin && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🚫</span>
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <div className="p-6 h-full flex flex-col">
                  
                  {/* Title Section */}
                  <div className="text-center mb-6">
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                      style={{ backgroundColor: `${diffStyle.bg}30` }}
                    >
                      🔨
                    </div>
                    <h2 className="text-xl font-bold text-white leading-tight">{props.currCraft.name}</h2>
                  </div>

                  {/* Stats Circle */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative">
                      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                        {/* Background circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#374151"
                          strokeWidth="6"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke={diffStyle.bg}
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${(props.currCraft.baseDifficulty === 'Dynamic' ? 5 : parseInt(props.currCraft.baseDifficulty)) * 56.55 / 5} 282.74`}
                          className="transition-all duration-1000"
                          style={{ filter: `drop-shadow(0 0 8px ${diffStyle.glow})` }}
                        />
                      </svg>
                      
                      {/* Center content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="text-2xl font-black text-white mb-1">
                          {props.currCraft.baseDifficulty}
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">
                          Difficulty
                        </div>
                        <div className="text-sm text-gray-300 mt-1">
                          {props.currCraft.baseAttempts} attempts
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="text-center">
                    <div className="text-gray-400 text-sm mb-2">
                      {components.length} components • {skills.length} skills
                    </div>
                    {hasDynamicMaterials && (
                      <div className="inline-flex items-center px-3 py-1 bg-purple-600/30 rounded-full text-purple-300 text-xs">
                        ✨ {materials.length} material variants
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-4">
                      Click to flip card
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div 
              className="w-full h-full rounded-3xl p-1 shadow-2xl"
              style={{
                background: `linear-gradient(145deg, ${diffStyle.glow}, ${diffStyle.bg})`,
                boxShadow: `0 20px 40px ${diffStyle.bg}40, 0 0 60px ${diffStyle.glow}20`
              }}
            >
              <div className="w-full h-full bg-slate-900 rounded-3xl overflow-auto p-6">
                
                {/* Back Header */}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-white">{props.currCraft.name}</h3>
                  <div className="text-gray-400 text-sm">Recipe Details</div>
                </div>

                {/* Components List */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Components
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {components.slice(0, 4).map((comp, idx) => (
                      <div key={idx} className="text-sm text-gray-300 flex items-start">
                        <span className="text-orange-500 mr-2 font-bold">{idx + 1}.</span>
                        <span className="flex-1">{comp}</span>
                      </div>
                    ))}
                    {components.length > 4 && (
                      <div className="text-xs text-gray-500">+{components.length - 4} more...</div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {hasDynamicMaterials && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onShowMaterials(props.currCraft);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl text-sm font-semibold transition-colors"
                    >
                      View Material Effects
                    </button>
                  )}
                  
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        flipHidden();
                      }}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-xl text-sm transition-colors"
                    >
                      {isHidden ? 'Unhide' : 'Hide'} Craft
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-500 text-center mt-4">
                  Click to flip back
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
}