import "reflect-metadata";
import { ObjectType, Field, ID, Float } from "type-graphql";

@ObjectType()
export class Product {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Float)
  price: number;

  @Field(() => Boolean)
  in_stock: Boolean;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
