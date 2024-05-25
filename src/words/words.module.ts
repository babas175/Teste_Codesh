/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { Word } from './entities/word.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Word]),
    UsersModule,
  ],
  providers: [WordsService],
  controllers: [WordsController],
})
export class WordsModule {}
