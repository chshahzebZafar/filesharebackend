import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WorldMapBackground } from './WorldMapBackground';
import { apiService } from '@/services/api';

interface UserActivity {
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  userCount: number;
  lastActive: Date;
}

interface WorldMapProps {
  className?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({ className }) => {
  const { t } = useTranslation();
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Simulated user activity data - in real app, this would come from your backend
  const generateMockData = (): UserActivity[] => {
    const countries = [
      { name: 'United States', code: 'US', lat: 39.8283, lng: -98.5795, users: 1250 },
      { name: 'United Kingdom', code: 'GB', lat: 55.3781, lng: -3.4360, users: 890 },
      { name: 'Germany', code: 'DE', lat: 51.1657, lng: 10.4515, users: 720 },
      { name: 'France', code: 'FR', lat: 46.2276, lng: 2.2137, users: 650 },
      { name: 'Canada', code: 'CA', lat: 56.1304, lng: -106.3468, users: 580 },
      { name: 'Australia', code: 'AU', lat: -25.2744, lng: 133.7751, users: 420 },
      { name: 'Japan', code: 'JP', lat: 36.2048, lng: 138.2529, users: 380 },
      { name: 'Brazil', code: 'BR', lat: -14.2350, lng: -51.9253, users: 320 },
      { name: 'India', code: 'IN', lat: 20.5937, lng: 78.9629, users: 280 },
      { name: 'Spain', code: 'ES', lat: 40.4637, lng: -3.7492, users: 250 },
      { name: 'Netherlands', code: 'NL', lat: 52.1326, lng: 5.2913, users: 220 },
      { name: 'Italy', code: 'IT', lat: 41.8719, lng: 12.5674, users: 200 },
      { name: 'Sweden', code: 'SE', lat: 60.1282, lng: 18.6435, users: 180 },
      { name: 'Norway', code: 'NO', lat: 60.4720, lng: 8.4689, users: 150 },
      { name: 'Denmark', code: 'DK', lat: 56.2639, lng: 9.5018, users: 120 },
      { name: 'Finland', code: 'FI', lat: 61.9241, lng: 25.7482, users: 100 },
      { name: 'Switzerland', code: 'CH', lat: 46.8182, lng: 8.2275, users: 90 },
      { name: 'Belgium', code: 'BE', lat: 50.8503, lng: 4.3517, users: 80 },
      { name: 'Austria', code: 'AT', lat: 47.5162, lng: 14.5501, users: 70 },
      { name: 'Poland', code: 'PL', lat: 51.9194, lng: 19.1451, users: 60 },
      { name: 'Czech Republic', code: 'CZ', lat: 49.8175, lng: 15.4730, users: 50 },
      { name: 'Hungary', code: 'HU', lat: 47.1625, lng: 19.5033, users: 40 },
      { name: 'Slovakia', code: 'SK', lat: 48.6690, lng: 19.6990, users: 30 },
      { name: 'Slovenia', code: 'SI', lat: 46.0569, lng: 14.5058, users: 25 },
      { name: 'Croatia', code: 'HR', lat: 45.1000, lng: 15.2000, users: 20 },
      { name: 'Serbia', code: 'RS', lat: 44.0165, lng: 21.0059, users: 15 },
      { name: 'Bulgaria', code: 'BG', lat: 42.7339, lng: 25.4858, users: 12 },
      { name: 'Romania', code: 'RO', lat: 45.9432, lng: 24.9668, users: 10 },
      { name: 'Greece', code: 'GR', lat: 39.0742, lng: 21.8243, users: 8 },
      { name: 'Portugal', code: 'PT', lat: 39.3999, lng: -8.2245, users: 6 },
      { name: 'Ireland', code: 'IE', lat: 53.1424, lng: -7.6921, users: 5 },
      { name: 'Iceland', code: 'IS', lat: 64.9631, lng: -19.0208, users: 3 },
      { name: 'Luxembourg', code: 'LU', lat: 49.8153, lng: 6.1296, users: 2 },
      { name: 'Malta', code: 'MT', lat: 35.9375, lng: 14.3754, users: 1 },
    ];

    return countries.map(country => ({
      country: country.name,
      countryCode: country.code,
      latitude: country.lat,
      longitude: country.lng,
      userCount: country.users,
      lastActive: new Date(Date.now() - Math.random() * 300000) // Random time within last 5 minutes
    }));
  };

  useEffect(() => {
    const fetchGlobalActivity = async () => {
      try {
        const result = await apiService.getGlobalActivity();
        if (result.success && result.data) {
          setUserActivity(result.data.userActivity);
        } else {
          // Fallback to mock data if API fails
          console.warn('Using mock data for world map:', result.message);
          setUserActivity(generateMockData());
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching global activity:', error);
        setUserActivity(generateMockData());
        setIsLoading(false);
      }
    };

    fetchGlobalActivity();

    // Refresh data every 5 minutes
    const updateInterval = setInterval(fetchGlobalActivity, 5 * 60 * 1000);

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  const getDotSize = (userCount: number) => {
    if (userCount > 1000) return 12;
    if (userCount > 500) return 10;
    if (userCount > 100) return 8;
    if (userCount > 50) return 6;
    return 4;
  };

  const getDotColor = (userCount: number) => {
    if (userCount > 1000) return 'bg-red-500';
    if (userCount > 500) return 'bg-orange-500';
    if (userCount > 100) return 'bg-yellow-500';
    if (userCount > 50) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const convertLatLngToSVG = (lat: number, lng: number) => {
    // Convert latitude/longitude to SVG coordinates
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const totalUsers = userActivity.reduce((sum, activity) => sum + activity.userCount, 0);

  if (isLoading) {
    return (
      <div className={`w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading world activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('home.map.title', 'Global User Activity')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('home.map.subtitle', 'Live users around the world')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {totalUsers.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t('home.map.activeUsers', 'Active Users')}
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative p-6">
        <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-lg overflow-hidden">
          {/* World Map Background */}
          <WorldMapBackground />

          {/* Activity Dots */}
          {userActivity.map((activity, index) => {
            const { x, y } = convertLatLngToSVG(activity.latitude, activity.longitude);
            const dotSize = getDotSize(activity.userCount);
            const dotColor = getDotColor(activity.userCount);
            
            return (
              <div
                key={activity.countryCode}
                className={`absolute ${dotColor} rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-125 group animate-map-dot-float animate-map-dot-glow`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${dotSize}px`,
                  height: `${dotSize}px`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={() => setHoveredCountry(activity.country)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                {/* Pulse animation */}
                <div className={`absolute inset-0 ${dotColor} rounded-full animate-ping opacity-75`}></div>
                
                {/* Tooltip */}
                {hoveredCountry === activity.country && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
                    <div className="font-semibold">{activity.country}</div>
                    <div>{activity.userCount.toLocaleString()} users</div>
                    <div className="text-gray-300">
                      {t('home.map.lastActive', 'Last active')}: {activity.lastActive.toLocaleTimeString()}
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">1000+ users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">500+ users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">100+ users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">50+ users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">&lt;50 users</span>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {userActivity.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t('home.map.countries', 'Countries')}
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {Math.max(...userActivity.map(a => a.userCount)).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t('home.map.highestActivity', 'Highest Activity')}
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {Math.floor(totalUsers / userActivity.length).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t('home.map.averageUsers', 'Avg per Country')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 