import { Query, Mutation, Resolver, Int, Arg } from "type-graphql";
import { Product } from "../schema/product.schema";
import { PrismaClient } from ".prisma/client";
import {
  ProductsAndVariants,
  Variant,
} from "../schema/productsAndVariants.schema";

const prisma = new PrismaClient();

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  products(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  @Query(() => ProductsAndVariants)
  async productsWithVariants(
    @Arg("id", () => Int) id: number
  ): Promise<ProductsAndVariants> {
    const product = await prisma.product.findMany({
      where: {
        id: id,
      },
    });

    const SKU = await prisma.sKUs.findMany({
      where: {
        product_id: id,
      },
    });

    const attributes = await prisma.product_Attributes.findMany({
      where: {
        product_id: id,
      },
    });

    const variants: Variant[] = [];

    for (let attribute of attributes) {
      const variant = new Variant();
      variant.attribute = attribute.name;

      const values = await prisma.product_Values.findMany({
        where: {
          attribute_id: attribute.id,
        },
      });

      variant.values = values;

      variants.push(variant);
    }

    const productAndVariants: ProductsAndVariants = {
      product: product,
      SKU: SKU,
      variants: variants,
    };

    return productAndVariants;
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id", () => Int) id: number): Promise<Boolean> {
    await prisma.product.delete({ where: { id: id } });
    return true;
  }
}
