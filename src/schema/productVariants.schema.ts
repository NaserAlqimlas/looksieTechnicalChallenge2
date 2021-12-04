import "reflect-metadata";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class ProductVariants {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  product_id: number;

  @Field(() => ID)
  SKU_id: number;

  @Field(() => ID)
  attribute_id: number;

  @Field(() => ID)
  value_id: number;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
