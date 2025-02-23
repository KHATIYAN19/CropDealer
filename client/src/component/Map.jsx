"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [30, 50],
  iconAnchor: [15, 50],
});

const Map = ({ address }) => {
  const [location, setLocation] = useState({
    name: address,
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (!address) return;

    // Free Geocoding API to get latitude & longitude
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setLocation({
            name: address,
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          });
        }
      })
      .catch((error) => console.error("Error fetching location:", error));
  }, [address]);

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl w-full">
      <h2 className="text-xl font-semibold mb-2">📍 Location Details</h2>
      <p className="text-gray-700">
        <strong>{location.name}</strong>
      </p>

      {location.latitude && location.longitude ? (
        <div className="w-full h-96 mt-4 rounded-xl overflow-hidden">
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={16}
            className="w-full h-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.latitude, location.longitude]} icon={customIcon}>
              <Popup>{location.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <p className="text-red-500 mt-4">Fetching location...</p>
      )}
    </div>
  );
};

export default Map;
