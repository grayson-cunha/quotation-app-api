import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../src/modules/category/category.module';
import { Model } from 'mongoose';
import {
  Category,
  CategoryDocument,
} from '../src/modules/category/category.model';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let categoryModel;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/quotation-api'),
        CategoryModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    categoryModel = moduleFixture.get<Model<CategoryDocument>>(
      getModelToken(Category.name),
    );

    await categoryModel.deleteMany({});
  });

  it('should create category', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({ name: 'Love', color: '#FF0000' })
      .expect(HttpStatus.CREATED)
      .then((res) => {
        const { _id, name, color } = res.body;
        expect(_id).toBeDefined();
        expect(name).toEqual('Love');
        expect(color).toEqual('#FF0000');
      });
  });

  it('should get all categories (GET)', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(HttpStatus.OK)
      .then((res) => {
        const categories = res.body;
        expect(categories).toHaveLength(0);
      });
  });

  it('should update category', async () => {
    const { _id } = await createCategory();

    await request(app.getHttpServer())
      .put(`/categories/${_id}`)
      .send({ name: 'Politics', color: '#FF0000' })
      .expect(HttpStatus.OK)
      .then((res) => {
        const { _id, name, color } = res.body;
        expect(_id).toBeDefined();
        expect(name).toEqual('Politics');
        expect(color).toEqual('#FF0000');
      });
  });

  it('should throw NotFoundException when updating category with invalid id', async () => {
    await request(app.getHttpServer())
      .put(`/categories/640b4798b39c5d41050d9719`)
      .send({ name: 'Politics', color: '#FF0000' })
      .expect(HttpStatus.NOT_FOUND)
      .then((res) => {
        const { message } = res.body;
        expect(message).toEqual('Category not found');
      });
  });

  it('should delete category', async () => {
    const { _id } = await createCategory();

    await request(app.getHttpServer())
      .delete(`/categories/${_id}`)
      .expect(200)
      .then((res) => {
        const { _id, name, color } = res.body;
        expect(_id).toBeDefined();
        expect(name).toEqual('Love');
        expect(color).toEqual('#FF0000');
      });
  });

  async function createCategory(): Promise<CategoryDocument> {
    const newCategory = new categoryModel({ name: 'Love', color: '#FF0000' });
    return newCategory.save();
  }
});
