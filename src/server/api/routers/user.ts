import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/env/server.mjs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, image } = input;
      const userId = ctx.session.user.id;

      // 1. Fetch current user to get old image
      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { image: true },
      });

      // 2. Update user
      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(image && { image }),
        },
      });

      // 3. If image changed, delete old image from Cloudinary
      if (image && currentUser?.image && currentUser.image !== image) {
        const oldImage = currentUser.image;
        
        // Extract public_id from URL
        // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/my_image.jpg
        // Public ID: folder/my_image
        try {
            // Check if it's a Cloudinary URL
            if (oldImage.includes('cloudinary.com')) {
                // Regex to capture public_id: after 'upload/' (and optional version v123/) and before extension
                const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/;
                const match = oldImage.match(regex);
                if (match && match[1]) {
                    const publicId = match[1];
                    await cloudinary.uploader.destroy(publicId);
                    console.log(`[Cloudinary] Deleted old avatar: ${publicId}`);
                }
            }
        } catch (error) {
            console.error('[Cloudinary] Failed to delete old image:', error);
            // Don't fail the request, just log error
        }
      }

      return updatedUser;
    }),
});
