import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDjassa } from '../contexts/DjassaContext';
import { ImageUploader } from '../components/ImageUploader';
import { LocationPicker } from '../components/LocationPicker';
import { ArrowLeft, DollarSign, Tag, MapPin, AlertCircle } from 'lucide-react';
import { uploadMultipleImages, optimizeImage } from '../lib/storage';

const CATEGORIES = [
  { id: 'vehicles', name: 'Véhicules', icon: '🚗' },
  { id: 'real-estate', name: 'Immobilier', icon: '🏠' },
  { id: 'electronics', name: 'Électronique', icon: '📱' },
  { id: 'home-garden', name: 'Maison & Jardin', icon: '🏡' },
  { id: 'fashion', name: 'Mode & Beauté', icon: '👗' },
  { id: 'sports', name: 'Sports & Loisirs', icon: '⚽' },
  { id: 'services', name: 'Services', icon: '🛠️' },
  { id: 'jobs', name: 'Emplois', icon: '💼' },
];

const CONDITIONS = [
  { value: 'new', label: 'Neuf', description: 'Jamais utilisé, avec emballage' },
  { value: 'like-new', label: 'Comme neuf', description: 'Très bon état, peu utilisé' },
  { value: 'good', label: 'Bon état', description: 'Quelques signes d\'usure' },
  { value: 'fair', label: 'État correct', description: 'Usure visible mais fonctionnel' },
  { value: 'for-parts', label: 'Pour pièces', description: 'Ne fonctionne plus complètement' },
];

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
}

export function CreateProductPage() {
  const navigate = useNavigate();
  const { user, createProduct } = useDjassa();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'XOF',
    category: '',
    condition: 'good',
    negotiable: true,
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-serif mb-4" style={{ color: 'var(--ink)' }}>
            Connexion requise
          </h2>
          <p className="mb-6" style={{ color: 'var(--ink-soft)' }}>
            Vous devez être connecté pour publier une annonce.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-lg font-bold uppercase text-xs tracking-widest"
            style={{ backgroundColor: 'var(--clay)', color: 'var(--white)' }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (formData.description.length < 20) {
      newErrors.description = 'La description doit contenir au moins 20 caractères';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est obligatoire';
    }

    if (images.length === 0) {
      newErrors.images = 'Au moins une image est requise';
    }

    if (!location?.city) {
      newErrors.location = 'La localisation est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setUploadProgress(10);

    try {
      // Upload des images si Supabase est configuré
      let uploadedImages: string[] = images;
      
      if (imageFiles.length > 0 && import.meta.env.VITE_SUPABASE_URL) {
        setUploadProgress(30);
        
        // Optimiser et uploader les images
        const optimizedFiles = await Promise.all(
          imageFiles.map(file => optimizeImage(file, 1920, 1920, 0.8))
        );
        
        setUploadProgress(60);
        
        const blobs = optimizedFiles.map((blob, index) => 
          new File([blob], imageFiles[index].name, { type: blob.type })
        );
        
        uploadedImages = await uploadMultipleImages(blobs);
        setUploadProgress(90);
        
        if (uploadedImages.length === 0) {
          throw new Error('Échec de l\'upload des images');
        }
      }

      await createProduct({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        category: formData.category,
        condition: formData.condition as any,
        negotiable: formData.negotiable,
        images: uploadedImages,
        location: location as any || undefined,
      });

      setUploadProgress(100);
      
      // Succès - redirection vers le dashboard
      setTimeout(() => {
        navigate('/dashboard/seller?success=created');
      }, 500);
    } catch (error) {
      console.error('Erreur création produit:', error);
      alert('Erreur lors de la création de l\'annonce. Réessayez.');
      setUploadProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (urls: string[]) => {
    setImages(urls);
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const handleImageFilesChange = (files: File[]) => {
    setImageFiles(files);
  };

  const handleLocationSelect = (loc: LocationData) => {
    setLocation(loc);
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--paper)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-4 py-4 border-b backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(245, 243, 238, 0.9)', borderColor: 'var(--line)' }}
      >
        <div className="container-wide flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} style={{ color: 'var(--ink)' }} />
          </button>
          <h1 className="text-lg font-serif" style={{ color: 'var(--ink)' }}>
            Nouvelle annonce
          </h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="container-wide py-8 space-y-8">
        {/* Erreurs globales */}
        {Object.keys(errors).length > 0 && (
          <div
            className="p-4 rounded-lg flex items-start gap-3"
            style={{ backgroundColor: '#fee2e2' }}
          >
            <AlertCircle size={20} style={{ color: '#991b1b' }} />
            <div>
              <p className="font-medium" style={{ color: '#991b1b' }}>
                Veuillez corriger les erreurs suivantes :
              </p>
              <ul className="text-sm mt-1 space-y-1" style={{ color: '#991b1b' }}>
                {Object.values(errors).map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Titre et description */}
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
              Titre de l'annonce *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: iPhone 13 Pro Max 256GB, Villa 4 pièces Cocody..."
              className={`w-full p-4 rounded-lg border bg-white ${errors.title ? 'border-red-500' : ''}`}
              style={{ borderColor: errors.title ? '#ef4444' : 'var(--line)', color: 'var(--ink)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>
              {formData.title.length}/100 caractères
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
              Description détaillée *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez votre produit : état, caractéristiques, raison de la vente..."
              rows={6}
              className={`w-full p-4 rounded-lg border bg-white resize-none ${errors.description ? 'border-red-500' : ''}`}
              style={{ borderColor: errors.description ? '#ef4444' : 'var(--line)', color: 'var(--ink)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>
              {formData.description.length} caractères minimum
            </p>
          </div>
        </section>

        {/* Upload images */}
        <section>
          <ImageUploader
            onImagesUploaded={handleImageUpload}
            onFilesChange={handleImageFilesChange}
            maxImages={5}
            existingImages={images}
          />
          {errors.images && (
            <p className="text-sm mt-2" style={{ color: '#ef4444' }}>{errors.images}</p>
          )}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--ink-soft)' }}>
                <span>Upload des images en cours...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--line)' }}>
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${uploadProgress}%`,
                    backgroundColor: 'var(--clay)'
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Prix et devise */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} style={{ color: 'var(--clay)' }} />
            <h3 className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Prix</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0"
                min="0"
                step="1"
                className={`w-full p-4 rounded-lg border bg-white ${errors.price ? 'border-red-500' : ''}`}
                style={{ borderColor: errors.price ? '#ef4444' : 'var(--line)', color: 'var(--ink)' }}
              />
            </div>
            <select
              value={formData.currency}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              className="p-4 rounded-lg border bg-white"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              <option value="XOF">FCFA</option>
              <option value="EUR">EUR €</option>
              <option value="USD">USD $</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.negotiable}
              onChange={(e) => setFormData(prev => ({ ...prev, negotiable: e.target.checked }))}
              className="w-5 h-5 rounded"
              style={{ accentColor: 'var(--clay)' }}
            />
            <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
              Prix négociable
            </span>
          </label>
        </section>

        {/* Catégorie */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={20} style={{ color: 'var(--clay)' }} />
            <h3 className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Catégorie</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, categoryId: cat.id }))}
                className={`p-4 rounded-lg border text-center transition-all ${
                  formData.category === cat.id
                    ? 'border-[var(--clay)] bg-[var(--clay)]/10'
                    : 'hover:border-[var(--clay)]/50'
                }`}
                style={{ 
                  borderColor: formData.category === cat.id ? 'var(--clay)' : 'var(--line)',
                  color: 'var(--ink)'
                }}
              >
                <span className="text-2xl block mb-2">{cat.icon}</span>
                <span className="text-xs font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="text-sm" style={{ color: '#ef4444' }}>{errors.category}</p>
          )}
        </section>

        {/* Condition */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium" style={{ color: 'var(--ink)' }}>État du produit</h3>

          <div className="space-y-2">
            {CONDITIONS.map(cond => (
              <label
                key={cond.value}
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  formData.condition === cond.value
                    ? 'border-[var(--clay)] bg-[var(--clay)]/5'
                    : 'hover:border-[var(--clay)]/30'
                }`}
                style={{ borderColor: 'var(--line)' }}
              >
                <input
                  type="radio"
                  name="condition"
                  value={cond.value}
                  checked={formData.condition === cond.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                  className="mt-1 w-4 h-4"
                  style={{ accentColor: 'var(--clay)' }}
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{cond.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>{cond.description}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Localisation */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} style={{ color: 'var(--clay)' }} />
            <h3 className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Localisation</h3>
          </div>

          <LocationPicker
            onLocationSelected={handleLocationSelect}
            initialLocation={location || undefined}
          />
          {errors.location && (
            <p className="text-sm mt-2" style={{ color: '#ef4444' }}>{errors.location}</p>
          )}
        </section>

        {/* Bouton submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-lg font-bold uppercase text-xs tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: submitting ? 'var(--ink-soft)' : 'var(--clay)',
            color: 'var(--white)'
          }}
        >
          {submitting ? 'Publication en cours...' : 'Publier l\'annonce'}
        </button>

        {/* Espacement bas pour mobile */}
        <div className="h-20" />
      </form>
    </div>
  );
}
