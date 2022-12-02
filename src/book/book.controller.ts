import { Controller } from '@nestjs/common';
import { BookService } from './book.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateBookDto } from './dto/create-book.dto';
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @MessagePattern('db/book')
  Create(createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @MessagePattern('db/book/get')
  Get() {
    return this.bookService.findAll();
  }
}
