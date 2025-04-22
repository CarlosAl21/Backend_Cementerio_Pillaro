import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    console.log('UserService initialized');
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      return {error: error, mensaje: 'Error en la creacion'};
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({where: {id_user: id} });
      if (!user) {
        return { error: 'User not found' };
      }
      return user;
    } catch (error) {
      console.log(error);
      return { error: error, mensaje: 'Error en la busqueda' };
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({where: {id_user: id} });
      if (!user) {
        return { error: 'User not found' };
      }
      this.userRepository.merge(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      return { error: error, mensaje: 'Error en la actualizacion' };
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOne({where: {id_user: id} });
      if (!user) {
        return { error: 'User not found' };
      }
      return await this.userRepository.remove(user);
    } catch (error) {
      console.log(error);
      return { error: error, mensaje: 'Error en la eliminacion' };
    }
  }
}
