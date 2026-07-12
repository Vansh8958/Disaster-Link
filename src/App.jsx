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
import { MessageSquare, HelpCircle } from 'lucide-react';

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

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        fetchWeather(latitude, longitude);
        const eqData = await fetchUSGSData(latitude, longitude);
        setIncidents([...eqData, ...generateMockData(latitude, longitude)]);
        
        // Generate predictive risk zones around user
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
    
    return () => clearInterval(activityInterval);
  }, []);

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

  const handleClaimIncident = (id, responderType = 'volunteer') => {
    const updatedIncidents = incidents.map(inc => 
      inc.id === id ? { ...inc, status: 'In Progress', responder: responderType } : inc
    );
    setIncidents(updatedIncidents);
    const claimed = updatedIncidents.find(inc => inc.id === id);
    setActiveMission(claimed);
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
        selectedIncident={selectedIncident} 
        activeMission={activeMission}
        droneScanActive={droneScanActive}
        meshNetworkActive={meshNetworkActive}
        heatmapActive={heatmapActive}
        heatmapZones={heatmapZones}
        mapStyle={mapStyle}
        onClaimIncident={handleClaimIncident}
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
      />
      
      <RightSidebar 
        inventory={inventory} 
        leaderboard={leaderboard} 
        onResponderClick={(responder) => setSelectedResponder(responder)}
        liveActivity={liveActivity}
        aiLogs={aiLogs}
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

      <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} onSubmit={handleSOSSubmit} />
      <SafeModal isOpen={isSafeOpen} onClose={() => setIsSafeOpen(false)} onSubmit={handleSafeSubmit} />
      <InstructionsModal isOpen={isInstructionsOpen} onClose={() => setIsInstructionsOpen(false)} />
      <ResponderProfileModal isOpen={!!selectedResponder} onClose={() => setSelectedResponder(null)} responder={selectedResponder} />
    </div>
  );
}

export default App;
