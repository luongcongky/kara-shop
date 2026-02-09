import { z } from 'zod';
import { createTRPCRouter, adminProcedure } from '../trpc';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/env/server.mjs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const cloudinaryRouter = createTRPCRouter({
  clearTempFolder: adminProcedure.mutation(async () => {
    try {
      const folderPath = 'kara-shop/products/temp';
      console.log(`[Cloudinary] Clearing folder: ${folderPath}`);
      
      // Delete all resources in the temp folder
      // Note: delete_resources_by_prefix doesn't delete the folder itself, just content
      await cloudinary.api.delete_resources_by_prefix(`${folderPath}/`);
      
      return { success: true };
    } catch (error) {
      console.error('[Cloudinary] Failed to clear temp folder:', error);
      throw new Error('Failed to clear temp folder');
    }
  }),
  deleteImage: adminProcedure
    .input(z.object({ imageUrl: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const { imageUrl } = input;
        
        // Extract public_id from Cloudinary URL
        // We look for the "kara-shop" segment which is our root folder
        if (imageUrl.includes('cloudinary.com')) {
          const segments = imageUrl.split('/');
          const rootIndex = segments.findIndex(s => s === 'kara-shop');
          
          if (rootIndex !== -1) {
            // Get everything from kara-shop onwards
            const pathWithExtension = segments.slice(rootIndex).join('/');
            // Remove the extension
            const publicId = pathWithExtension.split('.').slice(0, -1).join('.');
            
            console.log(`[Cloudinary] Extracted publicId: ${publicId}`);
            const result = await cloudinary.uploader.destroy(publicId);
            console.log(`[Cloudinary] Delete result for ${publicId}:`, result);
            
            if (result.result === 'ok') {
              return { success: true };
            } else {
              return { success: false, message: result.result };
            }
          }
        }
        
        console.warn(`[Cloudinary] Could not extract publicId from URL: ${imageUrl}`);
        return { success: false, message: 'Not a valid Cloudinary URL or root folder not found' };
      } catch (error) {
        console.error('[Cloudinary] Failed to delete image:', error);
        throw new Error('Failed to delete image from Cloudinary');
      }
    }),
  deleteFolder: adminProcedure
    .input(z.object({ folderPath: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const { folderPath } = input;
        console.log(`[Cloudinary] Cleaning up resources in folder: ${folderPath}`);
        
        // 1. Delete all resources in the folder (including images and their versions)
        await cloudinary.api.delete_resources_by_prefix(`${folderPath}/`);
        
        // 2. Add a small delay to allow Cloudinary to process deletions
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // 3. Delete the empty folder
        const result = await cloudinary.api.delete_folder(folderPath);
        console.log(`[Cloudinary] Folder delete result for ${folderPath}:`, result);
        
        return { success: result.deleted?.includes(folderPath) };
      } catch (error) {
        console.error('[Cloudinary] Failed to delete folder:', error);
        // We don't throw error here to avoid blocking UI if folder doesn't exist or isn't empty
        return { success: false, error: (error as Error).message };
      }
    }),
});
