import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, CategoryDocument } from './category.model';

@Controller('/categories')
export class CategoryController {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  @Post()
  create(@Body() category: Category): Promise<Category> {
    const createdCategory = new this.categoryModel(category);
    return createdCategory.save();
  }

  @Get()
  async get() {
    return this.categoryModel.find();
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() dataCategory: Category) {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      dataCategory,
      {
        new: true,
      },
    );

    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }

    return updatedCategory;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const category = await this.categoryModel.findById(id);

    await category.delete();

    return category;
  }
}
