import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import WeatherForecast from '../components/dashboard/WeatherForecast';
import Loading from './Loading';
import { Menu, X, Cloud, CloudRain, Sun, Moon, Sunrise, Home, User, Users, Trophy, Bell, HelpCircle, Settings, LogOut } from 'lucide-react';

export default function ForecastPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentWeather, setCurrentWeather] = useState('Sunny');
  const [timeOfDay, setTimeOfDay] = useState('afternoon');

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Time and weather updates for mobile header
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12;

      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      // Update timeOfDay
      const currentHour = now.getHours();
      if (currentHour >= 0 && currentHour < 3) {
        setTimeOfDay("midnight");
      } else if (currentHour >= 3 && currentHour < 5) {
        setTimeOfDay("predawn");
      } else if (currentHour >= 5 && currentHour < 6) {
        setTimeOfDay("dawn");
      } else if (currentHour >= 6 && currentHour < 7) {
        setTimeOfDay("sunrise");
      } else if (currentHour >= 7 && currentHour < 11) {
        setTimeOfDay("morning");
      } else if (currentHour >= 11 && currentHour < 13) {
        setTimeOfDay("noon");
      } else if (currentHour >= 13 && currentHour < 17) {
        setTimeOfDay("afternoon");
      } else if (currentHour >= 17 && currentHour < 19) {
        setTimeOfDay("evening");
      } else if (currentHour >= 19 && currentHour < 20) {
        setTimeOfDay("sunset");
      } else if (currentHour >= 20 && currentHour < 21) {
        setTimeOfDay("twilight");
      } else {
        setTimeOfDay("night");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather data for mobile header
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/weather`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const weather = data.weather;
          const formattedWeather = weather.charAt(0).toUpperCase() + weather.slice(1);
          setCurrentWeather(formattedWeather);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_DOMAIN}/api/profile`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch profile data");
        }

        const { data } = await response.json();
        setUserName(data.user?.display_name || 'User');
      } catch (error) {
        console.error('Auth check failed:', error);
        setError('Failed to load profile data');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Mobile header functions
  const getWeatherIcon = () => {
    const isNightTime = ["night", "midnight", "predawn", "twilight"].includes(timeOfDay);
    const isDawnDusk = ["dawn", "sunrise", "sunset", "twilight"].includes(timeOfDay);
    
    if (currentWeather.toLowerCase().includes("rain")) {
      return <CloudRain className="text-blue-500" size={20} />
    } else if (currentWeather.toLowerCase().includes("cloud")) {
      return <Cloud className={isNightTime ? "text-gray-400" : "text-blue-400"} size={20} />
    } else if (isNightTime) {
      return <Moon className="text-indigo-400" size={20} />
    } else if (isDawnDusk) {
      return <Sunrise className="text-orange-400" size={20} />
    } else {
      return <Sun className="text-yellow-400" size={20} />
    }
  }

  const getEnhancedWeatherDisplay = () => {
    const isNightTime = ["night", "midnight", "predawn", "twilight"].includes(timeOfDay);
    const isDawnDusk = ["dawn", "sunrise", "sunset", "twilight"].includes(timeOfDay);
    const weather = currentWeather.toLowerCase();
    
    if (weather === "sunny" && isNightTime) {
      return "Clear Night";
    }
    
    if (weather === "sunny" && isDawnDusk) {
      return "Clear Sky";
    }
    
    return currentWeather;
  }

  // Menu items (same as MobileDashboard)
  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', action: () => navigate('/dashboard') },
    { icon: <Cloud size={20} />, label: 'Weather Forecast', action: () => navigate('/forecast') },
    { icon: <User size={20} />, label: 'Profile', action: () => navigate('/profile') },
    { icon: <Users size={20} />, label: 'Friends', action: () => navigate('/friends') },
    { icon: <Trophy size={20} />, label: 'Leaderboard', action: () => navigate('/leaderboard') },
    { icon: <Bell size={20} />, label: 'Notifications', action: () => navigate('/notifications') },
    { icon: <HelpCircle size={20} />, label: 'Help', action: () => navigate('/help') },
    { icon: <Settings size={20} />, label: 'Settings', action: () => navigate('/settings') },
    { icon: <LogOut size={20} />, label: 'Logout', action: 'logout' },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Logout successful');
        navigate('/login');
      } else {
        console.error('Logout failed');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/login');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#def8fb] flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white px-4 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-full hover:bg-gray-100">
              {showMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="text-lg font-sniglet">Tamagotchi Tracker</h1>
          </div>
          <div className="flex items-center gap-2">
            {getWeatherIcon()}
            <span className="text-sm font-sniglet">{getEnhancedWeatherDisplay()}</span>
            <span className="text-sm font-sniglet border-l border-gray-300 pl-2">{currentTime}</span>
          </div>
        </header>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="fixed inset-0 z-50 backdrop-blur-md bg-opacity-50" onClick={() => setShowMenu(false)}>
            <div className="w-64 h-full bg-white p-4 animate-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col h-full">
                {/* User Profile Section */}
                <div className="mb-6 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-medium">{userName[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{userName}</p>
                      <button 
                        onClick={() => {
                          navigate('/profile');
                          setShowMenu(false);
                        }}
                        className="text-sm text-gray-500 hover:text-purple-600 transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>

                <nav className="flex-1">
                  <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <button
                          onClick={() => {
                            if (item.label === 'Logout') {
                              handleLogout()
                            } else if (item.action) {
                              item.action()
                              setShowMenu(false)
                            } else {
                              navigate(item.href)
                              setShowMenu(false)
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-3 ${
                            item.label === 'Weather Forecast' ? 'bg-purple-100 text-purple-700' : ''
                          }`}
                        >
                          {item.icon}
                          <span className="font-sniglet">{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Content */}
        <div className="flex-1 p-4">
          <WeatherForecast />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <Layout userName={userName}>
      <div 
        className="relative min-h-screen flex flex-col"
        style={{ backgroundColor: "#DEF8FB" }}
      >
        <div className="flex-1 px-8 py-4 mt-8 max-w-7xl mx-auto w-full">
          <WeatherForecast />
        </div>
      </div>
    </Layout>
  );
}
