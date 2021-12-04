import "reflect-metadata";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class ProductAttributes {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => ID)
  product_id: number;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
