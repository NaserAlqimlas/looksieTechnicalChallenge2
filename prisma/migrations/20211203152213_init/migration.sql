-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "in_stock" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product_Attributes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_Attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product_Values" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_Values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SKUs" (
    "id" SERIAL NOT NULL,
    "barcode" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SKUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product_Variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "SKU_id" INTEGER NOT NULL,
    "value_id" INTEGER NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_Variants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product_Attributes" ADD CONSTRAINT "Product_Attributes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Values" ADD CONSTRAINT "Product_Values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Product_Attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKUs" ADD CONSTRAINT "SKUs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Variants" ADD CONSTRAINT "Product_Variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Variants" ADD CONSTRAINT "Product_Variants_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Product_Attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Variants" ADD CONSTRAINT "Product_Variants_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "Product_Values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Variants" ADD CONSTRAINT "Product_Variants_SKU_id_fkey" FOREIGN KEY ("SKU_id") REFERENCES "SKUs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
