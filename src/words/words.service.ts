/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './entities/word.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class WordsService {
  private readonly apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    @InjectRepository(Word) private readonly wordRepository: Repository<Word>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getWord(word: string): Promise<any> {
    const start = Date.now();
    const cachedWord = await this.cacheManager.get(word);
    if (cachedWord) {
      return {
        data: cachedWord,
        headers: {
          'x-cache': 'HIT',
          'x-response-time': `${Date.now() - start}ms`,
        },
      };
    }

    const response = await lastValueFrom(
      this.httpService.get(`${this.apiUrl}/${word}`)
    );

    await this.cacheManager.set(word, response.data, 3600); 

    return {
      data: response.data,
      headers: {
        'x-cache': 'MISS',
        'x-response-time': `${Date.now() - start}ms`,
      },
    };
  }

  async addWordToHistory(userId: number, word: string): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user.history.some(item => item.word === word)) {
      user.history.push({ word, added: new Date() });
      await this.usersService.save(user);
    }

    let existingWord = await this.wordRepository.findOne({ where: { word } });
    if (!existingWord) {
      existingWord = this.wordRepository.create({ word });
      await this.wordRepository.save(existingWord);
    }
  }

  async getViewedWords(userId: number): Promise<Word[]> {
    const user = await this.usersService.findById(userId);
    const words = await Promise.all(
      user.history.map(async item => await this.wordRepository.findOne({ where: { word: item.word } }))
    );
    return words.filter(word => word !== undefined) as Word[];
  }

  async favoriteWord(userId: number, word: string): Promise<void> {
    await this.usersService.addFavorite(userId, word);
  }

  async unfavoriteWord(userId: number, word: string): Promise<void> {
    await this.usersService.removeFavorite(userId, word);
  }

  async searchWords(search: string, page: number, limit: number): Promise<any> {
    const start = Date.now();
    const cacheKey = `search-${search}-${page}-${limit}`;
    const cachedResults = await this.cacheManager.get<Record<string, any>>(cacheKey);
    if (cachedResults) {
      return {
        ...cachedResults,
        headers: {
          'x-cache': 'HIT',
          'x-response-time': `${Date.now() - start}ms`,
        },
      };
    }

    const response = await lastValueFrom(
      this.httpService.get(`${this.apiUrl}/${search}`)
    );
    const allResults = response.data.map(entry => entry.word);
    const totalDocs = allResults.length;
    const totalPages = Math.ceil(totalDocs / limit);
    const results = allResults.slice((page - 1) * limit, page * limit);

    const result = {
      results,
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    await this.cacheManager.set(cacheKey, result, 3600); 
    return {
      ...result,
      headers: {
        'x-cache': 'MISS',
        'x-response-time': `${Date.now() - start}ms`,
      },
    };
  }
}
