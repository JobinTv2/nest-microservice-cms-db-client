import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}
  create(createBookDto: CreateBookDto) {
    const data = { createdAt: new Date(), ...createBookDto };
    return this.bookRepository.save(data);
  }

  findAll(options: IPaginationOptions) {
    const results = this.bookRepository.find();
    return paginate<Book>(this.bookRepository, options);
  }

  async saveJson(data) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      try {
        await this.bookRepository.save({
          ...item,
          createdAt: new Date(),
          is_sold: item.is_sold.toLowerCase(),
        });
      } catch (e) {
        return { error: e };
      }
    }
    return true;
  }
}
