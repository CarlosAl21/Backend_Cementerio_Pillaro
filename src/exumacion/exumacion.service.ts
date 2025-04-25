// src/exhumacion/exhumacion.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exumacion } from './entities/exumacion.entity';
import { CreateExumacionDto } from './dto/create-exumacion.dto';
import { UpdateExumacionDto } from './dto/update-exumacion.dto';
import { PersonaService } from '../persona/persona.service';
import { NichoService } from '../nicho/nicho.service';

@Injectable()
export class ExumacionService {
  constructor(
    @InjectRepository(Exumacion)
    private readonly exumacionRepository: Repository<Exumacion>,
    private readonly personaService: PersonaService,
    private readonly nichoService: NichoService,
  ) {}

  async create(createExumacionDto: CreateExumacionDto) {
    // Verificar que las entidades relacionadas existan
    const solicitante = await this.personaService.findOne(createExumacionDto.solicitanteId);
    const fallecido = await this.personaService.findOne(createExumacionDto.fallecidoId);
    const nichoOriginal = await this.nichoService.findOne(createExumacionDto.nichoOriginalId);

    // Generar código único
    const codigo = this.generarCodigoExhumacion();

    const exumacion = this.exumacionRepository.create({
      ...createExumacionDto,
      codigo,
      solicitante,
      fallecido,
      nichoOriginal,
    });

    return this.exumacionRepository.save(exumacion);
  }

  private generarCodigoExumacion(): string {
    const now = new Date();
    const year = now.getFullYear();
    const randomNum = Math.floor(100 + Math.random() * 900); // Número aleatorio de 3 dígitos
    return `${randomNum}-${year}-CMC-EXH`;
  }

  async findAll() {
    return this.exumacionRepository.find({
      relations: ['solicitante', 'fallecido', 'nichoOriginal'],
    });
  }

  async findOne(id: number) {
    const exumacion = await this.exumacionRepository.findOne({
      where: { id },
      relations: ['solicitante', 'fallecido', 'nichoOriginal'],
    });

    if (!exumacion) {
      throw new NotFoundException(`Exhumación con ID ${id} no encontrada`);
    }

    return exumacion;
  }

  async update(id: number, updateExumacionDto: UpdateExumacionDto) {
    const exumacion = await this.findOne(id);

    Object.assign(exumacion, updateExumacionDto);

    return this.exumacionRepository.save(exumacion);
  }

  async remove(id: number) {
    const exumacion = await this.findOne(id);
    return this.exumacionRepository.remove(exumacion);
  }

  async generarFormularioExumacion(id: number) {
    const exumacion = await this.findOne(id);
    
    // Aquí puedes generar el PDF o HTML del formulario basado en la entidad
    return {
      ...exumacion,
      // Puedes agregar formato específico para el formulario
    };
  }
}