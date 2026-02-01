import { createTRPCRouter } from './trpc';
import { collectionRouter } from './routers/collection';
import { productRouter } from './routers/product';
import { userRouter } from './routers/user';
import { bannerRouter } from './routers/banner';
import { flashSaleRouter } from './routers/flash-sale';
import { cloudinaryRouter } from './routers/cloudinary';

import { contextRouter } from './routers/context';
import { cartRouter } from './routers/cart';
import { wishlistRouter } from './routers/wishlist';
import { orderRouter } from './routers/order';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  collection: collectionRouter,
  product: productRouter,
  user: userRouter,
  banner: bannerRouter,
  flashSale: flashSaleRouter,
  cloudinary: cloudinaryRouter,
  context: contextRouter,
  cart: cartRouter,
  wishlist: wishlistRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
