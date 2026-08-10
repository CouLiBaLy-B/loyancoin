import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Upload d'image vers Supabase Storage
 * @param file - Fichier image à uploader
 * @param bucket - Nom du bucket (default: 'product-images')
 * @returns URL publique de l'image ou null en cas d'erreur
 */
export async function uploadImage(
  file: File,
  bucket: string = 'product-images'
): Promise<string | null> {
  try {
    // Nom de fichier unique avec timestamp
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // Upload vers Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    
    // Récupérer l'URL publique
    const urlData = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return urlData.data.publicUrl
  } catch (error) {
    console.error('Erreur upload image:', error)
    return null
  }
}

/**
 * Upload multiple d'images
 * @param files - Tableau de fichiers images
 * @param bucket - Nom du bucket
 * @returns Tableau des URLs publiques
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: string = 'product-images'
): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, bucket))
  const results = await Promise.all(uploadPromises)
  return results.filter((url): url is string => url !== null)
}

/**
 * Supprimer une image du storage
 * @param imageUrl - URL de l'image à supprimer
 * @param bucket - Nom du bucket
 */
export async function deleteImage(
  imageUrl: string,
  bucket: string = 'product-images'
): Promise<void> {
  try {
    // Extraire le nom du fichier depuis l'URL
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    
    await supabase.storage
      .from(bucket)
      .remove([fileName])
  } catch (error) {
    console.error('Erreur suppression image:', error)
  }
}

/**
 * Optimiser une image côté client avant upload
 * @param file - Fichier image original
 * @param maxWidth - Largeur maximale (default: 1920)
 * @param maxHeight - Hauteur maximale (default: 1920)
 * @param quality - Qualité JPEG (0.1-1.0, default: 0.8)
 * @returns Blob de l'image optimisée
 */
export async function optimizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height
      
      // Redimensionner si nécessaire
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = width * ratio
        height = height * ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          resolve(blob || file)
        },
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        quality
      )
      
      URL.revokeObjectURL(img.src)
    }
    
    img.onerror = () => {
      resolve(file)
    }
  })
}

/**
 * Vérifier le type de fichier
 * @param file - Fichier à vérifier
 * @returns true si c'est une image valide
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize
}

/**
 * Formater la taille d'un fichier
 * @param bytes - Taille en bytes
 * @returns Taille formatée (KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
