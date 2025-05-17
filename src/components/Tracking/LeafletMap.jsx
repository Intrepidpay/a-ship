import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';

const defaultIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapContent = ({ locations, progress }) => {
  const map = useMap();
  const polylineRef = useRef();

  useEffect(() => {
    if (locations.length > 0) {
      // Find the current location marked in history
      const currentLocation = locations.find(loc => loc.isCurrentLocation) || 
                           locations[locations.length - 1];
      
      if (currentLocation?.coordinates) {
        map.flyTo(currentLocation.coordinates, 10, {
          duration: 1,
          padding: [50, 50]
        });
      }

      // Update polyline
      if (polylineRef.current) {
        const trail = locations
          .slice(0, Math.floor((progress / 100) * locations.length))
          .map(loc => loc.coordinates);
        polylineRef.current.setLatLngs(trail);
      }
    }
  }, [map, locations, progress]);

  return locations.length > 0 ? (
    <>
      <Polyline 
        ref={polylineRef}
        positions={locations
          .slice(0, Math.floor((progress / 100) * locations.length))
          .map(loc => loc.coordinates)}
        color="#3B82F6"
        weight={4}
        opacity={0.7}
      />
    </>
  ) : null;
};

const LeafletMap = ({ locations = [], progress = 0 }) => {
  return (
    <div className="premium-map-container">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={2}
        scrollWheelZoom={true}
        zoomControl={false}
        className="premium-map"
        maxZoom={11}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {locations.map((location, index) => (
          <Marker 
            key={index} 
            position={location.coordinates}
            icon={defaultIcon}
          >
            <Popup className="premium-popup">
              <div className="popup-content">
                <h4>{location.location.split(',')[0]}</h4>
                <div className="popup-status">{location.status}</div>
                <div className="popup-date">
                  {new Date(location.timestamp).toLocaleString()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapContent locations={locations} progress={progress} />
      </MapContainer>

      <div className="map-progress-container">
        <div className="map-progress-track">
          <div 
            className="map-progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="map-progress-text">
          Shipment Progress: <strong>{progress}%</strong>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;