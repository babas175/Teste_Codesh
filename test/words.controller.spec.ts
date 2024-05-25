/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { WordsController } from '../src/words/words.controller';
import { WordsService } from '../src/words/words.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { Response } from 'express';
import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { of } from 'rxjs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Word } from '../src/words/entities/word.entity';
import { UsersService } from '../src/users/users.service';

describe('WordsController', () => {
  let controller: WordsController;
  let service: WordsService;
  let usersService: UsersService;
  let responseMock: Partial<Response>;

  beforeEach(async () => {
    responseMock = {
      set: jest.fn(),
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordsController],
      providers: [
        WordsService,
        UsersService,
        {
          provide: getRepositoryToken(Word),
          useValue: {},
        },
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: jest.fn((context: ExecutionContext) => {
              const req = context.switchToHttp().getRequest();
              req.user = { userId: 1 };
              return true;
            }),
          },
        },
      ],
    })
      .overrideProvider(WordsService)
      .useValue({
        getWord: jest.fn().mockResolvedValue({ data: { word: 'example' }, headers: {} }),
        addWordToHistory: jest.fn().mockResolvedValue(undefined),
        searchWords: jest.fn().mockResolvedValue({ results: [], headers: {} }),
        favoriteWord: jest.fn().mockResolvedValue(undefined),
        unfavoriteWord: jest.fn().mockResolvedValue(undefined),
      })
      .overrideProvider(UsersService)
      .useValue({
        findById: jest.fn().mockResolvedValue({ userId: 1, history: [], favorites: [] }),
        save: jest.fn().mockResolvedValue(undefined),
      })
      .compile();

    controller = module.get<WordsController>(WordsController);
    service = module.get<WordsService>(WordsService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWord', () => {
    it('should return word definition and add to history', async () => {
      const word = 'example';
      const req = { user: { userId: 1 } };
      const res = responseMock as Response;

      const result = await controller.getWord(word, req, res);

      expect(service.getWord).toHaveBeenCalledWith(word);
      expect(service.addWordToHistory).toHaveBeenCalledWith(1, word);
      expect(res.set).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ word: 'example' });
    });
  });

  describe('searchWords', () => {
    it('should return search results', async () => {
      const search = 'test';
      const page = 1;
      const limit = 4;
      const req = { user: { userId: 1 } };
      const res = responseMock as Response;

      const result = await controller.searchWords(search, page, limit, req, res);

      expect(service.searchWords).toHaveBeenCalledWith(search, page, limit);
      expect(res.set).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('favoriteWord', () => {
    it('should favorite a word', async () => {
      const word = 'example';
      const req = { user: { userId: 1 } };
      const res = responseMock as Response;

      const result = await controller.favoriteWord(word, req, res);

      expect(service.favoriteWord).toHaveBeenCalledWith(1, word);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Word favorited successfully' });
    });
  });

  describe('unfavoriteWord', () => {
    it('should unfavorite a word', async () => {
      const word = 'example';
      const req = { user: { userId: 1 } };
      const res = responseMock as Response;

      const result = await controller.unfavoriteWord(word, req, res);

      expect(service.unfavoriteWord).toHaveBeenCalledWith(1, word);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Word unfavorited successfully' });
    });
  });
});
