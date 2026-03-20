import cloudinaryMap from '../data/cloudinary-map.json';

/**
 * Get Cloudinary URL for a local asset path
 * @param localPath Path relative to public folder, e.g. "/assets/banner/hero.jpg"
 * @returns Cloudinary URL if available, otherwise original path
 */
export function getCloudinaryUrl(localPath: string): string {
  // Ensure path starts with /
  const key = localPath.startsWith('/') ? localPath : `/${localPath}`;
  
  // Cast to unknown first to avoid "any" lint error if strict
  const map = cloudinaryMap as unknown as Record<string, string>;
  const cloudinaryUrl = map[key];
  
  return cloudinaryUrl || localPath;
}

/**
 * Get Cloudinary URL and optimize it in one go
 * @param localPath Path relative to public folder, e.g. "/assets/banner/hero.jpg"
 * @param width Optional width
 * @param quality Optional quality (default: auto)
 * @returns Optimized Cloudinary URL or original path
 */
export function getOptimizedCloudinaryUrl(localPath: string, width?: number, quality = 'auto'): string {
    const url = getCloudinaryUrl(localPath);
    if (!url.startsWith('http') || !url.includes('res.cloudinary.com')) return url;
    return optimizeCloudinary(url, width, quality);
}

/**
 * Generate optimized Cloudinary URL
 * @param url Cloudinary URL
 * @param width Width to resize to
 * @param quality Quality (default: auto)
 * @param removeBg Whether to remove the background (requires Cloudinary AI add-on)
 */
export function optimizeCloudinary(url: string, width?: number, quality = 'auto', removeBg = false): string {
    if (!url.includes('res.cloudinary.com')) return url;
    
    // Simple transformation insertion
    // .../upload/v123/... -> .../upload/f_auto,q_auto,w_{width}/v123/...
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    const params = [`f_auto`, `q_${quality}`];
    if (width) params.push(`w_${width}`);
    if (removeBg) params.push(`e_bgremoval`);

    return `${parts[0]}/upload/${params.join(',')}/${parts[1]}`;
}
