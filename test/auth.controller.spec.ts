/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { SignupDto } from '../src/auth/dto/signup.dto';
import { LoginDto } from '../src/auth/dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getRootMessage: jest.fn().mockReturnValue('Welcome to the Auth Service'),
            login: jest.fn().mockResolvedValue({ accessToken: 'mockedToken' }),
            signup: jest.fn().mockResolvedValue({ id: 1, username: 'testuser' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('getRootMessage', () => {
    it('should return the root message', () => {
      const result = authController.getRootMessage();
      expect(result).toBe('Welcome to the Auth Service');
      expect(authService.getRootMessage).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return access token on successful login', async () => {
      const loginDto: LoginDto = { email: 'testuser', password: 'testpassword' };
      const result = await authController.login(loginDto);
      expect(result).toEqual({ accessToken: 'mockedToken' });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('signup', () => {
    it('should return user details on successful signup', async () => {
      const signupDto: SignupDto = {
          email: 'testuser', password: 'testpassword',
          name: ''
      };
      const result = await authController.signup(signupDto);
      expect(result).toEqual({ id: 1, username: 'testuser' });
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
    });
  });
});
