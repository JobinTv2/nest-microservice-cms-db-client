import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashPassword = await this.authService
      .hashPassword(createUserDto.password)
      .then((res) => {
        return res;
      });

    const newUser = { ...createUserDto, password: hashPassword };
    const user = await this.userRepository.save(newUser);
    const { password, ...rest } = user;
    return rest;
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOneBy({ id: Number(id) });
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    if (user) {
      const result = await this.authService.generateJWT(user);
      const { password, ...rest } = await this.findOneByEmail(
        loginUserDto.email,
      );
      return {
        ...rest,
        token: result,
      };
    }
    throw new UnauthorizedException();
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.findOneByEmail(loginUserDto.email);
    if (!user) return null;
    const result = this.authService
      .comparePassword(loginUserDto.password, user.password)
      .then((match) => {
        if (match) {
          return user;
        }
        return false;
      });
    return result;
  }
}
