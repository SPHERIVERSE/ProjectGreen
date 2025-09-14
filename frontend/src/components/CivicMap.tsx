'use client';

import React, { useEffect, useState } from 'react';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReportCard from './ReportCard';
import { CivicReport } from '@/app/auth/dashboard/citizen/civic-report/page';
import axios from '@/utils/axiosInstance';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';

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

interface CivicMapProps {
  reports: CivicReport[];
  refreshReports: () => void;
  userPosition?: { lat: number; lng: number } | null;
  facilities?: PublicFacility[];
  workerLocations?: WasteWorkerLocation[];
  loggedInUserId: string | null;
  onVote: (reportId: string, type: 'support' | 'oppose') => Promise<void>;
  votingStates: Record<string, boolean>;
}

// Helper to create a custom Leaflet div icon from an SVG string
const createDivIcon = (pinColor: string, innerIconPath: string) => {
  const iconHtml = `
    <div class="relative w-[30px] h-[40px]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-full h-full text-${pinColor}-500 stroke-current stroke-2" fill="currentColor">
        <path d="M215.7 499.2C267.8 409.6 384 290.7 384 192C384 86 298 0 192 0S0 86 0 192c0 98.7 116.2 217.6 168.3 307.2c12.3 22.2 28.5 22.2 40.8 0z"/>
      </svg>
      <div class="absolute inset-0 flex justify-center items-center text-white text-lg font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-2/5 h-2/5 text-white" fill="currentColor">
          <path d="${innerIconPath}"/>
        </svg>
      </div>
    </div>
  `;
  return L.divIcon({
    html: iconHtml,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
    className: 'leaflet-div-icon',
  });
};

// Function to get the correct icon based on facility type
const getFacilityIcon = (type: string) => {
  let iconUrl;
  switch (type) {
    case 'BIN':
      iconUrl = '/icons/bin-icon.png';
      break;
    case 'TOILET':
      iconUrl = '/icons/toilet-icon.png';
      break;
    case 'WASTE_FACILITY':
      iconUrl = '/icons/treatment-facility-icon.png';
      break;
    default:
      iconUrl = '/icons/bin-icon.png'; // Default to bin icon
  }
  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Custom icon for a report (red exclamation mark)
const reportIcon = createDivIcon('red', 'M256 32c142.4 0 256 114.6 256 256S398.4 544 256 544 0 429.4 0 288 114.6 32 256 32zm-16 144v144h32V176h-32zm0 192v32h32v-32h-32z');

// Other icons
const workerIcon = L.icon({
  iconUrl: '/icons/car-icon.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const userIcon = L.icon({
  iconUrl: '/icons/current-location.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const CivicMap = ({
  facilities,
  workerLocations,
  userPosition,
  reports,
  refreshReports,
  loggedInUserId,
  onVote,
  votingStates,
}: CivicMapProps) => {
  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (userPosition) {
        map.flyTo([userPosition.lat, userPosition.lng], map.getZoom());
      }
    }, [userPosition, map]);
    return null;
  };

  return (
    <MapContainer
      center={userPosition ? [userPosition.lat, userPosition.lng] : [28.6139, 77.2090]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater />

      {userPosition && (
        <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <strong>📍 Your Current Location</strong>
            </div>
          </Popup>
        </Marker>
      )}

      {facilities && facilities.map((facility) => (
        <Marker
          key={facility.id}
          position={[facility.latitude, facility.longitude]}
          icon={getFacilityIcon(facility.type)} // Use the new function to get the correct icon
        >
          <Popup>
            <strong>{facility.name}</strong>
            <br />
            Type: {facility.type}
          </Popup>
        </Marker>
      ))}

      {workerLocations && workerLocations.map((worker) => (
        <Marker
          key={worker.id}
          position={[worker.latitude, worker.longitude]}
          icon={workerIcon}
        >
          <Popup>Waste Pickup Vehicle</Popup>
        </Marker>
      ))}

      {reports.map(report => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={reportIcon}
        >
          <Popup maxWidth={300} minWidth={250}>
            <ReportCard
              report={report}
              handleVote={onVote}
              votingStates={votingStates}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CivicMap;
