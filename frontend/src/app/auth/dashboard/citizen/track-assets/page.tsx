'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import RoleGuard from '@/components/RoleGuard';
import api from '@/utils/axiosInstance';

// Interfaces for the data to be fetched
interface PublicFacility {
  id: string;
  type: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface WasteWorkerLocation {
  id: string;
  workerId: string;
  latitude: number;
  longitude: number;
}

// Dynamically import the map component to prevent SSR issues with Leaflet
const CivicMap = dynamic(() => import('@/components/CivicMap'), {
  ssr: false,
  loading: () => <p className="text-white">Loading map...</p>,
});

const LiveAssetTrackerPage = () => {
  const [facilities, setFacilities] = useState<PublicFacility[]>([]);
  const [workerLocations, setWorkerLocations] = useState<WasteWorkerLocation[]>([]);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user's current location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error('Error getting user location:', err);
        }
      );
    }
    const fetchAssetData = async () => {
      setLoading(true);
      setError('');
      try {
        const [facilitiesRes, workersRes] = await Promise.all([
          api.get('/maps/facilities'),
          api.get('/maps/worker-locations'),
        ]);
        setFacilities(facilitiesRes.data);
        setWorkerLocations(workersRes.data);
      } catch (err) {
        setError('Failed to load map data. Please try again later.');
        console.error('Error fetching asset data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssetData();
  }, []);

  if (loading || !userPosition) {
    return (
      <RoleGuard role="CITIZEN">
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
          <p className="text-xl animate-pulse">Loading Live Asset Tracker...</p>
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard role="CITIZEN">
        <div className="flex justify-center items-center h-screen bg-gray-900 text-red-400">
          <p className="text-xl">{error}</p>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard role="CITIZEN">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">🚚 Live Asset Tracker</h1>
        <p className="mb-4 text-gray-300">
          View the real-time locations of waste collection vehicles and public facilities.
        </p>
        <div className="relative w-full h-[600px] overflow-hidden rounded-lg shadow-lg">
          <CivicMap
            reports={[]}
            refreshReports={() => {}}
            facilities={facilities}
            workerLocations={workerLocations}
            userPosition={userPosition}
            loggedInUserId={null}
            onVote={() => {}}
            votingStates={{}}
          />
        </div>
      </div>
    </RoleGuard>
  );
};

export default LiveAssetTrackerPage;
