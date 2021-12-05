-- DropForeignKey
ALTER TABLE "Product_Attributes" DROP CONSTRAINT "Product_Attributes_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Product_Values" DROP CONSTRAINT "Product_Values_attribute_id_fkey";

-- DropForeignKey
ALTER TABLE "Product_Variants" DROP CONSTRAINT "Product_Variants_product_id_fkey";

-- DropForeignKey
ALTER TABLE "SKUs" DROP CONSTRAINT "SKUs_product_id_fkey";

-- AddForeignKey
ALTER TABLE "Product_Attributes" ADD CONSTRAINT "Product_Attributes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Values" ADD CONSTRAINT "Product_Values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Product_Attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKUs" ADD CONSTRAINT "SKUs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Variants" ADD CONSTRAINT "Product_Variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
