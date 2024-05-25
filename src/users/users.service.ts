/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async getHistory(userId: number, page: number, limit: number): Promise<any> {
    const user = await this.findById(userId);
    const totalDocs = user.history.length;
    const totalPages = Math.ceil(totalDocs / limit);
    const results = user.history
      .map(item => ({
        ...item,
        added: new Date(item.added) 
      }))
      .sort((a, b) => b.added.getTime() - a.added.getTime())
      .slice((page - 1) * limit, page * limit)
      .map(item => ({ word: item.word, added: item.added }));

    return {
      results,
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async getFavorites(userId: number, page: number, limit: number): Promise<any> {
    const user = await this.findById(userId);
    const totalDocs = user.favorites.length;
    const totalPages = Math.ceil(totalDocs / limit);
    const results = user.favorites
      .map(item => ({
        word: item,
        added: new Date() 
      }))
      .sort((a, b) => b.added.getTime() - a.added.getTime())
      .slice((page - 1) * limit, page * limit);

    return {
      results,
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }


  async addFavorite(userId: number, word: string): Promise<any> {
    const user = await this.findById(userId);
    user.favorites.push(word);
    return this.usersRepository.save(user);
  }

  async removeFavorite(userId: number, word: string): Promise<any> {
    const user = await this.findById(userId);
    user.favorites = user.favorites.filter(fav => fav !== word);
    return this.usersRepository.save(user);
  }

  async addWordToHistory(userId: number, word: string): Promise<any> {
    const user = await this.findById(userId);
    user.history.push({ word, added: new Date() });
    return this.usersRepository.save(user);
  }
}

