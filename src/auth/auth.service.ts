/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getRootMessage() {
    return { message: "Fullstack Challenge 🏅 - Dictionary" };
  }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ id: number; name: string; token: string }> {
    const { email, password } = loginDto;
    const user = await this.usersService.findOne(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      id: user.id,
      name: user.name,
      token: `Bearer ${token}`,
    };
  }
  
  async signup(signupDto: SignupDto): Promise<{ id: number; name: string; token: string }> {
    try {
      const existingUser = await this.usersService.findOne(signupDto.email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(signupDto.password, 10);
      const newUser: Partial<User> = {
        ...signupDto,
        password: hashedPassword,
        favorites: signupDto.favorites ?? [],
        history: signupDto.history ?? [],
      };

      const createdUser = await this.usersService.create(newUser);
      const payload = { email: createdUser.email, sub: createdUser.id };
      const token = this.jwtService.sign(payload);

      return {
        id: createdUser.id,
        name: createdUser.name,
        token: `Bearer ${token}`,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  }
}
