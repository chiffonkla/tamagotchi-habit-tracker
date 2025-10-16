import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import WeatherForecast from '../components/dashboard/WeatherForecast';
import Loading from './Loading';

export default function ForecastPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

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
