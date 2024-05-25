/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Delete, Request, UseGuards, Query, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WordsService } from './words.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('words')
@ApiBearerAuth()
@Controller('entries/en')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':word')
  @ApiOperation({ summary: 'Get a word definition' })
  @ApiResponse({ status: 200, description: 'The word definition' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWord(@Param('word') word: string, @Request() req, @Res() res: Response) {
    const result = await this.wordsService.getWord(word);
    await this.wordsService.addWordToHistory(req.user.userId, word);
    res.set(result.headers);
    return res.json(result.data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Search for words' })
  @ApiResponse({ status: 200, description: 'Search results' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async searchWords(
    @Query('search') search: string,
    @Query('page') page = 1,
    @Query('limit') limit = 4,
    @Request() req,
    @Res() res: Response
  ) {
    const result = await this.wordsService.searchWords(search, +page, +limit);
    res.set(result.headers);
    return res.json(result.results);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':word/favorite')
  @ApiOperation({ summary: 'Favorite a word' })
  @ApiResponse({ status: 201, description: 'Word favorited successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async favoriteWord(@Param('word') word: string, @Request() req, @Res() res: Response) {
    await this.wordsService.favoriteWord(req.user.userId, word);
    return res.status(201).json({ message: 'Word favorited successfully' });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':word/unfavorite')
  @ApiOperation({ summary: 'Unfavorite a word' })
  @ApiResponse({ status: 200, description: 'Word unfavorited successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async unfavoriteWord(@Param('word') word: string, @Request() req, @Res() res: Response) {
    await this.wordsService.unfavoriteWord(req.user.userId, word);
    return res.status(200).json({ message: 'Word unfavorited successfully' });
  }
}
