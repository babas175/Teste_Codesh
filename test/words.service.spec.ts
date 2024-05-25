/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { WordsService } from '../src/words/words.service';
import { HttpModule } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Word } from '../src/words/entities/word.entity';
import { UsersService } from '../src/users/users.service';

describe('WordsService', () => {
  let service: WordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        WordsService,
        {
          provide: getRepositoryToken(Word),
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WordsService>(WordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
