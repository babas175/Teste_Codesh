/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    password: 'hashedPassword',
    name: 'Test User',
    favorites: ['example'],
    history: [{ word: 'example', added: new Date() }],
  };

  const mockUserRepository = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user: Partial<User> = {
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test User',
      };
      expect(await service.create(user)).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith(user);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findOne', () => {
    it('should find a user by email', async () => {
      const email = 'test@test.com';
      expect(await service.findOne(email)).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const userId = 1;
      expect(await service.findById(userId)).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });

  describe('save', () => {
    it('should save a user', async () => {
      expect(await service.save(mockUser)).toEqual(mockUser);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getHistory', () => {
    it('should return the user history', async () => {
      const result = await service.getHistory(1, 1, 4);
      expect(result.results).toHaveLength(1);
      expect(result.totalDocs).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrev).toBe(false);
    });
  });

  describe('getFavorites', () => {
    it('should return the user favorites', async () => {
      const result = await service.getFavorites(1, 1, 4);
      expect(result.results).toHaveLength(1);
      expect(result.totalDocs).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrev).toBe(false);
    });
  });

  describe('addFavorite', () => {
    it('should add a word to the user favorites', async () => {
      mockUserRepository.save.mockResolvedValueOnce({
        ...mockUser,
        favorites: [...mockUser.favorites, 'newWord'],
      });
      const result = await service.addFavorite(1, 'newWord');
      expect(result.favorites).toContain('newWord');
    });
  });

  describe('removeFavorite', () => {
    it('should remove a word from the user favorites', async () => {
      mockUserRepository.save.mockResolvedValueOnce({
        ...mockUser,
        favorites: mockUser.favorites.filter(fav => fav !== 'example'),
      });
      const result = await service.removeFavorite(1, 'example');
      expect(result.favorites).not.toContain('example');
    });
  });

  describe('addWordToHistory', () => {
    it('should add a word to the user history', async () => {
      const newHistoryItem = { word: 'newWord', added: new Date() };
      mockUserRepository.save.mockResolvedValueOnce({
        ...mockUser,
        history: [...mockUser.history, newHistoryItem],
      });
      const result = await service.addWordToHistory(1, 'newWord');
      expect(result.history).toContainEqual(newHistoryItem);
    });
  });
});
