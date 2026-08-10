import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Client Supabase principal
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper pour uploader des images vers Supabase Storage
export async function uploadProductImage(file: File, userId: string): Promise<string> {
  if (!supabaseUrl) {
    // Mode démo : retourne une URL factice si pas de config Supabase
    return URL.createObjectURL(file);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
}

// Helper pour obtenir la position géographique
export function getCurrentLocation(): Promise<{ lat: number; lng: number; address?: string }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n\'est pas supportée par ce navigateur.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Optionnel : Reverse geocoding avec OpenStreetMap (gratuit)
        let address = '';
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          address = data.display_name || '';
        } catch (e) {
          console.warn('Reverse geocoding failed', e);
        }

        resolve({ lat: latitude, lng: longitude, address });
      },
      (error) => {
        reject(new Error(error.message));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}
