import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModule } from '../src/modules/user/user.module';
import { User, UserDocument } from '../src/modules/user/user.model';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userModel;
  const mockedUser = {
    name: 'Uzumaki Naruto',
    email: 'uzumaki@konoha.com.br',
    password: '1234',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/quotation-api'),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userModel = moduleFixture.get<Model<UserDocument>>(
      getModelToken(User.name),
    );

    await userModel.deleteMany({});
  });

  it('should create a user with hash password', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(mockedUser)
      .expect(HttpStatus.CREATED)
      .then((res) => {
        const { _id, name, email, hashPassword } = res.body;
        expect(_id).toBeDefined();
        expect(name).toEqual('Uzumaki Naruto');
        expect(email).toEqual('uzumaki@konoha.com.br');
        expect(hashPassword).toBeDefined();
      });
  });

  it('should throw BadRequestException when someone try to register user with email already exists on database', async () => {
    await userModel.create(mockedUser);

    await request(app.getHttpServer())
      .post('/users')
      .send(mockedUser)
      .expect(HttpStatus.BAD_REQUEST)
      .then((res) => {
        const { message } = res.body;

        expect(message).toBe(
          'User with email uzumaki@konoha.com.br already exists',
        );
      });
  });
});
