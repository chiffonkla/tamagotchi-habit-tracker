import { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Wind,
  Sunrise,
  Sunset,
  Thermometer,
  Calendar
} from 'lucide-react';

export default function WeatherForecast() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_DOMAIN}/api/weather/forecast`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setForecast(data.forecast || []);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
        setError("Failed to load weather forecast");
      } finally {
        setLoading(false);
      }
    };

    // Fetch forecast immediately
    fetchForecast();

    // Set up auto-refresh every 30 minutes
    const interval = setInterval(fetchForecast, 30 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (weather, index) => {
    const isNightTime = new Date().getHours() >= 20 || new Date().getHours() <= 5;
    
    switch (weather.toLowerCase()) {
      case 'sunny':
        return isNightTime ? <Moon className="text-indigo-400" size={32} /> : <Sun className="text-orange-500" size={32} />;
      case 'cloudy':
        return <Cloud className="text-blue-400" size={32} />;
      case 'rainy':
        return <CloudRain className="text-blue-500" size={32} />;
      case 'snowy':
        return <CloudSnow className="text-blue-200" size={32} />;
      case 'thunder':
        return <CloudLightning className="text-yellow-500" size={32} />;
      case 'windy':
        return <Wind className="text-blue-300" size={32} />;
      default:
        return <Sun className="text-orange-500" size={32} />;
    }
  };

  const getWeatherGradient = (weather, index) => {
    const isNightTime = new Date().getHours() >= 20 || new Date().getHours() <= 5;
    
    // For night time, use darker, more muted colors
    if (isNightTime) {
      switch (weather.toLowerCase()) {
        case 'sunny':
          return 'from-indigo-200 to-purple-300'; // Night sky colors
        case 'cloudy':
          return 'from-gray-200 to-gray-300';
        case 'rainy':
          return 'from-blue-300 to-blue-400';
        case 'snowy':
          return 'from-blue-200 to-blue-300';
        case 'thunder':
          return 'from-purple-300 to-indigo-400';
        case 'windy':
          return 'from-cyan-300 to-blue-400';
        default:
          return 'from-indigo-200 to-purple-300';
      }
    }
    
    // Day time colors (original)
    switch (weather.toLowerCase()) {
      case 'sunny':
        return 'from-yellow-200 to-orange-300';
      case 'cloudy':
        return 'from-gray-100 to-gray-200';
      case 'rainy':
        return 'from-blue-200 to-blue-300';
      case 'snowy':
        return 'from-blue-100 to-blue-200';
      case 'thunder':
        return 'from-purple-200 to-indigo-300';
      case 'windy':
        return 'from-cyan-200 to-blue-300';
      default:
        return 'from-yellow-200 to-orange-300';
    }
  };

  const getWeatherMessage = (weather) => {
    const isNightTime = new Date().getHours() >= 20 || new Date().getHours() <= 5;
    
    if (isNightTime) {
      switch (weather.toLowerCase()) {
        case 'sunny':
          return "Clear night sky ahead";
        case 'cloudy':
          return "Overcast night skies";
        case 'rainy':
          return "Night rain expected";
        case 'snowy':
          return "Snowy night coming";
        case 'thunder':
          return "Night storm brewing";
        case 'windy':
          return "Breezy night conditions";
        default:
          return "Night weather forecast";
      }
    }
    
    // Day time messages
    switch (weather.toLowerCase()) {
      case 'sunny':
        return "Perfect day for outdoor activities!";
      case 'cloudy':
        return "Overcast skies ahead";
      case 'rainy':
        return "Don't forget your umbrella!";
      case 'snowy':
        return "Winter wonderland coming";
      case 'thunder':
        return "Stormy weather expected";
      case 'windy':
        return "Breezy conditions";
      default:
        return "Weather forecast";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 font-sniglet">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-sniglet font-normal text-gray-800 mb-2">7-Day Weather Forecast</h2>
        <p className="text-gray-600 font-sniglet font-normal hidden sm:block">Plan your week with confidence</p>
      </div>

      {/* Mobile Layout */}
      <div className="block sm:hidden">
        {/* Today Card - Full Width */}
        {forecast.length > 0 && (
          <div className="mb-4">
            <div className="text-center mb-2">
              <p className="font-sniglet text-sm font-normal text-gray-600">
                {new Date(forecast[0].date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div
              className={`bg-gradient-to-br ${getWeatherGradient(forecast[0].weather, 0)} rounded-xl p-4 text-gray-700 shadow-lg relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 text-4xl opacity-20">
                  {getWeatherIcon(forecast[0].weather, 0)}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-sniglet text-lg font-normal mb-2">Today</h3>
                  <p className="font-sniglet text-sm font-normal capitalize mb-1">{forecast[0].weather}</p>
                  <p className="font-sniglet text-xs font-normal opacity-90">
                    {getWeatherMessage(forecast[0].weather)}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mb-2">
                    {getWeatherIcon(forecast[0].weather, 0)}
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Thermometer size={12} />
                      <span className="font-sniglet text-sm font-normal">
                        {forecast[0].temp_max ? `${Math.round(forecast[0].temp_max * 9/5 + 32)}°F` : 'N/A'}
                      </span>
                    </div>
                    <div className="w-px h-3 bg-gray-500/30"></div>
                    <div className="flex items-center space-x-1">
                      <Thermometer size={12} />
                      <span className="font-sniglet text-sm font-normal opacity-80">
                        {forecast[0].temp_min ? `${Math.round(forecast[0].temp_min * 9/5 + 32)}°F` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remaining Days - 2 rows of 3 cards each */}
        <div className="space-y-4">
          {/* First Row */}
          <div className="grid grid-cols-3 gap-2">
            {forecast.slice(1, 4).map((day, index) => (
              <div key={index + 1} className="flex flex-col">
                {/* Date above card */}
                {day.date && (
                  <div className="text-center mb-1">
                    <p className="font-sniglet text-xs font-normal text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
                
                {/* Weather Card */}
                <div
                  className={`bg-gradient-to-br ${getWeatherGradient(day.weather, index + 1)} rounded-lg p-2 text-gray-700 shadow-md relative overflow-hidden aspect-[3/4] flex flex-col`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1 right-1 text-2xl opacity-20">
                      {getWeatherIcon(day.weather, index + 1)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Day Name */}
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-sniglet text-xs font-normal">
                        {day.day_name}
                      </h3>
                      <Calendar className="text-gray-500" size={10} />
                    </div>

                    {/* Weather Icon */}
                    <div className="flex justify-center mb-1 flex-1 items-center">
                      <div className="scale-100">
                        {getWeatherIcon(day.weather, index + 1)}
                      </div>
                    </div>

                    {/* Weather Description */}
                    <div className="text-center mb-1">
                      <p className="font-sniglet text-xs font-normal capitalize">{day.weather}</p>
                    </div>

                    {/* Temperature */}
                    <div className="flex items-center justify-center space-x-1">
                      <div className="flex items-center space-x-1">
                        <Thermometer size={8} />
                        <span className="font-sniglet text-xs font-normal">
                          {day.temp_max ? `${Math.round(day.temp_max * 9/5 + 32)}°` : 'N/A'}
                        </span>
                      </div>
                      <div className="w-px h-2 bg-gray-500/30"></div>
                      <div className="flex items-center space-x-1">
                        <Thermometer size={8} />
                        <span className="font-sniglet text-xs font-normal opacity-80">
                          {day.temp_min ? `${Math.round(day.temp_min * 9/5 + 32)}°` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-3 gap-2">
            {forecast.slice(4, 7).map((day, index) => (
              <div key={index + 4} className="flex flex-col">
                {/* Date above card */}
                {day.date && (
                  <div className="text-center mb-1">
                    <p className="font-sniglet text-xs font-normal text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
                
                {/* Weather Card */}
                <div
                  className={`bg-gradient-to-br ${getWeatherGradient(day.weather, index + 4)} rounded-lg p-2 text-gray-700 shadow-md relative overflow-hidden aspect-[3/4] flex flex-col`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1 right-1 text-2xl opacity-20">
                      {getWeatherIcon(day.weather, index + 4)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Day Name */}
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-sniglet text-xs font-normal">
                        {day.day_name}
                      </h3>
                      <Calendar className="text-gray-500" size={10} />
                    </div>

                    {/* Weather Icon */}
                    <div className="flex justify-center mb-1 flex-1 items-center">
                      <div className="scale-100">
                        {getWeatherIcon(day.weather, index + 4)}
                      </div>
                    </div>

                    {/* Weather Description */}
                    <div className="text-center mb-1">
                      <p className="font-sniglet text-xs font-normal capitalize">{day.weather}</p>
                    </div>

                    {/* Temperature */}
                    <div className="flex items-center justify-center space-x-1">
                      <div className="flex items-center space-x-1">
                        <Thermometer size={8} />
                        <span className="font-sniglet text-xs font-normal">
                          {day.temp_max ? `${Math.round(day.temp_max * 9/5 + 32)}°` : 'N/A'}
                        </span>
                      </div>
                      <div className="w-px h-2 bg-gray-500/30"></div>
                      <div className="flex items-center space-x-1">
                        <Thermometer size={8} />
                        <span className="font-sniglet text-xs font-normal opacity-80">
                          {day.temp_min ? `${Math.round(day.temp_min * 9/5 + 32)}°` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid sm:grid-cols-7 gap-4">
        {forecast.map((day, index) => (
          <div key={index} className="flex flex-col">
            {/* Date above card */}
            {day.date && (
              <div className="text-center mb-2">
                <p className="font-sniglet text-sm font-normal text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}
            
            {/* Weather Card */}
            <div
              className={`bg-gradient-to-br ${getWeatherGradient(day.weather, index)} rounded-2xl p-4 text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden aspect-[4/5] sm:aspect-[3/4] flex flex-col`}
            >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-6xl opacity-20">
                {getWeatherIcon(day.weather, index)}
              </div>
            </div>

             {/* Content */}
             <div className="relative z-10 flex flex-col h-full">
               {/* Day Name */}
               <div className="flex items-center justify-center mb-2 sm:mb-3">
                 <h3 className="font-sniglet text-xs sm:text-sm md:text-base font-normal">
                   {index === 0 ? 'Today' : day.day_name}
                 </h3>
               </div>

               {/* Weather Icon */}
               <div className="flex justify-center mb-2 sm:mb-3 flex-1 items-center">
                 <div className="scale-75 sm:scale-100">
                   {getWeatherIcon(day.weather, index)}
                 </div>
               </div>

               {/* Weather Description */}
               <div className="text-center mb-2 sm:mb-3">
                 <p className="font-sniglet text-xs sm:text-sm font-normal capitalize truncate">{day.weather}</p>
                 <p className="font-sniglet text-xs font-normal opacity-90 mt-1 hidden sm:block">
                   {getWeatherMessage(day.weather)}
                 </p>
               </div>

               {/* Temperature */}
               <div className="flex items-center justify-center space-x-1 sm:space-x-3 mb-2 sm:mb-3">
                 <div className="flex items-center space-x-1">
                   <Thermometer size={10} className="sm:hidden" />
                   <Thermometer size={14} className="hidden sm:block" />
                   <span className="font-sniglet text-xs sm:text-sm font-normal">
                     {day.temp_max ? `${Math.round(day.temp_max * 9/5 + 32)}°F` : 'N/A'}
                   </span>
                 </div>
                 <div className="w-px h-2 sm:h-3 bg-gray-500/30"></div>
                 <div className="flex items-center space-x-1">
                   <Thermometer size={10} className="sm:hidden" />
                   <Thermometer size={14} className="hidden sm:block" />
                   <span className="font-sniglet text-xs sm:text-sm font-normal opacity-80">
                     {day.temp_min ? `${Math.round(day.temp_min * 9/5 + 32)}°F` : 'N/A'}
                   </span>
                 </div>
               </div>

             </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-400/30"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h3 className="font-sniglet text-lg sm:text-xl font-normal text-gray-800 mb-4 text-center">
          Weekly Summary
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="font-sniglet text-xs sm:text-sm font-normal text-gray-600">Sunny Days</p>
            <p className="font-sniglet text-lg sm:text-2xl font-normal text-yellow-500">
              {forecast.filter(day => day.weather === 'sunny').length}
            </p>
          </div>
          <div>
            <p className="font-sniglet text-xs sm:text-sm font-normal text-gray-600">Rainy Days</p>
            <p className="font-sniglet text-lg sm:text-2xl font-normal text-blue-500">
              {forecast.filter(day => day.weather === 'rainy').length}
            </p>
          </div>
          <div>
            <p className="font-sniglet text-xs sm:text-sm font-normal text-gray-600">Cloudy Days</p>
            <p className="font-sniglet text-lg sm:text-2xl font-normal text-gray-500">
              {forecast.filter(day => day.weather === 'cloudy').length}
            </p>
          </div>
          <div>
            <p className="font-sniglet text-xs sm:text-sm font-normal text-gray-600">Stormy Days</p>
            <p className="font-sniglet text-lg sm:text-2xl font-normal text-purple-500">
              {forecast.filter(day => day.weather === 'thunder').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
