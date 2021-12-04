import {
  Query,
  Mutation,
  Resolver,
  Int,
  Arg,
  InputType,
  Field,
} from "type-graphql";
import { Product } from "../schema/product.schema";
import { PrismaClient, Product_Values } from ".prisma/client";
import {
  ProductsAndVariants,
  Variant,
} from "../schema/productsAndVariants.schema";

const prisma = new PrismaClient();

@InputType()
class ProductInput {
  @Field()
  name: string;

  @Field()
  description?: string;

  @Field()
  price: number;

  @Field(() => [Variant], { nullable: true })
  variants: Variant[];

  @Field()
  barcode: string;

  @Field()
  stock: number;
}

@InputType()
class VariantInput {
  @Field()
  id: number;

  @Field()
  attribute: string;

  @Field()
  values: string[];
}

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

  @Mutation(() => Product)
  async createProduct(
    @Arg("input") input: ProductInput
  ): Promise<ProductsAndVariants> {
    const { name, price, description, variants, barcode, stock } = input;

    const product = await prisma.product.create({
      data: {
        name: name,
        price: price,
        description: description,
      },
    });

    //TODO: Figure out if you can optimize this
    if (variants) {
      for (let variant of variants) {
        const attribute = await prisma.product_Attributes.create({
          data: {
            name: variant.attribute,
            product_id: product.id,
          },
        });
        variant.values.map(
          async (value) =>
            await prisma.product_Values.create({
              data: {
                value: value.value,
                attribute_id: attribute.id,
              },
            })
        );
      }
    }

    const SKU = await prisma.sKUs.create({
      data: {
        barcode: barcode,
        stock: stock,
        price: price,
        product_id: product.id,
      },
    });

    const productAndVariants: ProductsAndVariants = {
      product: product,
      SKU: SKU,
      variants: variants,
    };

    return productAndVariants;
  }

  @Mutation(() => [Variant])
  async createVariant(@Arg("input") input: [VariantInput]): Promise<Variant[]> {
    const variants: Variant[] = [];

    for (let variant of input) {
      const attribute = await prisma.product_Attributes.create({
        data: {
          product_id: variant.id,
          name: variant.attribute,
        },
      });
      const values: Product_Values[] = [];
      for (let value of variant.values) {
        const insertedValue = await prisma.product_Values.create({
          data: {
            value: value,
            attribute_id: attribute.id,
          },
        });
        values.push(insertedValue);
      }

      variants.push({ attribute: attribute.name, values: values });
    }
    return variants;
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id", () => Int) id: number): Promise<Boolean> {
    await prisma.product.delete({ where: { id: id } });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteVariant(@Arg("id", () => Int) id: number): Promise<Boolean> {
    await prisma.product_Attributes.delete({ where: { id: id } });
    return true;
  }
}
