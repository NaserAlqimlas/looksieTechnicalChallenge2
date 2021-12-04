import "reflect-metadata";
import { Field, ObjectType } from "type-graphql";
import { Product } from "./product.schema";
import { ProductValues } from "./productValues.schema";
import { SKUs } from "./SKUs.schema";

@ObjectType()
export class ProductsAndVariants {
  @Field(() => Product)
  product: Object;

  @Field(() => SKUs)
  SKU: Object;

  @Field(() => [Variant])
  variants: Variant[];
}

@ObjectType()
export class Variant {
  @Field(() => String)
  attribute: string;

  @Field(() => [ProductValues])
  values: ProductValues[];
}
