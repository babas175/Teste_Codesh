/* eslint-disable prettier/prettier */
import { Controller, Get, Request, UseGuards, Post, Param, Delete, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/history')
  async getHistory(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 4
  ) {
    return this.usersService.getHistory(req.user.userId, +page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/favorites')
  async getFavorites(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 4
  ) {
    return this.usersService.getFavorites(req.user.userId, +page, +limit);
  }


  @UseGuards(JwtAuthGuard)
  @Post('me/favorites/:word')
  async addFavorite(@Request() req, @Param('word') word: string) {
    return this.usersService.addFavorite(req.user.userId, word);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/favorites/:word')
  async removeFavorite(@Request() req, @Param('word') word: string) {
    return this.usersService.removeFavorite(req.user.userId, word);
  }
}
