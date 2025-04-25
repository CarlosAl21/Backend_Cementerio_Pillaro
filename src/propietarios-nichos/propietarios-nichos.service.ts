import { Injectable } from '@nestjs/common';
import { CreatePropietariosNichoDto } from './dto/create-propietarios-nicho.dto';
import { UpdatePropietariosNichoDto } from './dto/update-propietarios-nicho.dto';

@Injectable()
export class PropietariosNichosService {
  create(createPropietariosNichoDto: CreatePropietariosNichoDto) {
    return 'This action adds a new propietariosNicho';
  }

  findAll() {
    return `This action returns all propietariosNichos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} propietariosNicho`;
  }

  update(id: number, updatePropietariosNichoDto: UpdatePropietariosNichoDto) {
    return `This action updates a #${id} propietariosNicho`;
  }

  remove(id: number) {
    return `This action removes a #${id} propietariosNicho`;
  }
}
