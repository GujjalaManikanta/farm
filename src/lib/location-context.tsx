import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface GeoLocationState {
  latitude: number;
  longitude: number;
  accuracy: number;
  village: string;
  city: string;
  district: string;
  state: string;
  country: string;
  formattedAddress: string;
  soilMoisture: number;
  temperature: number;
  status: "idle" | "requesting" | "granted" | "denied" | "unavailable";
  errorMessage: string | null;
  mapEmbedUrl: string;
  osmLink: string;
}

export interface PresetLocation {
  name: string;
  nameTe: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
}

export const AP_TELANGANA_PRESETS: PresetLocation[] = [
  {
    name: "Srikakulam (Amudalavalasa)",
    nameTe: "శ్రీకాకుళం (ఆమదాలవలస)",
    district: "Srikakulam",
    state: "Andhra Pradesh",
    lat: 18.29,
    lon: 83.89,
  },
  {
    name: "Visakhapatnam (Anakapalle)",
    nameTe: "విశాఖపట్నం (అనకాపల్లి)",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    lat: 17.68,
    lon: 83.21,
  },
  {
    name: "Guntur (Tenali)",
    nameTe: "గుంటూరు (తెనాలి)",
    district: "Guntur",
    state: "Andhra Pradesh",
    lat: 16.3,
    lon: 80.43,
  },
  {
    name: "Vijayawada (Krishna)",
    nameTe: "విజయవాడ (కృష్ణా)",
    district: "Krishna",
    state: "Andhra Pradesh",
    lat: 16.5,
    lon: 80.64,
  },
  {
    name: "Kakinada (East Godavari)",
    nameTe: "కాకినాడ (తూర్పు గోదావరి)",
    district: "East Godavari",
    state: "Andhra Pradesh",
    lat: 16.98,
    lon: 82.24,
  },
  {
    name: "Eluru (West Godavari)",
    nameTe: "ఏలూరు (పశ్చిమ గోదావరి)",
    district: "West Godavari",
    state: "Andhra Pradesh",
    lat: 16.71,
    lon: 81.1,
  },
  {
    name: "Tirupati (Chittoor)",
    nameTe: "తిరుపతి (చిత్తూరు)",
    district: "Tirupati",
    state: "Andhra Pradesh",
    lat: 13.62,
    lon: 79.41,
  },
  {
    name: "Kurnool",
    nameTe: "కర్నూలు",
    district: "Kurnool",
    state: "Andhra Pradesh",
    lat: 15.82,
    lon: 78.03,
  },
  {
    name: "Nellore",
    nameTe: "నెల్లూరు",
    district: "Nellore",
    state: "Andhra Pradesh",
    lat: 14.44,
    lon: 79.98,
  },
  {
    name: "Anantapur",
    nameTe: "అనంతపురం",
    district: "Anantapur",
    state: "Andhra Pradesh",
    lat: 14.68,
    lon: 77.6,
  },
  {
    name: "Hyderabad",
    nameTe: "హైదరాబాద్",
    district: "Hyderabad",
    state: "Telangana",
    lat: 17.38,
    lon: 78.48,
  },
  {
    name: "Warangal",
    nameTe: "వరంగల్",
    district: "Warangal",
    state: "Telangana",
    lat: 17.96,
    lon: 79.59,
  },
];

interface LocationContextType extends GeoLocationState {
  requestLocation: () => Promise<void>;
  setManualLocation: (preset: PresetLocation) => void;
  showPermissionDialog: boolean;
  setShowPermissionDialog: (open: boolean) => void;
}

const defaultState: GeoLocationState = {
  latitude: 18.29,
  longitude: 83.89,
  accuracy: 15,
  village: "Amudalavalasa",
  city: "Srikakulam",
  district: "Srikakulam District",
  state: "Andhra Pradesh",
  country: "India",
  formattedAddress: "Amudalavalasa, Srikakulam District, Andhra Pradesh, India",
  soilMoisture: 65,
  temperature: 31,
  status: "idle",
  errorMessage: null,
  mapEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=83.85%2C18.25%2C83.95%2C18.35&layer=mapnik&marker=18.29%2C83.89",
  osmLink: "https://www.openstreetmap.org/?mlat=18.29&mlon=83.89#map=14/18.29/83.89",
};

const LocationContext = createContext<LocationContextType>({
  ...defaultState,
  requestLocation: async () => {},
  setManualLocation: () => {},
  showPermissionDialog: false,
  setShowPermissionDialog: () => {},
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [geo, setGeo] = useState<GeoLocationState>(defaultState);
  const [showPermissionDialog, setShowPermissionDialog] = useState<boolean>(false);

  // Reverse geocodes lat/lon via OpenStreetMap Nominatim
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en,te,hi",
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const village =
          addr.village ||
          addr.suburb ||
          addr.neighbourhood ||
          addr.hamlet ||
          addr.town ||
          "Farm Zone";
        const city = addr.city || addr.town || addr.county || "Srikakulam";
        const district = addr.state_district || addr.county || `${city} District`;
        const state = addr.state || "Andhra Pradesh";
        const country = addr.country || "India";
        const formatted = `${village}, ${district}, ${state}, ${country}`;

        return { village, city, district, state, country, formatted };
      }
    } catch {
      // Fallback
    }

    return {
      village: "Farm Field",
      city: "Srikakulam Zone",
      district: "Srikakulam",
      state: "Andhra Pradesh",
      country: "India",
      formatted: `GPS (${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E) • Andhra Pradesh`,
    };
  };

  // Direct Browser GPS Locator
  const requestLocation = useCallback(async () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeo((prev) => ({
        ...prev,
        status: "unavailable",
        errorMessage: "Geolocation is not supported by your browser.",
      }));
      toast.error("Geolocation is not supported by your device.");
      return;
    }

    setGeo((prev) => ({ ...prev, status: "requesting", errorMessage: null }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);

        // Calculate dynamic soil moisture from GPS coordinate hash
        const coordSeed = Math.abs(Math.sin(lat * 100 + lon * 50));
        const moisture = Math.round(58 + coordSeed * 18);
        const temp = Math.round(28 + (1 - coordSeed) * 6);

        const bboxOffset = 0.03;
        const bbox = `${(lon - bboxOffset).toFixed(4)}%2C${(lat - bboxOffset).toFixed(4)}%2C${(lon + bboxOffset).toFixed(4)}%2C${(lat + bboxOffset).toFixed(4)}`;
        const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(4)}%2C${lon.toFixed(4)}`;
        const osmLink = `https://www.openstreetmap.org/?mlat=${lat.toFixed(4)}&mlon=${lon.toFixed(4)}#map=15/${lat.toFixed(4)}/${lon.toFixed(4)}`;

        const addressData = await reverseGeocode(lat, lon);

        setGeo({
          latitude: lat,
          longitude: lon,
          accuracy,
          village: addressData.village,
          city: addressData.city,
          district: addressData.district,
          state: addressData.state,
          country: addressData.country,
          formattedAddress: addressData.formatted,
          soilMoisture: moisture,
          temperature: temp,
          status: "granted",
          errorMessage: null,
          mapEmbedUrl,
          osmLink,
        });

        setShowPermissionDialog(false);
        toast.success(`📍 లొకేషన్ గుర్తించబడింది: ${addressData.village}, ${addressData.district}`);
      },
      (err) => {
        console.warn("Location permission denied or unavailable:", err);
        setGeo((prev) => ({
          ...prev,
          status: "denied",
          errorMessage:
            "లొకేషన్ అనుమతి నిరాకరించబడింది. దయచేసి క్రింది లిస్ట్ నుండి మీ జిల్లాను ఎంచుకోండి.",
        }));
        setShowPermissionDialog(true);
        toast.error("Location permission denied. Please select your farm district below.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  // Manual preset selection
  const setManualLocation = useCallback((preset: PresetLocation) => {
    const lat = preset.lat;
    const lon = preset.lon;
    const coordSeed = Math.abs(Math.sin(lat * 100 + lon * 50));
    const moisture = Math.round(58 + coordSeed * 18);
    const temp = Math.round(28 + (1 - coordSeed) * 6);

    const bboxOffset = 0.03;
    const bbox = `${(lon - bboxOffset).toFixed(4)}%2C${(lat - bboxOffset).toFixed(4)}%2C${(lon + bboxOffset).toFixed(4)}%2C${(lat + bboxOffset).toFixed(4)}`;
    const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(4)}%2C${lon.toFixed(4)}`;
    const osmLink = `https://www.openstreetmap.org/?mlat=${lat.toFixed(4)}&mlon=${lon.toFixed(4)}#map=15/${lat.toFixed(4)}/${lon.toFixed(4)}`;

    const formatted = `${preset.name}, ${preset.district}, ${preset.state}, India`;

    setGeo({
      latitude: lat,
      longitude: lon,
      accuracy: 10,
      village: preset.name,
      city: preset.district,
      district: preset.district,
      state: preset.state,
      country: "India",
      formattedAddress: formatted,
      soilMoisture: moisture,
      temperature: temp,
      status: "granted",
      errorMessage: null,
      mapEmbedUrl,
      osmLink,
    });

    setShowPermissionDialog(false);
    toast.success(`📍 ప్రాంతం ఎంచుకోబడింది: ${preset.nameTe}`);
  }, []);

  // Automatic IP Geolocation & Initial Check
  useEffect(() => {
    // Try fast IP Geolocation on mount
    const fetchIpLocation = async () => {
      try {
        const res = await fetch("https://ipwho.is/");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.latitude && data.longitude) {
            const lat = data.latitude;
            const lon = data.longitude;
            const city = data.city || "Srikakulam";
            const region = data.region || "Andhra Pradesh";
            const country = data.country || "India";

            const coordSeed = Math.abs(Math.sin(lat * 100 + lon * 50));
            const moisture = Math.round(58 + coordSeed * 18);
            const temp = Math.round(28 + (1 - coordSeed) * 6);

            const bboxOffset = 0.03;
            const bbox = `${(lon - bboxOffset).toFixed(4)}%2C${(lat - bboxOffset).toFixed(4)}%2C${(lon + bboxOffset).toFixed(4)}%2C${(lat + bboxOffset).toFixed(4)}`;
            const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(4)}%2C${lon.toFixed(4)}`;
            const osmLink = `https://www.openstreetmap.org/?mlat=${lat.toFixed(4)}&mlon=${lon.toFixed(4)}#map=15/${lat.toFixed(4)}/${lon.toFixed(4)}`;

            setGeo((prev) => {
              if (prev.status === "granted") return prev;
              return {
                latitude: lat,
                longitude: lon,
                accuracy: 50,
                village: city,
                city: city,
                district: city,
                state: region,
                country: country,
                formattedAddress: `${city}, ${region}, ${country}`,
                soilMoisture: moisture,
                temperature: temp,
                status: "granted",
                errorMessage: null,
                mapEmbedUrl,
                osmLink,
              };
            });
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchIpLocation();
    requestLocation();
  }, [requestLocation]);

  return (
    <LocationContext.Provider
      value={{
        ...geo,
        requestLocation,
        setManualLocation,
        showPermissionDialog,
        setShowPermissionDialog,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
