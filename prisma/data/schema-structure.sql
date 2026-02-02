-- Database Schema Export
-- Generated: 2026-02-02T05:06:29.247Z
-- Schema: ecommerce

CREATE SCHEMA IF NOT EXISTS "ecommerce";

-- Table: Account
CREATE TABLE IF NOT EXISTS "ecommerce"."Account" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "refresh_token_expires_in" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  "oauth_token" text,
  "oauth_token_secret" text
);

-- Indexes for Account
CREATE UNIQUE INDEX "Account_pkey" ON ecommerce."Account" USING btree (id);
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON ecommerce."Account" USING btree (provider, "providerAccountId");

-- Table: Banner
CREATE TABLE IF NOT EXISTS "ecommerce"."Banner" (
  "id" integer DEFAULT nextval('ecommerce."Banner_id_seq"'::regclass) NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp without time zone NOT NULL,
  "title" text NOT NULL,
  "subtitle" text,
  "discount" text,
  "imageUrl" text NOT NULL,
  "linkUrl" text,
  "bgColor" text DEFAULT 'bg-white'::text NOT NULL,
  "textColor" text DEFAULT 'text-black'::text NOT NULL,
  "buttonColor" text DEFAULT 'bg-orange-500'::text NOT NULL,
  "type" text DEFAULT 'HERO'::text NOT NULL,
  "order" integer DEFAULT 0 NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "productId" integer
);

-- Indexes for Banner
CREATE UNIQUE INDEX "Banner_pkey" ON ecommerce."Banner" USING btree (id);

-- Table: CartItem
CREATE TABLE IF NOT EXISTS "ecommerce"."CartItem" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "productId" integer NOT NULL,
  "quantity" integer DEFAULT 1 NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp without time zone NOT NULL
);

-- Indexes for CartItem
CREATE UNIQUE INDEX "CartItem_pkey" ON ecommerce."CartItem" USING btree (id);
CREATE UNIQUE INDEX "CartItem_userId_productId_key" ON ecommerce."CartItem" USING btree ("userId", "productId");

-- Table: Collection
CREATE TABLE IF NOT EXISTS "ecommerce"."Collection" (
  "id" integer DEFAULT nextval('ecommerce."Collection_id_seq"'::regclass) NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp without time zone NOT NULL,
  "slug" text NOT NULL,
  "name" character varying(255) NOT NULL,
  "parentId" integer,
  "types" ARRAY,
  "useYn" boolean DEFAULT true NOT NULL
);

-- Indexes for Collection
CREATE UNIQUE INDEX "Collection_pkey" ON ecommerce."Collection" USING btree (id);
CREATE UNIQUE INDEX "Collection_slug_key" ON ecommerce."Collection" USING btree (slug);

-- Table: Context
CREATE TABLE IF NOT EXISTS "ecommerce"."Context" (
  "id" integer DEFAULT nextval('ecommerce."Context_id_seq"'::regclass) NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp without time zone NOT NULL,
  "title" character varying(255) NOT NULL,
  "slug" character varying(255) NOT NULL,
  "type" USER-DEFINED NOT NULL,
  "content" text NOT NULL,
  "metadata" jsonb,
  "status" character varying(20) DEFAULT 'draft'::character varying NOT NULL,
  "authorId" text,
  "thumbnail" text
);

-- Indexes for Context
CREATE UNIQUE INDEX "Context_pkey" ON ecommerce."Context" USING btree (id);
CREATE UNIQUE INDEX "Context_slug_key" ON ecommerce."Context" USING btree (slug);

-- Table: FlashSale
CREATE TABLE IF NOT EXISTS "ecommerce"."FlashSale" (
  "id" integer DEFAULT nextval('ecommerce."FlashSale_id_seq"'::regclass) NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp without time zone NOT NULL,
  "productId" integer NOT NULL,
  "salePrice" double precision NOT NULL,
  "totalSlots" integer NOT NULL,
  "soldSlots" integer DEFAULT 0 NOT NULL,
  "endTime" timestamp without time zone NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "badge" text
);

-- Indexes for FlashSale
CREATE UNIQUE INDEX "FlashSale_pkey" ON ecommerce."FlashSale" USING btree (id);

-- Table: Order
CREATE TABLE IF NOT EXISTS "ecommerce"."Order" (
  "id" text NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp without time zone NOT NULL,
  "userId" text NOT NULL,
  "status" USER-DEFINED DEFAULT 'PENDING'::ecommerce."OrderStatus" NOT NULL,
  "totalAmount" double precision NOT NULL,
  "paymentMethod" USER-DEFINED NOT NULL,
  "shippingName" text NOT NULL,
  "shippingPhone" text NOT NULL,
  "shippingAddress" text NOT NULL
);

-- Indexes for Order
CREATE UNIQUE INDEX "Order_pkey" ON ecommerce."Order" USING btree (id);

-- Table: OrderItem
CREATE TABLE IF NOT EXISTS "ecommerce"."OrderItem" (
  "id" text NOT NULL,
  "orderId" text NOT NULL,
  "productId" integer NOT NULL,
  "quantity" integer NOT NULL,
  "price" double precision NOT NULL
);

-- Indexes for OrderItem
CREATE UNIQUE INDEX "OrderItem_pkey" ON ecommerce."OrderItem" USING btree (id);

-- Table: Product
CREATE TABLE IF NOT EXISTS "ecommerce"."Product" (
  "id" integer DEFAULT nextval('ecommerce."Product_id_seq"'::regclass) NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp without time zone NOT NULL,
  "description" text NOT NULL,
  "published" boolean DEFAULT false NOT NULL,
  "price" double precision NOT NULL,
  "rate" double precision NOT NULL,
  "colors" ARRAY,
  "name" character varying(255) NOT NULL,
  "types" ARRAY,
  "originalPrice" double precision
);

-- Indexes for Product
CREATE UNIQUE INDEX "Product_pkey" ON ecommerce."Product" USING btree (id);

-- Table: ProductAttribute
CREATE TABLE IF NOT EXISTS "ecommerce"."ProductAttribute" (
  "id" integer DEFAULT nextval('ecommerce."ProductAttribute_id_seq"'::regclass) NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp without time zone NOT NULL,
  "attributeName" character varying(255) NOT NULL,
  "attributeValue" text NOT NULL,
  "productId" integer NOT NULL,
  "groupName" character varying(255)
);

-- Indexes for ProductAttribute
CREATE UNIQUE INDEX "ProductAttribute_pkey" ON ecommerce."ProductAttribute" USING btree (id);

-- Table: ProductCollection
CREATE TABLE IF NOT EXISTS "ecommerce"."ProductCollection" (
  "productId" integer NOT NULL,
  "collectionId" integer NOT NULL
);

-- Indexes for ProductCollection
CREATE UNIQUE INDEX "ProductCollection_pkey" ON ecommerce."ProductCollection" USING btree ("productId", "collectionId");

-- Table: ProductImage
CREATE TABLE IF NOT EXISTS "ecommerce"."ProductImage" (
  "id" integer DEFAULT nextval('ecommerce."ProductImage_id_seq"'::regclass) NOT NULL,
  "imageURL" text NOT NULL,
  "imageBlur" text NOT NULL,
  "productId" integer
);

-- Indexes for ProductImage
CREATE UNIQUE INDEX "ProductImage_pkey" ON ecommerce."ProductImage" USING btree (id);

-- Table: ProductInclusion
CREATE TABLE IF NOT EXISTS "ecommerce"."ProductInclusion" (
  "id" integer DEFAULT nextval('ecommerce."ProductInclusion_id_seq"'::regclass) NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp without time zone NOT NULL,
  "itemName" character varying(255) NOT NULL,
  "productId" integer NOT NULL
);

-- Indexes for ProductInclusion
CREATE UNIQUE INDEX "ProductInclusion_pkey" ON ecommerce."ProductInclusion" USING btree (id);

-- Table: ProductReview
CREATE TABLE IF NOT EXISTS "ecommerce"."ProductReview" (
  "id" integer DEFAULT nextval('ecommerce."ProductReview_id_seq"'::regclass) NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp without time zone NOT NULL,
  "userName" character varying(255) NOT NULL,
  "rating" integer DEFAULT 5 NOT NULL,
  "comment" text NOT NULL,
  "productId" integer NOT NULL
);

-- Indexes for ProductReview
CREATE UNIQUE INDEX "ProductReview_pkey" ON ecommerce."ProductReview" USING btree (id);

-- Table: Promotion
CREATE TABLE IF NOT EXISTS "ecommerce"."Promotion" (
  "id" integer DEFAULT nextval('ecommerce."Promotion_id_seq"'::regclass) NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp without time zone NOT NULL,
  "title" text NOT NULL,
  "subtitle" text NOT NULL,
  "description" text NOT NULL,
  "imageUrl" text NOT NULL,
  "linkUrl" text NOT NULL,
  "badge" text NOT NULL,
  "color" text DEFAULT 'from-blue-600 to-indigo-700'::text NOT NULL,
  "order" integer DEFAULT 0 NOT NULL,
  "active" boolean DEFAULT true NOT NULL
);

-- Indexes for Promotion
CREATE UNIQUE INDEX "Promotion_pkey" ON ecommerce."Promotion" USING btree (id);

-- Table: Session
CREATE TABLE IF NOT EXISTS "ecommerce"."Session" (
  "id" text NOT NULL,
  "sessionToken" text NOT NULL,
  "userId" text NOT NULL,
  "expires" timestamp without time zone NOT NULL
);

-- Indexes for Session
CREATE UNIQUE INDEX "Session_pkey" ON ecommerce."Session" USING btree (id);
CREATE UNIQUE INDEX "Session_sessionToken_key" ON ecommerce."Session" USING btree ("sessionToken");

-- Table: User
CREATE TABLE IF NOT EXISTS "ecommerce"."User" (
  "id" text NOT NULL,
  "name" text,
  "email" text,
  "emailVerified" timestamp without time zone,
  "image" text,
  "password" text,
  "role" USER-DEFINED DEFAULT 'USER'::ecommerce."Role" NOT NULL
);

-- Indexes for User
CREATE UNIQUE INDEX "User_pkey" ON ecommerce."User" USING btree (id);
CREATE UNIQUE INDEX "User_email_key" ON ecommerce."User" USING btree (email);

-- Table: VerificationToken
CREATE TABLE IF NOT EXISTS "ecommerce"."VerificationToken" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp without time zone NOT NULL
);

-- Indexes for VerificationToken
CREATE UNIQUE INDEX "VerificationToken_token_key" ON ecommerce."VerificationToken" USING btree (token);
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON ecommerce."VerificationToken" USING btree (identifier, token);

-- Table: WishlistItem
CREATE TABLE IF NOT EXISTS "ecommerce"."WishlistItem" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "productId" integer NOT NULL,
  "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for WishlistItem
CREATE UNIQUE INDEX "WishlistItem_pkey" ON ecommerce."WishlistItem" USING btree (id);
CREATE UNIQUE INDEX "WishlistItem_userId_productId_key" ON ecommerce."WishlistItem" USING btree ("userId", "productId");

-- Table: _prisma_migrations
CREATE TABLE IF NOT EXISTS "ecommerce"."_prisma_migrations" (
  "id" character varying(36) NOT NULL,
  "checksum" character varying(64) NOT NULL,
  "finished_at" timestamp with time zone,
  "migration_name" character varying(255) NOT NULL,
  "logs" text,
  "rolled_back_at" timestamp with time zone,
  "started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "applied_steps_count" integer DEFAULT 0 NOT NULL
);

-- Indexes for _prisma_migrations
CREATE UNIQUE INDEX _prisma_migrations_pkey ON ecommerce._prisma_migrations USING btree (id);

-- Foreign Key Constraints
ALTER TABLE "ecommerce"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ecommerce"."User" ("id");
ALTER TABLE "ecommerce"."Banner" ADD CONSTRAINT "Banner_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ecommerce"."Product" ("id");
ALTER TABLE "ecommerce"."CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ecommerce"."User" ("id");
ALTER TABLE "ecommerce"."CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ecommerce"."Product" ("id");
ALTER TABLE "ecommerce"."Collection" ADD CONSTRAINT "Collection_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ecommerce"."Collection" ("id");
ALTER TABLE "ecommerce"."Context" ADD CONSTRAINT "Context_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "ecommerce"."User" ("id");
ALTER TABLE "ecommerce"."FlashSale" ADD CONSTRAINT "FlashSale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ecommerce"."Product" ("id");
ALTER TABLE "ecommerce"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ecommerce"."User" ("id");
ALTER TABLE "ecommerce"."OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ecommerce"."Product" ("id");
ALTER TABLE "ecommerce"."OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ecommerce"."Order" ("id");
ALTER TABLE "ecommerce"."ProductAttribute" ADD CONSTRAINT "ProductAttribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ecommerce"."Product" ("id");
ALTER TABLE "ecommerce"."ProductCollection" ADD CONSTRAINT "ProductCollection_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ecommerce"."Product" ("id");
ALTER TABLE "ecommerce"."ProductCollection" ADD CONSTRAINT "ProductCollection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "ecommerce"."Collection" ("id");
ALTER TABLE "ecommerce"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ecommerce"."Product" ("id");
ALTER TABLE "ecommerce"."ProductInclusion" ADD CONSTRAINT "ProductInclusion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ecommerce"."Product" ("id");
ALTER TABLE "ecommerce"."ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ecommerce"."Product" ("id");
ALTER TABLE "ecommerce"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ecommerce"."User" ("id");
ALTER TABLE "ecommerce"."WishlistItem" ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ecommerce"."User" ("id");
ALTER TABLE "ecommerce"."WishlistItem" ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ecommerce"."Product" ("id");

