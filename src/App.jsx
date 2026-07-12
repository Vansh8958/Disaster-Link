import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import SOSModal from './components/SOSModal';
import SafeModal from './components/SafeModal';
import DroneVideoFeed from './components/DroneVideoFeed';
import CommsTerminal from './components/CommsTerminal';
import InstructionsModal from './components/InstructionsModal';
import ResponderProfileModal from './components/ResponderProfileModal';
import OfflineGuideModal from './components/OfflineGuideModal';
import ContactsModal from './components/ContactsModal';
import VolunteerModal from './components/VolunteerModal';
import ReportHazardModal from './components/ReportHazardModal';
import DraggableFab from './components/DraggableFab';
import { MessageSquare, HelpCircle, PhoneCall, Crosshair, MapPin, Navigation } from 'lucide-react';

const generateMockData = (centerLat, centerLng) => {
  return [
    {
      id: 1001,
      type: 'NGO Center',
      description: 'Registered NGO Response Center / Shelter',
      address: `Coords: ${(centerLat + 0.03).toFixed(4)}, ${(centerLng - 0.02).toFixed(4)}`,
      lat: centerLat + 0.03,
      lng: centerLng - 0.02,
      status: 'Active',
      dataSource: 'ngo',
      timestamp: Date.now() - 5000000
    },
    {
      id: 1002,
      type: 'Medical Emergency',
      description: 'Automated distress signal detected.',
      address: `Coords: ${(centerLat - 0.01).toFixed(4)}, ${(centerLng + 0.04).toFixed(4)}`,
      lat: centerLat - 0.01,
      lng: centerLng + 0.04,
      status: 'Active',
      dataSource: 'crowd',
      timestamp: Date.now() - 1000000
    },
    {
      id: 1003,
      type: 'Trapped / Rescue Needed',
      description: 'Automated distress signal detected.',
      address: `Coords: ${(centerLat + 0.04).toFixed(4)}, ${(centerLng + 0.02).toFixed(4)}`,
      lat: centerLat + 0.04,
      lng: centerLng + 0.02,
      status: 'Active',
      dataSource: 'verified',
      timestamp: Date.now() - 200000
    }
  ];
};

function App() {
  const defaultCenter = [51.505, -0.09];
  const [incidents, setIncidents] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isSafeOpen, setIsSafeOpen] = useState(false);
  const [isCommsOpen, setIsCommsOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [droneScanActive, setDroneScanActive] = useState(false);
  const [meshNetworkActive, setMeshNetworkActive] = useState(false);
  const [heatmapActive, setHeatmapActive] = useState(false);
  const [heatmapZones, setHeatmapZones] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [filters, setFilters] = useState({ gov: true, ngo: true, verified: true, crowd: true });
  const [selectedResponder, setSelectedResponder] = useState(null);
  const [lang, setLang] = useState('EN');
  const [mapStyle, setMapStyle] = useState('dark');
  const [offlineGuide, setOfflineGuide] = useState(null);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('disaster_contacts');
    return saved ? JSON.parse(saved) : [];
  });
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [volunteerProfile, setVolunteerProfile] = useState(null);
  const [isHazardOpen, setIsHazardOpen] = useState(false);
  const [isRoutingActive, setIsRoutingActive] = useState(false);
  
  const [liveActivity, setLiveActivity] = useState([]);
  const [aiLogs, setAiLogs] = useState(["[AI] System Initialized.", "[AI] Triage Engine active."]);

  const [inventory, setInventory] = useState([
    { name: 'Water Rations', current: 450, total: 1000, color: '#3b82f6', type: 'water' },
    { name: 'Medical Kits', current: 120, total: 500, color: '#ef4444', type: 'medical' },
    { name: 'Thermal Blankets', current: 850, total: 1000, color: '#f59e0b', type: 'blankets' }
  ]);
  
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Dr. Sarah Jenkins', saves: 24, role: 'Medic' },
    { name: 'Rescue Squad Alpha', saves: 18, role: 'Fire/Rescue' },
    { name: 'John Doe (You)', saves: 5, role: 'Volunteer' },
    { name: 'Aviation Unit 3', saves: 12, role: 'Helicopter' }
  ]);

  const fetchUSGSData = async (lat, lng) => {
    try {
      const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
      const json = await res.json();
      const earthquakes = json.features
        .filter(f => f.properties.place && f.properties.place.toLowerCase().includes('india'))
        .map(f => ({
          id: f.id,
          type: `Earthquake Mag ${f.properties.mag.toFixed(1)}`,
          description: f.properties.title,
          address: 'USGS API Data',
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
          status: 'Active',
          dataSource: 'gov',
          timestamp: f.properties.time
        }));

      if (earthquakes.length === 0 && lat && lng) {
        // Fallback for demo purposes if no real earthquakes in India today
        earthquakes.push({
          id: 'mock-gov-1',
          type: 'GOV ALERT: Flash Flood Warning',
          description: 'IMD (Indian Meteorological Department) has issued a red alert for severe flash floods in this district.',
          address: 'Gov API Data',
          lat: lat + 0.02,
          lng: lng - 0.03,
          status: 'Active',
          dataSource: 'gov',
          timestamp: Date.now()
        });
      }
      return earthquakes;
    } catch (e) {
      console.error('USGS fetch failed', e);
      return [];
    }
  };

  const fetchWeather = async (lat, lng) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
      const json = await res.json();
      setWeatherData(json.current_weather);
    } catch (e) {
      console.error('Weather fetch failed', e);
    }
  };

  const fetchLiveLeaderboard = async () => {
    try {
      const res = await fetch('https://randomuser.me/api/?results=3&seed=rescue');
      const json = await res.json();
      const users = json.results.map((u, i) => ({
        id: u.login.uuid,
        name: `${u.name.first} ${u.name.last}`,
        saves: 24 - i * 6,
        role: i === 0 ? 'Medic' : i === 1 ? 'Fire/Rescue' : 'Logistics',
        picture: u.picture.thumbnail,
        largePicture: u.picture.large,
        location: `${u.location.city}, ${u.location.country}`
      }));
      setLeaderboard([
        ...users,
        { id: 'you', name: 'John Doe (You)', saves: 5, role: 'Volunteer', picture: null, location: 'Local Sector' }
      ]);
    } catch (e) {
      console.error('Leaderboard fetch failed', e);
    }
  };

  // Initialize with location and mock data
  useEffect(() => {
    fetchLiveLeaderboard();
    
    // Feature 1 & 2: Live Telemetry & AI Thoughts
    const activityInterval = setInterval(() => {
      setInventory(prev => prev.map(item => {
        if (Math.random() > 0.6) {
          const deduction = Math.floor(Math.random() * 4) + 1;
          const newCurrent = Math.max(0, item.current - deduction);
          
          if (newCurrent !== item.current) {
            setLiveActivity(acts => [{
              time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
              msg: `Unit ${Math.floor(Math.random()*9)+1} pulled ${deduction} ${item.name}`
            }, ...acts].slice(0, 4));
            
            if (Math.random() > 0.5) {
              setAiLogs(logs => [...logs.slice(-15), `[AI] Rerouting ${item.name} supply line to active sector...`]);
            }
          }
          return { ...item, current: newCurrent };
        }
        return item;
      }));

      if (Math.random() > 0.6) {
        const thoughts = [
          "[AI] Scanning USGS for anomalies...",
          "[AI] Optimizing mesh network routing...",
          "[AI] Analyzing satellite telemetry...",
          "[AI] Calculating predictive flood vectors...",
          "[AI] Prioritizing med-evac routes..."
        ];
        setAiLogs(logs => [...logs.slice(-15), thoughts[Math.floor(Math.random() * thoughts.length)]]);
      }
    }, 4500);

    const savedLoc = localStorage.getItem('disaster_manual_location');
    if (savedLoc) {
      try {
        const loc = JSON.parse(savedLoc);
        setUserLocation(loc);
        fetchWeather(loc[0], loc[1]);
        fetchUSGSData(loc[0], loc[1]).then(eqData => {
          setIncidents([...eqData, ...generateMockData(loc[0], loc[1])]);
        });
        setHeatmapZones([
          { lat: loc[0] + 0.02, lng: loc[1] + 0.03, radius: 4000, type: 'High Flood Risk' },
          { lat: loc[0] - 0.03, lng: loc[1] - 0.02, radius: 5500, type: 'Structural Collapse Warning' }
        ]);
      } catch (e) {
        refreshLocation();
      }
    } else {
      refreshLocation();
    }
    
    return () => clearInterval(activityInterval);
  }, []);

  useEffect(() => {
    localStorage.setItem('disaster_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleSetUserLocation = (loc) => {
    setUserLocation(loc);
    localStorage.setItem('disaster_manual_location', JSON.stringify(loc));
  };

  const refreshLocation = () => {
    localStorage.removeItem('disaster_manual_location');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        fetchWeather(latitude, longitude);
        const eqData = await fetchUSGSData(latitude, longitude);
        setIncidents([...eqData, ...generateMockData(latitude, longitude)]);
        
        setHeatmapZones([
          { lat: latitude + 0.02, lng: longitude + 0.03, radius: 4000, type: 'High Flood Risk' },
          { lat: latitude - 0.03, lng: longitude - 0.02, radius: 5500, type: 'Structural Collapse Warning' }
        ]);
      },
      async (error) => {
        console.error('Error getting location:', error);
        setUserLocation([51.505, -0.09]);
        fetchWeather(51.505, -0.09);
        const eqData = await fetchUSGSData(51.505, -0.09);
        setIncidents([...eqData, ...generateMockData(51.505, -0.09)]);
        
        setHeatmapZones([
          { lat: 51.52, lng: -0.06, radius: 4000, type: 'High Flood Risk' },
          { lat: 51.48, lng: -0.12, radius: 5500, type: 'Structural Collapse Warning' }
        ]);
      }
    );
  };

  const handleSOSSubmit = async (data) => {
    if (!userLocation) return;
    
    let realAddress = 'Fetching real location...';
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation[0]}&lon=${userLocation[1]}`);
      const json = await res.json();
      if (json && json.display_name) {
        realAddress = json.display_name;
      }
    } catch (e) {
      realAddress = `Coords: ${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}`;
    }

    const newIncident = {
      id: Date.now(), ...data,
      address: realAddress,
      lat: userLocation[0], lng: userLocation[1], timestamp: Date.now(), status: 'Active', dataSource: 'verified'
    };
    setIncidents([newIncident, ...incidents]);
  };

  const handleSafeSubmit = () => {
    if (!userLocation) return;
    const newIncident = {
      id: Date.now(), type: 'Safe', description: 'Automated broadcast to family contacts.',
      address: 'Current Location',
      lat: userLocation[0] + 0.001, lng: userLocation[1] + 0.001, timestamp: Date.now(), status: 'Active', dataSource: 'verified'
    };
    setIncidents([newIncident, ...incidents]);
  };

  const handleFindShelter = () => {
    const ngoCenters = incidents.filter(i => i.dataSource === 'ngo');
    if (ngoCenters.length > 0) {
      if (userLocation) {
        let closest = ngoCenters[0];
        let minDist = Infinity;
        ngoCenters.forEach(ngo => {
           const dist = Math.pow(ngo.lat - userLocation[0], 2) + Math.pow(ngo.lng - userLocation[1], 2);
           if (dist < minDist) { minDist = dist; closest = ngo; }
        });
        setSelectedIncident(closest);
      } else {
        setSelectedIncident(ngoCenters[0]);
      }
    }
  };

  const handleClaimIncident = (id, responderType) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return { ...inc, status: 'Claimed', responder: responderType };
      }
      return inc;
    }));
    
    const inc = incidents.find(i => i.id === id);
    if (inc) {
      const isOfficial = responderType === 'official';
      setAiLogs(prev => [...prev.slice(-9), `[DISPATCH] ${isOfficial ? 'Official Team' : 'Volunteer'} routed to ${inc.type}.`]);
      setLiveActivity(prev => [{ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), msg: `${isOfficial ? 'Official Team' : 'Volunteer'} dispatched.` }, ...prev.slice(0, 9)]);
      setActiveMission(inc);
      if (isOfficial) {
        setIsRightSidebarOpen(true);
      }
    }
  };

  const handleHazardSubmit = (hazardData) => {
    setIncidents(prev => [hazardData, ...prev]);
    setLiveActivity(prev => [{ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), msg: `User reported ${hazardData.type}` }, ...prev.slice(0, 9)]);
  };

  const toggleRouting = () => {
    setIsRoutingActive(!isRoutingActive);
    if (!isRoutingActive) {
      setLiveActivity(prev => [{ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), msg: `Evacuation route generated.` }, ...prev.slice(0, 9)]);
    }
  };

  const handleResolveMission = () => {
    if (!activeMission) return;
    
    // Deduct resources
    const updatedInventory = inventory.map(item => {
      if (activeMission.type.toLowerCase().includes('medical') && item.type === 'medical') {
        return { ...item, current: Math.max(0, item.current - 1) };
      }
      if (activeMission.type.toLowerCase().includes('food') && item.type === 'water') {
        return { ...item, current: Math.max(0, item.current - 5) };
      }
      return item;
    });
    setInventory(updatedInventory);

    // Update leaderboard (You)
    const updatedLeaderboard = leaderboard.map(p => {
      if (p.name.includes('(You)')) return { ...p, saves: p.saves + 1 };
      return p;
    });
    setLeaderboard(updatedLeaderboard);

    // Update incident
    const updatedIncidents = incidents.map(inc => 
      inc.id === activeMission.id ? { ...inc, status: 'Resolved', type: 'Safe' } : inc
    );
    setIncidents(updatedIncidents);
    setActiveMission(null);
  };

  const filteredIncidents = incidents.filter(inc => filters[inc.dataSource]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <MapComponent 
        incidents={filteredIncidents} 
        userLocation={userLocation} 
        setUserLocation={handleSetUserLocation}
        selectedIncident={selectedIncident} 
        activeMission={activeMission}
        droneScanActive={droneScanActive}
        meshNetworkActive={meshNetworkActive}
        heatmapActive={heatmapActive}
        heatmapZones={heatmapZones}
        mapStyle={mapStyle}
        onClaimIncident={handleClaimIncident}
        isRoutingActive={isRoutingActive}
      />
      
      <Sidebar 
        incidents={filteredIncidents.slice(0, 50)} 
        weatherData={weatherData}
        filters={filters}
        setFilters={setFilters}
        lang={lang}
        setLang={setLang}
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        onSOSClick={() => setIsSOSOpen(true)} 
        onSafeClick={() => setIsSafeOpen(true)}
        onIncidentClick={(incident) => setSelectedIncident(incident)}
        droneScanActive={droneScanActive}
        onToggleDrone={() => setDroneScanActive(!droneScanActive)}
        meshNetworkActive={meshNetworkActive}
        onToggleMesh={() => setMeshNetworkActive(!meshNetworkActive)}
        heatmapActive={heatmapActive}
        onToggleHeatmap={() => setHeatmapActive(!heatmapActive)}
        activeMission={activeMission}
        onResolveMission={handleResolveMission}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onFindShelter={handleFindShelter}
        onOpenGuide={(type) => setOfflineGuide(type)}
        onOpenContacts={() => setIsContactsOpen(true)}
      />
      
      <RightSidebar 
        inventory={inventory} 
        leaderboard={leaderboard} 
        onResponderClick={setSelectedResponder}
        liveActivity={liveActivity}
        aiLogs={aiLogs}
        onOpenVolunteer={() => setIsVolunteerOpen(true)}
        volunteerProfile={volunteerProfile}
      />
      
      {droneScanActive && (
        <DroneVideoFeed 
          location={activeMission} 
          onClose={() => setDroneScanActive(false)} 
        />
      )}

      {isCommsOpen && (
        <CommsTerminal 
          activeMission={activeMission} 
          onClose={() => setIsCommsOpen(false)} 
        />
      )}

      {!isCommsOpen && (
        <button 
          onClick={() => setIsCommsOpen(true)}
          className="pulsing"
          style={{
            position: 'absolute', bottom: '24px', left: '420px', zIndex: 1000,
            background: 'var(--card-bg)', color: '#3b82f6', border: '1px solid #3b82f6',
            borderRadius: '24px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer', fontWeight: 'bold', backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}
        >
          <MessageSquare size={20} /> {lang === 'ES' ? 'ABRIR COMMS' : lang === 'HI' ? 'संचार खोलें' : 'OPEN COMMS'}
        </button>
      )}

      <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 0, 0, 0.7)', padding: '12px 20px', borderRadius: '30px', border: '1px solid rgba(239, 68, 68, 0.4)', gap: '16px', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fca5a5' }}>
          EMERGENCY HELPLINE
        </div>
        <a href="tel:911" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ef4444', color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '24px', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)' }}>
          <PhoneCall size={16} /> CALL 911
        </a>
      </div>

      <DraggableFab
        onClick={refreshLocation}
        initialX={window.innerWidth - 420}
        initialY={window.innerHeight - 150}
        style={{
          background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white', borderRadius: '50%', backdropFilter: 'blur(10px)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          transition: 'background 0.2s, transform 0.2s'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = 'rgba(59, 130, 246, 0.6)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)'; }}
        title="Refresh Location"
      >
        <Crosshair size={24} />
      </DraggableFab>

      <DraggableFab
        onClick={() => setIsHazardOpen(true)}
        initialX={window.innerWidth - 420}
        initialY={window.innerHeight - 210}
        style={{
          background: 'rgba(245, 158, 11, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white', borderRadius: '50%', backdropFilter: 'blur(10px)', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.5)',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        title="Report Hazard"
      >
        <MapPin size={24} />
      </DraggableFab>

      <DraggableFab
        onClick={toggleRouting}
        initialX={window.innerWidth - 420}
        initialY={window.innerHeight - 270}
        style={{
          background: isRoutingActive ? 'rgba(16, 185, 129, 0.9)' : 'rgba(15, 23, 42, 0.8)', 
          border: `1px solid ${isRoutingActive ? '#10b981' : 'rgba(255, 255, 255, 0.2)'}`,
          color: 'white', borderRadius: '50%', backdropFilter: 'blur(10px)', boxShadow: isRoutingActive ? '0 4px 12px rgba(16, 185, 129, 0.5)' : '0 4px 12px rgba(0,0,0,0.5)',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        title="Find Safe Route"
      >
        <Navigation size={24} />
      </DraggableFab>

      <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} onSubmit={handleSOSSubmit} />
      <SafeModal isOpen={isSafeOpen} onClose={() => setIsSafeOpen(false)} onSubmit={handleSafeSubmit} />
      <InstructionsModal isOpen={isInstructionsOpen} onClose={() => setIsInstructionsOpen(false)} />
      <ResponderProfileModal isOpen={!!selectedResponder} onClose={() => setSelectedResponder(null)} responder={selectedResponder} />
      <OfflineGuideModal isOpen={!!offlineGuide} onClose={() => setOfflineGuide(null)} guideType={offlineGuide} />
      <ContactsModal isOpen={isContactsOpen} onClose={() => setIsContactsOpen(false)} contacts={contacts} setContacts={setContacts} />
      <VolunteerModal isOpen={isVolunteerOpen} onClose={() => setIsVolunteerOpen(false)} volunteerProfile={volunteerProfile} setVolunteerProfile={setVolunteerProfile} />
      <ReportHazardModal isOpen={isHazardOpen} onClose={() => setIsHazardOpen(false)} onSubmit={handleHazardSubmit} userLocation={userLocation || [51.505, -0.09]} />
    </div>
  );
}

export default App;
