/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WordsModule } from './words/words.module';
import { User } from './users/entities/user.entity';
import { Word } from './words/entities/word.entity';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Chapeco2022',
      database: 'codesh',
      entities: [User, Word],
      synchronize: true,
      logging: true,
    }),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: 'localhost', // substitua pelo host do seu Redis
        port: 6379,        // substitua pela porta do seu Redis
      }),
    }),
    AuthModule,
    UsersModule,
    WordsModule,
  ],
})
export class AppModule {}
