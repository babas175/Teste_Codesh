/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';


describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getHistory: jest.fn(),
            getFavorites: jest.fn(),
            addFavorite: jest.fn(),
            removeFavorite: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { userId: 1 };
          return true;
        }),
      })
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getProfile', () => {
    it('should return the profile of the user', () => {
      const req = { user: { userId: 1 } };
      const result = usersController.getProfile(req);
      expect(result).toEqual(req.user);
    });
  });

  describe('getHistory', () => {
    it('should return the user history', async () => {
      const req = { user: { userId: 1 } };
      const result = [{ word: 'example', date: new Date() }];
      jest.spyOn(usersService, 'getHistory').mockResolvedValue(result);

      expect(await usersController.getHistory(req, 1, 4)).toBe(result);
      expect(usersService.getHistory).toHaveBeenCalledWith(1, 1, 4);
    });
  });

  describe('getFavorites', () => {
    it('should return the user favorites', async () => {
      const req = { user: { userId: 1 } };
      const result = ['example'];
      jest.spyOn(usersService, 'getFavorites').mockResolvedValue(result);

      expect(await usersController.getFavorites(req, 1, 4)).toBe(result);
      expect(usersService.getFavorites).toHaveBeenCalledWith(1, 1, 4);
    });
  });

  describe('addFavorite', () => {
    it('should add a word to the user favorites', async () => {
      const req = { user: { userId: 1 } };
      const word = 'example';
      const result = { userId: 1, word: 'example' };
      jest.spyOn(usersService, 'addFavorite').mockResolvedValue(result);

      expect(await usersController.addFavorite(req, word)).toBe(result);
      expect(usersService.addFavorite).toHaveBeenCalledWith(1, word);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a word from the user favorites', async () => {
      const req = { user: { userId: 1 } };
      const word = 'example';
      const result = { userId: 1, word: 'example' };
      jest.spyOn(usersService, 'removeFavorite').mockResolvedValue(result);

      expect(await usersController.removeFavorite(req, word)).toBe(result);
      expect(usersService.removeFavorite).toHaveBeenCalledWith(1, word);
    });
  });
});
