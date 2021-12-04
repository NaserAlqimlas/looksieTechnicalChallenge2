import "reflect-metadata";
import { ObjectType, Field, ID, Float, Int } from "type-graphql";

@ObjectType()
export class SKUs {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  barcode: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;

  @Field(() => ID)
  product_id: number;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
