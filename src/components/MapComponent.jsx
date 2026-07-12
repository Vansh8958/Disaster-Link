import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, Polyline, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Default Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const sosIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const safeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const govIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const progressIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const radarIcon = new L.divIcon({
  className: 'radar-sweep',
  iconSize: [400, 400],
  iconAnchor: [200, 200]
});

const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'cluster-marker',
    iconSize: L.point(40, 40, true),
  });
};

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if(center) map.setView(center, 13);
  }, [center, map]);
  return null;
}

const FlyToIncident = ({ incident }) => {
  const map = useMap();
  useEffect(() => {
    if (incident) {
      map.flyTo([incident.lat, incident.lng], 17, { duration: 1.5 });
    }
  }, [incident, map]);
  return null;
}

const MapComponent = ({ incidents, userLocation, selectedIncident, activeMission, droneScanActive, meshNetworkActive, heatmapActive, heatmapZones, onClaimIncident, mapStyle }) => {
  const defaultCenter = [51.505, -0.09];
  
  const getIcon = (incident) => {
    if (incident.dataSource === 'gov') return govIcon;
    if (incident.dataSource === 'ngo' || incident.type === 'Safe') return safeIcon;
    if (incident.status === 'In Progress') return progressIcon;
    return sosIcon;
  };
  
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <MapContainer center={userLocation || defaultCenter} zoom={12} zoomControl={false} preferCanvas={true}>
        
        <TileLayer
          attribution='&copy; OpenStreetMap & CartoDB'
          url={mapStyle === 'dark' ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png" : "http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"}
          maxZoom={20}
        />

        {userLocation && <ChangeView center={userLocation} />}
        <FlyToIncident incident={selectedIncident} />

        {(() => {
          if (!activeMission || !userLocation) return null;
          
          let startPoint = userLocation;
          if (activeMission.responder === 'official') {
            const ngoBase = incidents.find(inc => inc.dataSource === 'ngo' || inc.type === 'NGO Center');
            if (ngoBase) {
              startPoint = [ngoBase.lat, ngoBase.lng];
            } else {
              startPoint = [userLocation[0] - 0.05, userLocation[1] + 0.05];
            }
          }

          return (
            <Polyline 
              positions={[startPoint, [activeMission.lat, activeMission.lng]]} 
              color={activeMission.responder === 'official' ? '#ef4444' : '#3b82f6'} 
              weight={4} 
              dashArray="10, 10" 
            />
          );
        })()}

        {droneScanActive && userLocation && (
          <Marker position={userLocation} icon={radarIcon} interactive={false} />
        )}

        {heatmapActive && heatmapZones && heatmapZones.map((zone, idx) => (
          <Circle 
            key={`heat-${idx}`}
            center={[zone.lat, zone.lng]}
            radius={zone.radius}
            pathOptions={{ color: 'red', fillColor: '#ef4444', fillOpacity: 0.4, weight: 0 }}
          >
            <Popup><strong>{zone.type}</strong><br/>AI Predicted Risk Zone</Popup>
          </Circle>
        ))}

        {meshNetworkActive && userLocation && incidents.slice(0, 30).map((inc, idx) => (
          <Polyline
            key={`mesh-${idx}`}
            positions={[userLocation, [inc.lat, inc.lng]]}
            color="rgba(147, 197, 253, 0.4)"
            weight={1}
            dashArray="4, 4"
          />
        ))}

        <MarkerClusterGroup 
          chunkedLoading 
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={60}
        >
          {incidents.map((incident) => (
            <Marker 
              key={incident.id} 
              position={[incident.lat, incident.lng]}
              icon={getIcon(incident)}
            >
              <Popup>
                <div style={{ padding: '4px', minWidth: '150px' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{incident.type}</strong>
                  <div style={{ margin: '8px 0', fontSize: '0.9rem', color: '#555' }}>📍 {incident.address}</div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem' }}>{incident.description}</p>
                  {incident.status === 'Active' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button 
                        onClick={() => onClaimIncident && onClaimIncident(incident.id, 'volunteer')}
                        style={{ width: '100%', padding: '6px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                      >I Can Help (Volunteer)</button>
                      <button 
                        onClick={() => onClaimIncident && onClaimIncident(incident.id, 'official')}
                        style={{ width: '100%', padding: '6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                      >Dispatch Official Team</button>
                    </div>
                  ) : (
                    <div style={{ padding: '6px', background: incident.status === 'Resolved' ? '#10b981' : '#f59e0b', color: 'white', borderRadius: '4px', fontWeight: 600 }}>
                      {incident.status === 'Resolved' ? 'Resolved' : `En Route (${incident.responder === 'official' ? 'Official Team' : 'Volunteer'})`}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
