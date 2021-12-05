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
import { ProductValues } from "src/schema/productValues.schema";

const prisma = new PrismaClient();

@InputType()
class ProductInput {
  @Field()
  name: string;

  @Field()
  description?: string;

  @Field()
  price: number;

  @Field(() => [ProductVariantInput], { nullable: true })
  variants: [ProductVariantInput];

  @Field()
  barcode: string;

  @Field()
  stock: number;
}

@InputType()
class EditProductInput {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;

  @Field(() => [ProductVariantInput], { nullable: true })
  variants?: [ProductVariantInput];
}

@InputType()
class ProductVariantInput {
  @Field()
  attribute: string;

  @Field(() => [String])
  values: string[];
}

@InputType()
class VariantInput {
  @Field()
  id: number; // product_id

  @Field()
  attribute: string;

  @Field(() => [String])
  values: string[];
}

@InputType()
class EditVariantInput {
  @Field({ nullable: true })
  id?: number; //attribute id

  @Field({ nullable: true })
  attribute?: string;

  @Field({ nullable: true })
  value?: string;

  @Field({ nullable: true })
  value_id?: number;
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
      variant.attribute = attribute;

      const values = await prisma.product_Values.findMany({
        where: {
          attribute_id: attribute.id,
        },
      });

      variant.values = values;

      variants.push(variant);
    }

    const productAndVariants: ProductsAndVariants = {
      product: product[0],
      SKU: SKU[0],
      variants: variants,
    };

    if (product[0] === undefined) {
      throw new Error(`Unable to find product with id ${id}`);
    }
    return productAndVariants;
  }

  @Mutation(() => ProductsAndVariants)
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
    const allVariants: Variant[] = [];
    if (variants) {
      for (let variant of variants) {
        const attribute = await prisma.product_Attributes.create({
          data: {
            name: variant.attribute,
            product_id: product.id,
          },
        });
        const values: ProductValues[] = [];
        variant.values.map(async (value) => {
          const newValue = await prisma.product_Values.create({
            data: {
              value: value,
              attribute_id: attribute.id,
            },
          });
          values.push(newValue);
        });
        allVariants.push({ attribute: attribute, values: values });
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
      variants: allVariants,
    };

    return productAndVariants;
  }

  @Mutation(() => [Variant])
  async createVariant(
    @Arg("input", () => [VariantInput]) input: [VariantInput]
  ): Promise<Variant[]> {
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

      variants.push({ attribute: attribute, values: values });
    }
    return variants;
  }

  @Mutation(() => Product)
  async editProduct(@Arg("input") input: EditProductInput): Promise<Product> {
    const { id, name, price, description } = input;

    const product = await prisma.product.findFirst({ where: { id: id } });

    if (!product) throw new Error(`Unable to find product with id ${id}`);

    if (name !== undefined) {
      product.name = name;
    }
    if (price !== undefined) {
      product.price = price;
    }
    if (description !== undefined) {
      product.description = description;
    }

    const newProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
      },
    });

    return newProduct;
  }

  @Mutation(() => Variant)
  async editVariant(@Arg("input") input: EditVariantInput): Promise<Variant> {
    const { id, attribute, value, value_id } = input;

    const productAttribute = await prisma.product_Attributes.findFirst({
      where: { id: id },
    });
    const productValues = await prisma.product_Values.findFirst({
      where: { id: value_id },
    });

    if (!productAttribute)
      throw new Error(`Unable to find variant with attribute id ${id}`);
    if (attribute !== undefined) {
      await prisma.product_Attributes.update({
        where: { id: id },
        data: {
          product_id: productAttribute.product_id,
          name: attribute,
        },
      });
    }

    if (!productValues)
      throw new Error(`Unable to find variant with value id ${value_id}`);
    if (value !== undefined) {
      await prisma.product_Values.update({
        where: { id: value_id },
        data: {
          value: value,
          attribute_id: id,
        },
      });
    }

    const newAttribute = await prisma.product_Attributes.findFirst({
      where: { id: id },
    });
    const newValue = await prisma.product_Values.findFirst({
      where: { id: id },
    });

    if (!newAttribute)
      throw new Error(`Unable to find variant with attribute id ${id}`);
    if (!newValue)
      throw new Error(`Unable to find variant with value id ${value_id}`);

    const variant: Variant = {
      attribute: newAttribute,
      values: [newValue],
    };

    return variant;
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id", () => Int) id: number): Promise<Boolean> {
    await prisma.product.delete({ where: { id: id } });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteProducts(
    @Arg("Ids", () => [Int]) ids: number[]
  ): Promise<Boolean> {
    for (let id of ids) {
      await prisma.product.delete({ where: { id: id } });
    }
    return true;
  }

  @Mutation(() => Boolean)
  async deleteVariant(@Arg("id", () => Int) id: number): Promise<Boolean> {
    await prisma.product_Attributes.delete({ where: { id: id } });
    return true;
  }
}
