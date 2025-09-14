'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReportCard from './ReportCard';
import { CivicReport } from '@/app/auth/dashboard/citizen/civic-report/page';

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

  // Helper to create a custom Leaflet div icon from an SVG string
  const createDivIcon = (pinColor: string, innerIconPath: string) => {
    const iconHtml = `
      <div class="relative w-[30px] h-[40px]">
        <!-- Location Pin Background SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="fill:${pinColor}; position:absolute; top:0; left:0;">
          <path d="M172.268 501.67C26.974 291.031 0 269.41 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.41-26.974 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
        </svg>
        <!-- Inner Icon SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="fill:#ffffff; position:absolute; top:35%; left:50%; transform:translate(-50%, -50%); width:40%; height:40%;">
          ${innerIconPath}
        </svg>
      </div>
    `;

    return L.divIcon({
      className: '', // No default styling applied to this class
      html: iconHtml,
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });
  };

  const getStatusIcon = (status: string) => {
    // Path for the exclamation mark icon
    const exclamationPath = '<path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM248 408c-13.3 0-24-10.7-24-24V264c0-13.3 10.7-24 24-24s24 10.7 24 24v120c0 13.3-10.7 24-24 24zM248 176c-13.2 0-24 10.8-24 24v24c0 13.2 10.8 24 24 24s24-10.8 24-24v-24c0-13.2-10.8-24-24-24z"/>';
    
    // Path for the checkmark icon
    const checkmarkPath = '<path d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM227.3 351.5c-4.7 4.7-12.3 4.7-17 0L87.1 234.3c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.7-4.7 12.3-4.7 17 0L234.3 322.4l138.1-138.1c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L244.3 351.5z"/>';
    
    switch (status) {
      case 'resolved':
        return createDivIcon('#16a34a', checkmarkPath); // Green pin with white checkmark
      case 'escalated':
      case 'pending':
      default:
        return createDivIcon('#dc2626', exclamationPath); // Red pin with white exclamation mark
    }
  };
  
  // Path for a simple user icon inside a blue pin
  const userPath = '<path d="M256 256c-48.4 0-88-39.6-88-88s39.6-88 88-88s88 39.6 88 88s-39.6 88-88 88zm0 32c56.8 0 104 46.2 104 104v16c0 13.2-10.8 24-24 24H176c-13.2 0-24-10.8-24-24v-16c0-57.8 47.2-104 104-104z"/>';
  const userIcon = createDivIcon('#3b82f6', userPath); // Blue pin with a white user icon

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

