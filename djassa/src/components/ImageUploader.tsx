import { useState, useRef } from 'react';
import { useDjassa } from '../contexts/DjassaContext';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void;
  onFilesChange?: (files: File[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

export function ImageUploader({ 
  onImagesUploaded, 
  onFilesChange,
  maxImages = 5, 
  existingImages = [] 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImages } = useDjassa();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - previews.length;
    if (remainingSlots <= 0) {
      alert(`Vous pouvez ajouter maximum ${maxImages} images`);
      return;
    }

    setUploading(true);

    try {
      // Créer des previews locales immédiates
      const newPreviews: string[] = [];
      const filesToUpload: File[] = [];

      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        const file = files[i];
        
        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
          alert(`Le fichier "${file.name}" n'est pas une image valide`);
          continue;
        }

        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`L'image "${file.name}" dépasse 5MB`);
          continue;
        }

        // Créer preview locale
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push(previewUrl);
        filesToUpload.push(file);
      }

      if (filesToUpload.length === 0) {
        setUploading(false);
        return;
      }

      // Ajouter les previews immédiatement
      setPreviews(prev => [...prev, ...newPreviews]);
      setFiles(prev => [...prev, ...filesToUpload]);
      
      // Notifier le parent des fichiers
      if (onFilesChange) {
        onFilesChange([...files, ...filesToUpload]);
      }

      // Upload en arrière-plan
      const uploadedUrls = await uploadImages(filesToUpload);
      
      // Notifier le parent avec les URLs uploadées
      const allUrls = [...existingImages, ...uploadedUrls];
      onImagesUploaded(allUrls);

    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload des images. Réessayez.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const url = previews[index];
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }

    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    
    setPreviews(newPreviews);
    setFiles(newFiles);
    
    // Notifier le parent
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
    
    onImagesUploaded(newPreviews);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
          Photos du produit
        </label>
        <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          {previews.length}/{maxImages} images
        </span>
      </div>

      {/* Zone d'upload */}
      <div
        onClick={openFilePicker}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-[var(--clay)]'}
        `}
        style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper-deep)' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--clay)] border-t-transparent" />
          ) : (
            <>
              <Upload size={32} style={{ color: 'var(--clay)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                  Cliquez pour ajouter des photos
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>
                  PNG, JPG jusqu'à 5MB ({maxImages - previews.length} restantes)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Prévisualisations */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previews.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden group"
              style={{ backgroundColor: 'var(--paper-deep)' }}
            >
              <img
                src={url}
                alt={`Aperçu ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Badge première image */}
              {index === 0 && (
                <span
                  className="absolute top-1 left-1 px-2 py-0.5 text-xs font-bold rounded"
                  style={{ 
                    backgroundColor: 'var(--clay)', 
                    color: 'var(--white)' 
                  }}
                >
                  Principale
                </span>
              )}

              {/* Bouton supprimer */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: 'var(--moss)', color: 'var(--white)' }}
              >
                <X size={14} />
              </button>

              {/* Overlay au survol */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: 'var(--moss)' }}
              />
            </div>
          ))}

          {/* Slot vide pour ajout rapide */}
          {previews.length < maxImages && (
            <button
              type="button"
              onClick={openFilePicker}
              className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center gap-2 transition-colors hover:border-[var(--clay)]"
              style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper-deep)' }}
            >
              <ImageIcon size={24} style={{ color: 'var(--ink-soft)' }} />
              <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>Ajouter</span>
            </button>
          )}
        </div>
      )}

      {/* Conseils */}
      <div
        className="p-4 rounded-lg text-sm"
        style={{ backgroundColor: 'var(--paper-deep)' }}
      >
        <p className="font-medium mb-2" style={{ color: 'var(--ink)' }}>
          💡 Conseils pour de meilleures photos :
        </p>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
          <li>• Prenez des photos sous un bon éclairage naturel</li>
          <li>• Montrez le produit sous plusieurs angles</li>
          <li>• Incluez une photo de l'étiquette ou marque si applicable</li>
          <li>• La première image sera la principale</li>
        </ul>
      </div>
    </div>
  );
}
