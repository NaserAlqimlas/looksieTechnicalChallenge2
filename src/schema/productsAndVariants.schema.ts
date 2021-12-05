import "reflect-metadata";
import { Field, ObjectType } from "type-graphql";
import { Product } from "./product.schema";
import { ProductAttributes } from "./productAttributes.schema";
import { ProductValues } from "./productValues.schema";
import { SKUs } from "./SKUs.schema";

@ObjectType()
export class ProductsAndVariants {
  @Field(() => Product)
  product: Object;

  @Field(() => SKUs)
  SKU: SKUs;

  @Field(() => [Variant])
  variants: Variant[];
}

@ObjectType()
export class Variant {
  @Field(() => ProductAttributes)
  attribute: ProductAttributes;

  @Field(() => [ProductValues])
  values: ProductValues[];
}
