import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios, { isAxiosError } from "axios";

// Helper to fix marker icon issue
import "leaflet-defaulticon-compatibility";
import { toast } from "react-toastify";

// Reverse Geocoding Function (using Nominatim)
const fetchPlaceName = async (lat: number, lng: number) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    return response.data.display_name;
  } catch (error) {
    console.error("Error fetching location name: ", error);
    if (isAxiosError(error)) {
      toast.error("Error fetching location name: " + error.message);
    } else {
      toast.error("An unexpected error occurred.");
    }
    return "Unknown location";
  }
};

const MapClickHandler = ({
  onMapClick,
}: {
  onMapClick: (latlng: { lat: number; lng: number }) => Promise<void>;
}) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

interface LeafletMapDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectLocation: (location: {
    lat: number;
    lng: number;
    name: string;
  }) => void;
}

const LeafletMapDialog: React.FC<LeafletMapDialogProps> = ({
  open,
  onClose,
  onSelectLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationName, setLocationName] = useState<string>(""); // Store human-readable location
  const [defaultLocation, setDefaultLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 30.0444,
    lng: 31.2357, // Default to Cairo
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(navigator.geolocation)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setDefaultLocation({ lat, lng });
          setSelectedLocation({ lat, lng });
        },
        (error: GeolocationPositionError) => {
          toast.warning("Location access denied. Please enable location permissions in browser settings.");
        }
      );
    }
  }, []);

  const handleMapClick = async (latlng: { lat: number; lng: number }) => {
    setLoading(true);

    setSelectedLocation(latlng);
    
    // Reverse geocode to get the place name
    const placeName = await fetchPlaceName(latlng.lat, latlng.lng);
    setLocationName(placeName);

    setLoading(false);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation({
        name: locationName,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });
      onClose();
    }
  };

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Location from Map</DialogTitle>
      <DialogContent>
        <MapContainer
          center={selectedLocation || defaultLocation}
          zoom={10}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {selectedLocation && (
            <Marker position={selectedLocation} icon={markerIcon} />
          )}
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>
        {/* Display the name of the selected location */}
        {locationName && (
          <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
            Selected Location: {locationName}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary" disabled={loading}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeafletMapDialog;
