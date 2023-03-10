import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ versionKey: false })
export class Category {
  @Prop()
  name: string;

  @Prop()
  color: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
