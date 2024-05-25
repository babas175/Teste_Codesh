/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportService } from './import.service';
import { Word } from './words/entities/word.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Word]),
  ],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
