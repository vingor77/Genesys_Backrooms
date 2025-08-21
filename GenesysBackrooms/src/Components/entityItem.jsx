import React from 'react';

export default function EntityItem(props) {
  const statNames = ["Brawn", "Agility", "Intellect", "Cunning", "Willpower", "Presence"];
  const statIcons = ["💪", "🏃", "🧠", "🎯", "❤️", "👥"];
  const stats = props.entity.stats.split("/");
  const defenses = props.entity.defenses.split("/");
  const skills = props.entity.skills.split("/").join(", ");

  let drops = "";
  if (props.person === false) {
    drops = props.entity.drops.split("/").join(", ");
  }
  
  const talents = props.entity.talents.split("/");
  const abilities = props.entity.abilities.split("/");
  const actions = props.entity.actions.split("/");
  const equipment = props.entity.equipment.split("/").join(', ');

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 2) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (difficulty < 4) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (difficulty < 6) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (difficulty < 8) return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Minion': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'Rival': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Nemesis': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const StatChip = ({ name, value, icon, index }) => (
    <div className="flex items-center space-x-2 bg-white/5 border border-white/20 rounded-lg px-2 py-2 min-w-0">
      <span className="text-base flex-shrink-0">{icon}</span>
      <div className="text-white min-w-0 flex-1">
        <span className="font-medium text-xs block truncate">{name}:</span>
        <span className="font-bold text-purple-300 text-sm block">{value}</span>
      </div>
    </div>
  );

  const InfoSection = ({ title, children, icon }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
        {icon && <span className="text-xl">{icon}</span>}
        <span>{title}</span>
      </h3>
      <div className="pl-1">
        {children}
      </div>
    </div>
  );

  const ListItem = ({ text, index }) => (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-2">
      <div className="flex items-start space-x-3">
        <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-500 text-white text-xs font-bold rounded-full flex-shrink-0 mt-0.5">
          {index + 1}
        </span>
        <p className="text-gray-300 text-sm leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {props.entity.name}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-3">
          {props.person === false && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(props.entity.type)}`}>
              Type: {props.entity.type}
            </span>
          )}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(props.entity.difficulty)}`}>
            Difficulty: {props.entity.difficulty}
          </span>
          {props.person === false && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-red-500/20 text-red-300 border-red-500/30">
              Fear: {props.entity.fear === -1 ? Math.ceil(props.entity.difficulty / 2) : props.entity.fear}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {props.person === false && props.entity.description && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
          <p className="text-purple-200 text-center italic text-lg leading-relaxed">
            {props.entity.description}
          </p>
        </div>
      )}

      {/* Stats Section */}
      <InfoSection title="Characteristics" icon="📊">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {stats.map((stat, index) => (
            <StatChip
              key={index}
              name={statNames[index]}
              value={stat}
              icon={statIcons[index]}
              index={index}
            />
          ))}
        </div>
      </InfoSection>

      {/* Combat Stats */}
      <InfoSection title="Combat Stats" icon="⚔️">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center min-w-0">
            <div className="text-green-300 text-xs font-medium truncate">Soak</div>
            <div className="text-white text-lg font-bold">{props.entity.soak}</div>
          </div>
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-center min-w-0">
            <div className="text-red-300 text-xs font-medium truncate">Wounds</div>
            <div className="text-white text-lg font-bold">{props.entity.wounds}</div>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-center min-w-0">
            <div className="text-yellow-300 text-xs font-medium truncate">Strain</div>
            <div className="text-white text-lg font-bold">
              {props.entity.strain === 0 ? "N/A" : props.entity.strain}
            </div>
          </div>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center min-w-0">
            <div className="text-blue-300 text-xs font-medium truncate">Defense</div>
            <div className="text-white text-lg font-bold">{defenses.join("/")}</div>
          </div>
        </div>
      </InfoSection>

      <div className="border-t border-white/20 pt-6">
        {props.person === false && props.entity.behavior && (
          <InfoSection title="Behavior" icon="🎭">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">{props.entity.behavior}</p>
            </div>
          </InfoSection>
        )}

        <InfoSection title="Skills" icon="🎯">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed">{skills}</p>
          </div>
        </InfoSection>

        {talents.length > 0 && talents[0] && (
          <InfoSection title="Talents" icon="⭐">
            <div className="space-y-2">
              {talents.map((talent, index) => (
                <ListItem key={index} text={talent} index={index} />
              ))}
            </div>
          </InfoSection>
        )}

        {abilities.length > 0 && abilities[0] && (
          <InfoSection title="Abilities" icon="🔮">
            <div className="space-y-2">
              {abilities.map((ability, index) => (
                <ListItem key={index} text={ability} index={index} />
              ))}
            </div>
          </InfoSection>
        )}

        {actions.length > 0 && actions[0] && (
          <InfoSection title="Actions" icon="⚡">
            <div className="space-y-2">
              {actions.map((action, index) => (
                <ListItem key={index} text={action} index={index} />
              ))}
            </div>
          </InfoSection>
        )}

        {equipment && (
          <InfoSection title="Equipment" icon="🛡️">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">{equipment}</p>
            </div>
          </InfoSection>
        )}

        {props.person === false && drops && (
          <InfoSection title="Drops" icon="💎">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">{drops}</p>
            </div>
          </InfoSection>
        )}
      </div>
    </div>
  );
}