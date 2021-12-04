import "reflect-metadata";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class ProductValues {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  value: string;

  @Field(() => ID)
  attribute_id: number;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
