import cloudinaryMap from '../data/cloudinary-map.json';

/**
 * Get Cloudinary URL for a local asset path
 * @param localPath Path relative to public folder, e.g. "/assets/banner/hero.jpg"
 * @returns Cloudinary URL if available, otherwise original path
 */
export function getCloudinaryUrl(localPath: string): string {
  // Ensure path starts with /
  const key = localPath.startsWith('/') ? localPath : `/${localPath}`;
  
  // @ts-ignore
  const cloudinaryUrl = cloudinaryMap[key];
  
  return cloudinaryUrl || localPath;
}

/**
 * Generate optimized Cloudinary URL
 * @param url Cloudinary URL
 * @param width Width to resize to
 * @param quality Quality (default: auto)
 */
export function optimizeCloudinary(url: string, width?: number, quality = 'auto'): string {
    if (!url.includes('res.cloudinary.com')) return url;
    
    // Simple transformation insertion
    // .../upload/v123/... -> .../upload/f_auto,q_auto,w_{width}/v123/...
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    const params = [`f_auto`, `q_${quality}`];
    if (width) params.push(`w_${width}`);

    return `${parts[0]}/upload/${params.join(',')}/${parts[1]}`;
}
