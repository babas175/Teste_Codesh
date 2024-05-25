/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/auth/auth.service';
import { SignupDto } from '../src/auth/dto/signup.dto';
import { LoginDto } from '../src/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from '../src/users/entities/user.entity';

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: UsersService,
            useValue: {
              findOne: jest.fn(),
              create: jest.fn(),
            },
          },
          {
            provide: JwtService,
            useValue: {
              sign: jest.fn().mockReturnValue('mockedJwtToken'),
            },
          },
        ],
      }).compile();
  
      authService = module.get<AuthService>(AuthService);
      usersService = module.get<UsersService>(UsersService);
      jwtService = module.get<JwtService>(JwtService);
    });
  
    describe('getRootMessage', () => {
      it('should return the root message', async () => {
        const result = await authService.getRootMessage();
        expect(result).toEqual({ message: 'Fullstack Challenge 🏅 - Dictionary' });
      });
    });
  
    describe('validateUser', () => {
      it('should return user data without password if validation is successful', async () => {
        const user: User = { id: 1, email: 'test@test.com', password: 'hashedPassword', name: 'Test User', favorites: [], history: [] };
        jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
  
        const result = await authService.validateUser('test@test.com', 'password');
        const { password, ...expectedResult } = user;
        expect(result).toEqual(expectedResult);
      });
  
      it('should return null if validation fails', async () => {
        jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
  
        const result = await authService.validateUser('test@test.com', 'password');
        expect(result).toBeNull();
      });
    });
  
    describe('login', () => {
      it('should return token if login is successful', async () => {
        const user: User = { id: 1, email: 'test@test.com', password: 'hashedPassword', name: 'Test User', favorites: [], history: [] };
        const loginDto: LoginDto = { email: 'test@test.com', password: 'password' };
        jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
  
        const result = await authService.login(loginDto);
        expect(result).toEqual({ id: 1, name: 'Test User', token: 'Bearer mockedJwtToken' });
      });
  
      it('should throw UnauthorizedException if login fails', async () => {
        jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
  
        const loginDto: LoginDto = { email: 'test@test.com', password: 'password' };
        await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
      });
    });
  
    describe('signup', () => {
      it('should return token if signup is successful', async () => {
        const signupDto: SignupDto = {
            email: 'test@test.com', password: 'password',
            name: ''
        };
        const user: User = { id: 1, email: 'test@test.com', name: 'Test User', password: 'hashedPassword', favorites: [], history: [] };
        jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
        jest.spyOn(usersService, 'create').mockResolvedValue(user);
  
        const result = await authService.signup(signupDto);
        expect(result).toEqual({ id: 1, name: 'Test User', token: 'Bearer mockedJwtToken' });
      });
  
      it('should throw ConflictException if email is already in use', async () => {
        const signupDto: SignupDto = {
            email: 'test@test.com', password: 'password',
            name: ''
        };
        const existingUser: User = { id: 1, email: 'test@test.com', password: 'hashedPassword', name: 'Test User', favorites: [], history: [] };
        jest.spyOn(usersService, 'findOne').mockResolvedValue(existingUser);
  
        await expect(authService.signup(signupDto)).rejects.toThrow(ConflictException);
      });
  
      it('should throw InternalServerErrorException if an error occurs', async () => {
        const signupDto: SignupDto = {
            email: 'test@test.com', password: 'password',
            name: ''
        };
        jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
        jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
          throw new Error();
        });
  
        await expect(authService.signup(signupDto)).rejects.toThrow(InternalServerErrorException);
      });
    });
  });