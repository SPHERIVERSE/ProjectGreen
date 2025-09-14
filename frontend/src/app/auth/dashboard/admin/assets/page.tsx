'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import axios from '@/utils/axiosInstance';
import RoleGuard from '@/components/RoleGuard';
import {
  Button,
  Select,
  SelectItem,
  TextInput,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Icon,
} from '@tremor/react';
import { TrashIcon, PencilIcon, MapPinIcon } from '@heroicons/react/24/solid';

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const useMapEvents = dynamic(() => import('react-leaflet').then((mod) => mod.useMapEvents), { ssr: false });

interface PublicFacility {
  id: string;
  type: string;
  name: string;
  latitude: number;
  longitude: number;
}

// Utility to safely create Leaflet icons client-side
const getFacilityIcon = (type: string) => {
  if (typeof window === 'undefined') return null; // SSR guard
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const L = require('leaflet');

  let iconUrl = '/icons/bin-icon.png';
  switch (type) {
    case 'TOILET':
      iconUrl = '/icons/toilet-icon.png';
      break;
    case 'WASTE_FACILITY':
      iconUrl = '/icons/treatment-facility-icon.png';
      break;
    default:
      iconUrl = '/icons/bin-icon.png';
      break;
  }

  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const DraggableMarker = ({ position, setPosition, setForm, type }: any) => {
  const markerRef = useRef<any>(null);
  const icon = useMemo(() => getFacilityIcon(type), [type]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPosition = marker.getLatLng();
          setPosition([newPosition.lat, newPosition.lng]);
          setForm((prev: any) => ({
            ...prev,
            latitude: newPosition.lat,
            longitude: newPosition.lng,
          }));
        }
      },
    }),
    [setPosition, setForm]
  );

  if (!icon) return null; // Prevents SSR crash

  return (
    <Marker draggable eventHandlers={eventHandlers} position={position} ref={markerRef} icon={icon}>
      <Popup>Drag me or click on the map to change location!</Popup>
    </Marker>
  );
};

const ManageAssetsPage = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [facilities, setFacilities] = useState<PublicFacility[]>([]);
  const [form, setForm] = useState({
    id: null as string | null,
    name: '',
    type: 'BIN',
    latitude: 0,
    longitude: 0,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.209]);
  const [mapReloadKey, setMapReloadKey] = useState(0);
  const [showFacilities, setShowFacilities] = useState(true);

  const facilityIcons = useMemo(() => {
    return {
      BIN: getFacilityIcon('BIN'),
      TOILET: getFacilityIcon('TOILET'),
      WASTE_FACILITY: getFacilityIcon('WASTE_FACILITY'),
    };
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await axios.get('/maps/facilities');
      setFacilities(res.data);
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
    }
  };

  useEffect(() => {
    fetchFacilities();

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter([latitude, longitude]);
          setPosition([latitude, longitude]);
          setForm((prev) => ({ ...prev, latitude, longitude }));
          setMapReloadKey((prev) => prev + 1);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setMessage('❌ Geolocation failed. Using default location.');
          setMapCenter([28.6139, 77.209]);
          setPosition([28.6139, 77.209]);
          setForm((prev) => ({ ...prev, latitude: 28.6139, longitude: 77.209 }));
        }
      );
    }
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const parsedValue = parseFloat(value);

    setForm((prev) => {
      const newForm: any = { ...prev, [id]: value };

      if (id === 'latitude' || id === 'longitude') {
        if (!isNaN(parsedValue)) {
          newForm[id] = parsedValue;
          const newLat = id === 'latitude' ? parsedValue : prev.latitude;
          const newLng = id === 'longitude' ? parsedValue : prev.longitude;
          setPosition([newLat, newLng]);
        } else if (value.trim() === '') {
          newForm[id] = 0;
        } else {
          setMessage(`❌ ${id} must be a number.`);
        }
      }
      return newForm;
    });
  };

  const handleMapClick = useCallback((e: any) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);
    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng, id: null, name: '' }));
  }, []);

  const MapClickHandler = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMapEvents({ click: handleMapClick });
    return null;
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      type: 'BIN',
      latitude: mapCenter[0],
      longitude: mapCenter[1],
    });
    setPosition(mapCenter);
  };

  const handleEdit = (facility: PublicFacility) => {
    setForm({
      id: facility.id,
      name: facility.name,
      type: facility.type ?? 'BIN',
      latitude: facility.latitude,
      longitude: facility.longitude,
    });
    setMapCenter([facility.latitude, facility.longitude]);
    setPosition([facility.latitude, facility.longitude]);
    setMapReloadKey((prev) => prev + 1);
  };

  const handleShowOnMap = (facility: PublicFacility) => {
    setMapCenter([facility.latitude, facility.longitude]);
    setForm((prev) => ({
      ...prev,
      id: facility.id,
      name: facility.name,
      type: facility.type,
      latitude: facility.latitude,
      longitude: facility.longitude,
    }));
    setPosition(null);
    setMessage(`Showing ${facility.name} on the map.`);
    setShowFacilities(true);
    setMapReloadKey((prev) => prev + 1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      try {
        await axios.delete(`/maps/facilities/${id}`);
        setMessage('✅ Facility deleted successfully!');
        fetchFacilities();
      } catch (error) {
        setMessage('❌ Failed to delete facility. Please try again.');
      }
    }
  };

  const handleSubmit = async () => {
    const finalLat = parseFloat(form.latitude.toString());
    const finalLng = parseFloat(form.longitude.toString());

    if (!form.name || (!position && form.id === null)) {
      setMessage('❌ Please enter a name and select a location on the map.');
      return;
    }

    if (isNaN(finalLat) || isNaN(finalLng)) {
      setMessage('❌ Please enter valid numerical coordinates.');
      return;
    }

    setLoading(true);
    try {
      if (form.id) {
        await axios.patch(`/maps/facilities/${form.id}`, {
          name: form.name,
          type: form.type,
          latitude: Number(finalLat),
          longitude: Number(finalLng),
        });
        setMessage('✅ Facility updated successfully!');
      } else {
        await axios.post('/maps/facilities', {
          name: form.name,
          type: form.type,
          latitude: Number(finalLat),
          longitude: Number(finalLng),
        });
        setMessage('✅ Facility added successfully!');
      }
      resetForm();
      fetchFacilities();
    } catch (error) {
      setMessage('❌ Failed to save facility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard role="ADMIN">
      <div className="p-6 space-y-6 flex flex-col h-full bg-gray-950 text-white">
        <h1 className="text-3xl font-bold text-tremor-content-white">📍 Manage Public Facilities</h1>
        <p className="text-gray-400">
          Click on the map or drag the marker to place a new facility. You can also edit and delete existing ones.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Map Section */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-2xl h-[600px] lg:h-full">
            {typeof window !== 'undefined' && (
              <MapContainer
                key={mapReloadKey}
                center={mapCenter}
                zoom={10}
                scrollWheelZoom
                style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler />
                {form.id === null && position && (
                  <DraggableMarker
                    position={position}
                    setPosition={setPosition}
                    setForm={setForm}
                    type={form.type}
                  />
                )}
                {showFacilities &&
                  facilities.map((facility) => {
                    const icon = facilityIcons[facility.type as 'BIN' | 'TOILET' | 'WASTE_FACILITY'];
                    if (!icon) return null;
                    return (
                      <Marker
                        key={facility.id}
                        position={[facility.latitude, facility.longitude]}
                        icon={icon}
                      >
                        <Popup>
                          <strong>{facility.name}</strong>
                          <br />
                          Type: {facility.type}
                        </Popup>
                      </Marker>
                    );
                  })}
              </MapContainer>
            )}
          </div>

          {/* Form Section */}
          <div className="lg:col-span-1 bg-gray-900 p-6 rounded-xl shadow-2xl flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-tremor-content-white">
                {form.id ? 'Edit Facility' : 'Add New Facility'}
              </h2>
              {form.id && (
                <Button variant="secondary" onClick={resetForm}>
                  Add New
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Facility Name
              </label>
              <TextInput
                id="name"
                placeholder="e.g., Connaught Place Public Toilet"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-gray-300">
                Facility Type
              </label>
              <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                <SelectItem value="BIN">Bin</SelectItem>
                <SelectItem value="TOILET">Toilet</SelectItem>
                <SelectItem value="WASTE_FACILITY">Treatment Facility</SelectItem>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Coordinates</label>
              <div className="flex space-x-2">
                <TextInput
                  id="latitude"
                  placeholder="e.g., 28.6139"
                  value={form.latitude.toString()}
                  onChange={handleFormChange}
                  className="flex-1"
                />
                <TextInput
                  id="longitude"
                  placeholder="e.g., 77.2090"
                  value={form.longitude.toString()}
                  onChange={handleFormChange}
                  className="flex-1"
                />
              </div>
            </div>

            {message && (
              <div className="p-4 rounded-lg text-sm text-center bg-green-500/20 text-green-300">
                {message}
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                className="mt-4 flex-1"
                onClick={handleSubmit}
                loading={loading}
                disabled={!form.name || loading}
              >
                {form.id ? 'Update Facility' : 'Add Facility'}
              </Button>
              {form.id && (
                <Button className="mt-4 flex-1" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Facilities Table */}
        <div className="mt-8 bg-gray-900 p-6 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-tremor-content-white">Current Available Facilities</h2>
            <Button variant="secondary" onClick={() => setShowFacilities(!showFacilities)}>
              {showFacilities ? 'Hide Facilities' : 'Show Facilities'}
            </Button>
          </div>
          {facilities.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Latitude</TableHeaderCell>
                  <TableHeaderCell>Longitude</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {facilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell>{facility.name}</TableCell>
                    <TableCell>{facility.type}</TableCell>
                    <TableCell>{facility.latitude.toFixed(4)}</TableCell>
                    <TableCell>{facility.longitude.toFixed(4)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Icon
                          icon={MapPinIcon}
                          onClick={() => handleShowOnMap(facility)}
                          className="text-blue-400 hover:text-blue-300 cursor-pointer"
                        />
                        <Icon
                          icon={PencilIcon}
                          onClick={() => handleEdit(facility)}
                          className="text-gray-400 hover:text-white cursor-pointer"
                        />
                        <Icon
                          icon={TrashIcon}
                          onClick={() => handleDelete(facility.id)}
                          className="text-red-500 hover:text-red-400 cursor-pointer"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-400">No facilities available yet.</p>
          )}
        </div>
      </div>
    </RoleGuard>
  );
};

export default ManageAssetsPage;

