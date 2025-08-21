import React from 'react';

export default function GroupItem(props) {
  const group = props.currGroup;
  
  return (
    <div className="w-full h-[615px] bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:border-purple-400 transition-all duration-300 hover:shadow-xl">
      <div className="p-6 h-full overflow-y-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {group.name}
          </h1>
          {group.link && (
            <a
              href={group.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
              </svg>
              <span>View Documentation</span>
            </a>
          )}
        </div>

        {/* Primary Goal Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <h3 className="text-lg font-bold text-purple-300">Our Goal</h3>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <p className="text-purple-200 italic leading-relaxed">
              {group.primaryGoal}
            </p>
          </div>
        </div>

        {/* Relations Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            <h3 className="text-lg font-bold text-pink-300">Relations</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.relations.map((relation, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30"
              >
                {relation}
              </span>
            ))}
          </div>
        </div>

        {/* Subgroups Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <h3 className="text-lg font-bold text-blue-300">Subgroups</h3>
          </div>
          <div className="space-y-3">
            {group.subGroups.map((subgroup, index) => (
              <div
                key={index}
                className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 border-l-4 border-l-blue-400"
              >
                <h4 className="text-base font-bold text-blue-300 mb-2">
                  {subgroup.name}
                </h4>
                <p className="text-gray-300 text-sm mb-2 leading-relaxed">
                  {subgroup.function.split(',').join('. ')}
                </p>
                <p className="text-blue-200 text-sm font-medium">
                  Lead by {subgroup.leader}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Outposts Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <h3 className="text-lg font-bold text-green-300">Outposts</h3>
          </div>
          <div className="space-y-3">
            {group.outposts.map((outpost, index) => (
              <div
                key={index}
                className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 border-l-4 border-l-green-400"
              >
                <h4 className="text-base font-bold text-green-300 mb-3">
                  {outpost.name}
                </h4>
                <div className="space-y-1">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-400 text-sm font-semibold min-w-[70px]">Status:</span>
                    <span className="text-gray-300 text-sm">{outpost.status}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-400 text-sm font-semibold min-w-[70px]">Function:</span>
                    <span className="text-gray-300 text-sm">{outpost.function}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-400 text-sm font-semibold min-w-[70px]">Population:</span>
                    <span className="text-gray-300 text-sm">{outpost.population}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}