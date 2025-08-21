import React from 'react';
import { moons } from './moonData.jsx';
import { weatherData, weatherIcons } from './weatherData.jsx';

const WeatherForecast = ({
  currentDay,
  dailyWeather,
  selectedMoon,
  onMoonSelect
}) => {
  return (
    <div className="space-y-4">
      {/* Horizontal Moon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
        {moons.map((moon) => {
          const moonWeather = dailyWeather[moon.name];
          const isSelected = selectedMoon === moon.name;
          const weatherInfo = moonWeather && weatherData[moonWeather] ? weatherData[moonWeather] : null;
          
          return (
            <div 
              key={moon.name} 
              className={`p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg transform hover:scale-[1.02] ${
                isSelected 
                  ? 'border-blue-400 bg-gradient-to-br from-blue-500/20 to-blue-600/30 shadow-lg scale-[1.02] backdrop-blur-sm' 
                  : 'border-white/20 bg-white/10 hover:border-blue-300 hover:bg-white/20 backdrop-blur-sm'
              }`}
              onClick={() => onMoonSelect(moon.name)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                {/* Weather Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md transition-all duration-300 ${
                  isSelected 
                    ? 'bg-blue-500 text-white shadow-blue-500/50' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}>
                  {moonWeather && weatherIcons[moonWeather] ? weatherIcons[moonWeather] : '❓'}
                </div>
                
                {/* Moon Name */}
                <div>
                  <h3 className={`font-bold text-sm ${isSelected ? 'text-blue-200' : 'text-white'}`}>
                    {moon.name}
                  </h3>
                  <p className="text-xs text-white/60">
                    {moon.difficulty}
                  </p>
                </div>
                
                {/* Weather Info */}
                <div className="text-center">
                  <div className={`text-xs font-bold ${isSelected ? 'text-blue-100' : 'text-white/80'}`}>
                    {weatherInfo
                      ? weatherInfo.name
                      : moonWeather === '' ? 'Loading...' : 'Unknown'
                    }
                  </div>
                  
                  {/* Cost */}
                  <div className={`text-xs mt-1 ${isSelected ? 'text-blue-200' : 'text-white/60'}`}>
                    {moon.cost === 0 ? 'Free' : `${moon.cost} credits`}
                  </div>
                </div>
                
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="text-xs text-blue-200 font-medium flex items-center space-x-1">
                    <span>✓</span>
                    <span>Selected</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;