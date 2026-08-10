import { useState } from 'react';
import { MapPin, Loader, AlertCircle } from 'lucide-react';
import { useDjassa } from '../contexts/DjassaContext';

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
}

interface LocationPickerProps {
  onLocationSelected: (location: LocationData) => void;
  initialLocation?: LocationData;
}

// Liste des pays cibles Djassa
const WEST_AFRICAN_COUNTRIES = [
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221' },
  { code: 'ML', name: 'Mali', dialCode: '+223' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226' },
  { code: 'GN', name: 'Guinée', dialCode: '+224' },
  { code: 'TG', name: 'Togo', dialCode: '+228' },
  { code: 'BJ', name: 'Bénin', dialCode: '+229' },
  { code: 'NE', name: 'Niger', dialCode: '+227' },
  { code: 'GH', name: 'Ghana', dialCode: '+233' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234' },
];

// Villes principales par pays
const MAJOR_CITIES: Record<string, string[]> = {
  CI: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro', 'Korhogo'],
  SN: ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor'],
  ML: ['Bamako', 'Sikasso', 'Mopti', 'Ségou', 'Kayes'],
  BF: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora', 'Ouahigouya'],
  GN: ['Conakry', 'Kindia', 'Kankan', 'Labé', 'Nzérékoré'],
  TG: ['Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Kpalimé'],
  BJ: ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey', 'Natitingou'],
  NE: ['Niamey', 'Zinder', 'Maradi', 'Agadez', 'Tahoua'],
  GH: ['Accra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi', 'Cape Coast'],
  NG: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt'],
};

export function LocationPicker({ onLocationSelected, initialLocation }: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState(initialLocation?.country || 'CI');
  const [selectedCity, setSelectedCity] = useState(initialLocation?.city || '');
  const [customAddress, setCustomAddress] = useState(initialLocation?.address || '');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    initialLocation?.lat && initialLocation?.lng 
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : null
  );
  
  const { getUserLocation } = useDjassa();

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    setError('');

    try {
      const location = await getUserLocation();
      setCoordinates({ lat: location.lat, lng: location.lng });
      
      if (location.address) {
        setCustomAddress(location.address);
      }

      // Tenter de détecter le pays depuis l'adresse
      const addressLower = location.address?.toLowerCase() || '';
      const detectedCountry = WEST_AFRICAN_COUNTRIES.find(c => 
        addressLower.includes(c.name.toLowerCase())
      );
      
      if (detectedCountry) {
        setSelectedCountry(detectedCountry.code);
      }

      onLocationSelected({
        lat: location.lat,
        lng: location.lng,
        address: location.address || customAddress,
        city: selectedCity,
        country: detectedCountry?.code || selectedCountry
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de géolocalisation');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedCity(''); // Reset ville quand pays change
    
    onLocationSelected({
      lat: coordinates?.lat || 0,
      lng: coordinates?.lng || 0,
      address: customAddress,
      city: '',
      country: countryCode
    });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    
    onLocationSelected({
      lat: coordinates?.lat || 0,
      lng: coordinates?.lng || 0,
      address: customAddress,
      city,
      country: selectedCountry
    });
  };

  const handleAddressChange = (address: string) => {
    setCustomAddress(address);
    
    onLocationSelected({
      lat: coordinates?.lat || 0,
      lng: coordinates?.lng || 0,
      address,
      city: selectedCity,
      country: selectedCountry
    });
  };

  const cities = MAJOR_CITIES[selectedCountry] || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={20} style={{ color: 'var(--clay)' }} />
        <h3 className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
          Localisation de l'annonce
        </h3>
      </div>

      {/* Bouton géolocalisation */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={loading}
        className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
        style={{ 
          backgroundColor: loading ? 'var(--paper-deep)' : 'var(--moss)',
          color: 'var(--white)'
        }}
      >
        {loading ? (
          <>
            <Loader className="animate-spin" size={18} />
            <span>Géolocalisation en cours...</span>
          </>
        ) : (
          <>
            <MapPin size={18} />
            <span>Utiliser ma position actuelle</span>
          </>
        )}
      </button>

      {/* Message d'erreur */}
      {error && (
        <div
          className="p-3 rounded-lg flex items-start gap-2 text-sm"
          style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
        >
          <AlertCircle size={16} className="mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Sélecteur manuel */}
      <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--line)' }}>
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          Ou renseignez manuellement :
        </p>

        {/* Pays */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ink)' }}>
            Pays *
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full p-3 rounded-lg border appearance-none bg-white"
            style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            required
          >
            {WEST_AFRICAN_COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ville */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ink)' }}>
            Ville *
          </label>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full p-3 rounded-lg border appearance-none bg-white"
            style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            required
          >
            <option value="">Sélectionnez une ville</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Adresse détaillée */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ink)' }}>
            Quartier / Adresse (optionnel)
          </label>
          <input
            type="text"
            value={customAddress}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Ex: Cocody, Plateau, Marcory..."
            className="w-full p-3 rounded-lg border bg-white"
            style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
          />
        </div>
      </div>

      {/* Résumé */}
      {(selectedCity || customAddress || coordinates) && (
        <div
          className="p-4 rounded-lg mt-4"
          style={{ backgroundColor: 'var(--paper-deep)' }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--ink)' }}>
            📍 Localisation actuelle :
          </p>
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            {selectedCity && <span>{selectedCity}, </span>}
            {WEST_AFRICAN_COUNTRIES.find(c => c.code === selectedCountry)?.name}
            {customAddress && <span> - {customAddress}</span>}
            {coordinates && (
              <span className="text-xs block mt-1 opacity-70">
                Coordonnées: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
