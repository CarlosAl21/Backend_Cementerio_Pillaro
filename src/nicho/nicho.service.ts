import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Nicho } from './entities/nicho.entity';
import { CreateNichoDto } from './dto/create-nicho.dto';
import { UpdateNichoDto } from './dto/update-nicho.dto';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';
@Injectable()
export class NichoService {
  constructor(
    @InjectRepository(Nicho)
    private readonly nichoRepository: Repository<Nicho>,
    @InjectRepository(HuecosNicho)
    private readonly huecosNichoRepository: Repository<HuecosNicho>,
  ) {}

  async create(createNichoDto: CreateNichoDto): Promise<Nicho> {
    try {
      const nicho = this.nichoRepository.create(createNichoDto);
      const nichoGuardado = await this.nichoRepository.save(nicho);

      const huecos: HuecosNicho[] = [];
      for (let i = 1; i <= nichoGuardado.num_huecos; i++) {
        const hueco = this.huecosNichoRepository.create({
          num_hueco: i,
          estado: 'Disponible', // o el estado que desees por defecto
          id_nicho: nichoGuardado as Nicho,
        });
        huecos.push(hueco);
      }
      await this.huecosNichoRepository.save(huecos);
      return nichoGuardado;

    } catch (error) {
      throw new InternalServerErrorException('Error al crear el nicho');
    }
  }

  async findAll(): Promise<Nicho[]> {
    try {
      return await this.nichoRepository.find({relations: ['id_cementerio', 'inhumaciones', 'propietarios_nicho', 'huecos', 'inhumaciones.id_fallecido', 'huecos.id_fallecido']});
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los nichos');
    }
  }

  async findOne(id: string): Promise<Nicho> {
    try {
      const nicho = await this.nichoRepository.findOne({ where: { id_nicho: id }, relations: ['id_cementerio', 'inhumaciones', 'propietarios_nicho', 'huecos', 'inhumaciones.id_fallecido', 'huecos.id_fallecido'] });
      if (!nicho) {
        throw new NotFoundException(`Nicho con ID ${id} no encontrado`);
      }
      return nicho;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al buscar el nicho');
    }
  }

  async update(id: string, updateDto: UpdateNichoDto): Promise<Nicho> {
    try {
      const nicho = await this.findOne(id);
      Object.assign(nicho, updateDto);
      return await this.nichoRepository.save(nicho);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el nicho');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.nichoRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Nicho con ID ${id} no encontrado`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el nicho');
    }
  }
}