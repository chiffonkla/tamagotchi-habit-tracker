import {
  Cloud,
  Sun,
  Moon,
  Snowflake,
  Sunrise,
  Sunset,
  MoonStar,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
} from "lucide-react"

// Get time of day icon
export function getTimeOfDayIcon(timeOfDay) {
  switch (timeOfDay) {
    case "dawn":
    case "daybreak":
      return <Sunrise size={24} className="text-orange-300" />
    case "sunrise":
      return <Sunrise size={24} className="text-yellow-400" />
    case "morning":
      return <Sun size={24} className="text-yellow-400" />
    case "noon":
      return <Sun size={24} className="text-yellow-500" />
    case "afternoon":
      return <Sun size={24} className="text-yellow-400" />
    case "evening":
      return <Sunset size={24} className="text-orange-400" />
    case "sunset":
    case "dusk":
      return <Sunset size={24} className="text-orange-500" />
    case "twilight":
      return <Moon size={24} className="text-blue-300" />
    case "night":
      return <Moon size={24} className="text-indigo-400" />
    case "midnight":
      return <Moon size={24} className="text-indigo-600" />
    case "predawn":
      return <MoonStar size={24} className="text-indigo-500" />
    default:
      return <Sun size={24} className="text-yellow-400" />
  }
}

// Get weather icon with time of day consideration
export function getWeatherIcon(currentWeather, timeOfDay) {
  const isNightTime = ["night", "midnight", "predawn", "twilight"].includes(timeOfDay);
  const isDawnDusk = ["dawn", "sunrise", "sunset", "twilight"].includes(timeOfDay);
  
  if (currentWeather.toLowerCase().includes("cloud")) {
    return <Cloud size={24} className={isNightTime ? "text-gray-400" : "text-blue-400"} />
  } else if (currentWeather.toLowerCase().includes("rain")) {
    return <CloudRain size={24} className="text-blue-500" />
  } else if (currentWeather.toLowerCase().includes("snow")) {
    return <CloudSnow size={24} className="text-blue-200" />
  } else if (currentWeather.toLowerCase().includes("thunder")) {
    return <CloudLightning size={24} className="text-yellow-500" />
  } else if (currentWeather.toLowerCase().includes("fog") || currentWeather.toLowerCase().includes("mist")) {
    return <CloudFog size={24} className="text-gray-400" />
  } else if (currentWeather.toLowerCase().includes("wind")) {
    return <Wind size={24} className="text-blue-300" />
  } else {
    // For sunny/clear weather, show moon at night, sun during day
    if (isNightTime) {
      return <Moon size={24} className="text-indigo-300" />
    } else if (isDawnDusk) {
      return <Sunrise size={24} className="text-orange-400" />
    } else {
      return <Sun size={24} className="text-yellow-400" />
    }
  }
}

// Get enhanced weather display that combines weather + time of day
export function getEnhancedWeather(currentWeather, timeOfDay) {
  const isNightTime = ["night", "midnight", "predawn", "twilight"].includes(timeOfDay);
  const isDawnDusk = ["dawn", "sunrise", "sunset", "twilight"].includes(timeOfDay);
  
  const weather = currentWeather.toLowerCase();
  
  // For sunny weather at night, show as "clear night"
  if (weather === "sunny" && isNightTime) {
    return {
      displayWeather: "Clear Night",
      weatherType: "clear-night"
    };
  }
  
  // For sunny weather at dawn/dusk, show as "clear sky"
  if (weather === "sunny" && isDawnDusk) {
    return {
      displayWeather: "Clear Sky",
      weatherType: "clear-dawn-dusk"
    };
  }
  
  // For other weather conditions, keep as is but adjust for night
  if (isNightTime && !["rainy", "snowy", "thunder"].includes(weather)) {
    return {
      displayWeather: currentWeather,
      weatherType: `night-${weather}`
    };
  }
  
  return {
    displayWeather: currentWeather,
    weatherType: weather
  };
}

// Get time-appropriate weather messages
export function getWeatherMessage(currentWeather, timeOfDay) {
  const isNightTime = ["night", "midnight", "predawn", "twilight"].includes(timeOfDay);
  const isDawnDusk = ["dawn", "sunrise", "sunset", "twilight"].includes(timeOfDay);
  
  const weather = currentWeather.toLowerCase();
  
  // Night-time messages
  if (isNightTime) {
    switch (weather) {
      case 'sunny':
        return "Your pet is gazing at the starry night sky!";
      case 'rainy':
        return "Your pet is listening to the gentle night rain!";
      case 'cloudy':
        return "Your pet is watching the clouds drift across the moon!";
      case 'snowy':
        return "Your pet is watching the snowflakes dance in the moonlight!";
      case 'windy':
        return "Your pet's fur is rustling in the night breeze!";
      case 'thunder':
        return "Your pet is safe and warm during the night storm!";
      case 'foggy':
        return "Your pet is exploring the mysterious night fog!";
      default:
        return `Your pet is enjoying the peaceful ${weather} night!`;
    }
  }
  
  // Dawn/Dusk messages
  if (isDawnDusk) {
    switch (weather) {
      case 'sunny':
        return "Your pet is watching the beautiful sky colors!";
      case 'rainy':
        return "Your pet is staying cozy during the gentle rain!";
      case 'cloudy':
        return "Your pet is enjoying the soft, diffused light!";
      case 'snowy':
        return "Your pet is watching the snow in the golden light!";
      case 'windy':
        return "Your pet's fur is flowing in the gentle breeze!";
      case 'thunder':
        return "Your pet is safe during the dramatic sky show!";
      case 'foggy':
        return "Your pet is exploring the mystical atmosphere!";
      default:
        return `Your pet is enjoying the serene ${weather} atmosphere!`;
    }
  }
  
  // Day-time messages (original)
  switch (weather) {
    case 'sunny':
      return "Your pet is basking in the sunshine!";
    case 'rainy':
      return "Your pet is staying dry and cozy inside!";
    case 'cloudy':
      return "Your pet is enjoying the cool, cloudy day!";
    case 'snowy':
      return "Your pet is watching the snowflakes fall!";
    case 'windy':
      return "Your pet's fur is blowing in the breeze!";
    case 'thunder':
      return "Your pet is safe and sound during the storm!";
    case 'foggy':
      return "Your pet is exploring the misty morning!";
    default:
      return `Your pet is enjoying the ${weather} weather!`;
  }
}

// Get season icon
export function getSeasonIcon(season) {
  switch (season) {
    case "winter":
      return <Snowflake size={24} className="text-blue-300" />
    case "spring":
      return "🌸"
    case "summer":
      return "☀️"
    case "autumn":
      return "🍂"
    default:
      return "🌸"
  }
} 
