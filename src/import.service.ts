/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './words/entities/word.entity';
import axios from 'axios';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
  ) {}

  async importWords() {
    const { data } = await axios.get('https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json');
    const words = Object.keys(data);

    for (const word of words) {
      let existingWord = await this.wordsRepository.findOne({ where: { word } });
      if (!existingWord) {
        existingWord = this.wordsRepository.create({ word });
        await this.wordsRepository.save(existingWord);
      }
    }
    console.log('Words imported successfully!');
  }
}
