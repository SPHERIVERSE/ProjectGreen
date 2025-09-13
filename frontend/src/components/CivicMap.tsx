'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReportCard from './ReportCard'; // ✅ Import the new component
import { CivicReport } from '@/app/auth/dashboard/citizen/civic-report/page'; // ✅ Import the type

interface CivicMapProps {
  reports: CivicReport[];
  refreshReports: () => void;
  userPosition?: { lat: number; lng: number } | null;
  loggedInUserId: string | null;
  onVote: (reportId: string, type: 'support' | 'oppose') => Promise<void>;
}

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

const CivicMap: React.FC<CivicMapProps> = ({
  reports,
  userPosition,
  onVote,
}) => {
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({});

  const handleVote = async (reportId: string, type: 'support' | 'oppose') => {
    setVotingStates(prev => ({ ...prev, [reportId]: true }));
    try {
      await onVote(reportId, type);
    } finally {
      setVotingStates(prev => ({ ...prev, [reportId]: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    const color = status === 'resolved' ? 'green' : status === 'escalated' ? 'red' : 'orange';
    return L.icon({
      iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
      iconSize: [30, 50],
      iconAnchor: [15, 50],
      popupAnchor: [0, -45],
    });
  };

  const userIcon = L.icon({
    iconUrl: 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=U|blue',
    iconSize: [30, 50],
    iconAnchor: [15, 50],
    popupAnchor: [0, -45],
  });

  if (typeof window === 'undefined') return null;

  return (
    <MapContainer
      center={userPosition ? [userPosition.lat, userPosition.lng] : [20.5937, 78.9629]}
      zoom={userPosition ? 13 : 5}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {userPosition && (
        <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <strong>📍 Your Location</strong>
            </div>
          </Popup>
        </Marker>
      )}

      {reports.map(report => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={getStatusIcon(report.status)}
        >
          <Popup maxWidth={300} minWidth={250}>
            <ReportCard 
              report={report} 
              handleVote={handleVote} 
              votingStates={votingStates} 
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CivicMap;
