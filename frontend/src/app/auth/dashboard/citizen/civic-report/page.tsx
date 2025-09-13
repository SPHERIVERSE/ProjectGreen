'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import axios from '@/utils/axiosInstance';
import RoleGuard from '@/components/RoleGuard';
import 'leaflet/dist/leaflet.css';
import ReportCard from '@/components/ReportCard';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';

const Map = dynamic(() => import('@/components/CivicMap'), { ssr: false });

export interface CivicReport {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  supportCount: number;
  oppositionCount: number;
  status: 'pending' | 'escalated' | 'resolved';
  createdAt: string;
  createdById: string;
  createdBy?: { id: string; name: string; role: string };
  isOwnReport: boolean;
  userVote: 'support' | 'oppose' | null;
  hasVoted: boolean;
  canVote: boolean;
}

const CivicReportPage = () => {
  const [myReports, setMyReports] = useState<CivicReport[]>([]);
  const [otherReports, setOtherReports] = useState<CivicReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'MINE' | 'OTHERS'>('MINE');
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({});
  const [locationMessage, setLocationMessage] = useState<string>('Getting your location...');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // ✅ New state for photo preview
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken: { sub: string } = jwtDecode(token);
        setCurrentUserId(decodedToken.sub);
      } catch (error) {
        console.error('Failed to decode JWT:', error);
        setCurrentUserId(null);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationMessage('✅ Location acquired.');
        },
        (err) => {
          console.error('Geolocation error:', err);
          setLocationMessage('❌ Location access denied or unavailable. Using default location.');
          setPosition({ lat: 28.6139, lng: 77.2090 }); 
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationMessage('❌ Geolocation is not supported by your browser.');
      setPosition({ lat: 28.6139, lng: 77.2090 });
    }

    fetchReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const { data } = await axios.get('/civic-report/my-reports');
      setMyReports(data);
    } catch (err) {
      console.error('Failed to fetch my reports:', err);
      setMessage('Failed to fetch your reports');
    }
  };

  const fetchOtherReports = async () => {
    try {
      const { data } = await axios.get('/civic-report/other-reports');
      setOtherReports(data);
    } catch (err) {
      console.error('Failed to fetch other reports:', err);
      setMessage('Failed to fetch other reports');
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchMyReports(), fetchOtherReports()]);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (reportId: string, type: 'support' | 'oppose') => {
    const updatedReports = otherReports.map(report => {
      if (report.id === reportId) {
        const updatedReport = {
          ...report,
          hasVoted: true,
          userVote: type,
          canVote: false,
          supportCount: type === 'support' ? report.supportCount + 1 : report.supportCount,
          oppositionCount: type === 'oppose' ? report.oppositionCount + 1 : report.oppositionCount,
        };
        return updatedReport;
      }
      return report;
    });
    setOtherReports(updatedReports);
    
    try {
      await axios.post(`/civic-report/${reportId}/${type}`);
      setMessage(`✅ Successfully ${type}ed the report!`);
      setTimeout(() => setMessage(null), 3000);
      fetchOtherReports();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || `Failed to ${type} the report`;
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(null), 4000);
      fetchOtherReports();
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!position) {
      setMessage('❌ Location not available. Please allow location access to submit a report.');
      return;
    }
    
    formData.append('latitude', position.lat.toString());
    formData.append('longitude', position.lng.toString());
    
    try {
      await axios.post('/civic-report', formData);
      
      setMessage('✅ Report submitted successfully!');
      
      formRef.current?.reset();
      setPhotoPreview(null); // ✅ Reset the photo preview on successful submission
      
      await fetchMyReports();
      
      setTimeout(() => setMessage(null), 5000);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to submit report';
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleWithdrawReport = async (reportId: string) => {
    try {
      await axios.delete(`/civic-report/${reportId}`);
      setMessage('✅ Report withdrawn successfully!');
      setTimeout(async () => {
        await fetchMyReports();
        setMessage(null);
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to withdraw report';
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const renderReports = (reports: CivicReport[]) => {
    if (loading) return <p className="text-white text-center">Loading reports...</p>;
    if (reports.length === 0) return <p className="text-white text-center">No reports found.</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(report => (
          <ReportCard 
            key={report.id} 
            report={report} 
            handleVote={handleVote} 
            votingStates={votingStates}
            onWithdraw={activeTab === 'MINE' ? handleWithdrawReport : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <RoleGuard role="CITIZEN">
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">🏛️ Civic Reporting</h1>
        
        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('✅') ? 'bg-green-600' : 'bg-red-600'
          } text-white`}>
            {message}
          </div>
        )}

        <div className="bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4">📍 Submit a Report</h2>
          <div className="mb-4">
            <p className={`text-sm font-medium ${
              locationMessage.startsWith('✅') ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {locationMessage}
            </p>
            {position && (
              <div className="mt-2 text-sm text-gray-400 space-y-1">
                <p>Latitude: <span className="font-mono text-green-300">{position.lat.toFixed(6)}</span></p>
                <p>Longitude: <span className="font-mono text-green-300">{position.lng.toFixed(6)}</span></p>
              </div>
            )}
          </div>
          <form ref={formRef} onSubmit={handleSubmitReport} className="space-y-4">
            <input 
              type="text" 
              name="title" 
              placeholder="Report Title" 
              required 
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-green-500" 
            />
            <textarea 
              name="description" 
              placeholder="Describe the issue..." 
              required 
              rows={3}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-green-500" 
            />
            <select 
              name="type" 
              required 
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-green-500"
            >
              <option value="">Select Issue Type</option>
              <option value="illegal_dumping">Illegal Dumping</option>
              <option value="open_toilet">Open Toilet</option>
              <option value="dirty_toilet">Dirty Toilet</option>
              <option value="overflow_dustbin">Overflowing Dustbin</option>
              <option value="dead_animal">Dead Animal</option>
              <option value="fowl">Foul Smell</option>
              <option value="public_bin_request">Request for Public Bin</option>
              <option value="public_toilet_request">Request for Public Toilet</option>
            </select>
            {/* ✅ Conditionally render the image preview */}
            {photoPreview && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image 
                  src={photoPreview} 
                  alt="Selected photo preview" 
                  layout="fill" 
                  objectFit="cover" 
                />
              </div>
            )}
            <input 
              type="file" 
              name="photo" 
              accept="image/*" 
              onChange={handlePhotoChange} // ✅ Add the onChange handler
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
            />
            <button 
              type="submit" 
              disabled={!position}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white py-3 px-6 rounded font-semibold transition-colors"
            >
              🚀 Submit Report
            </button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-lg shadow">
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'MINE' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab('MINE')}
            >
              📝 My Reports ({myReports.length})
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'OTHERS' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab('OTHERS')}
            >
              🌍 Other Reports ({otherReports.length})
            </button>
          </div>

          {activeTab === 'OTHERS' && (
            <div className="p-4 border-b border-gray-700">
              <div className="flex justify-center space-x-2">
                <button
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    viewMode === 'LIST' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                  onClick={() => setViewMode('LIST')}
                >
                  📋 List View
                </button>
                <button
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    viewMode === 'MAP' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                  onClick={() => setViewMode('MAP')}
                >
                  🗺️ Map View
                </button>
              </div>
            </div>
          )}

          <div className="p-6">
            {activeTab === 'MINE' ? (
              renderReports(myReports)
            ) : viewMode === 'LIST' ? (
              renderReports(otherReports)
            ) : (
              <div className="h-[600px] w-full rounded-lg overflow-hidden">
                <Map
                  reports={otherReports}
                  refreshReports={fetchOtherReports}
                  userPosition={position}
                  loggedInUserId={currentUserId}
                  onVote={handleVote}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default CivicReportPage;
