// src/exhumacion/entities/exhumacion.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Persona } from '../../persona/entities/persona.entity';
import { Nicho } from '../../nicho/entities/nicho.entity';

@Entity()
export class Exumacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo: string; // Ej: 002-2025-CMC-EXH

  @Column({ type: 'enum', enum: ['escrito', 'verbal'] })
  metodoSolicitud: string;

  // Relación con solicitante
  @ManyToOne(() => Persona)
  @JoinColumn()
  solicitante: Persona;

  @Column()
  parentesco: string;

  // Relación con fallecido
  @ManyToOne(() => Persona)
  @JoinColumn()
  fallecido: Persona;

  // Relación con nicho original
  @ManyToOne(() => Nicho)
  @JoinColumn()
  nichoOriginal: Nicho;

  // Datos de nueva sepultura
  @Column({ nullable: true })
  nuevoLugar?: string;

  @Column({ type: 'date' })
  fechaExhumacion: Date;

  @Column({ type: 'time' })
  horaExhumacion: string;

  @Column({ type: 'date' })
  fechaFallecimiento: Date;

  @Column({ type: 'date' })
  fechaInhumacion: Date;

  @Column({ default: false })
  aprobado: boolean;

  @Column({ nullable: true })
  aprobadoPor?: string;

  @Column({ type: 'json', nullable: true })
  requisitos: {
    certificadoDefuncion: { cumple: boolean; observacion?: string };
    certificadoInhumacion: { cumple: boolean; observacion?: string };
    copiaCI: { cumple: boolean; observacion?: string };
    tituloPropiedad: { cumple: boolean; observacion?: string };
    certificadoMunicipal: { cumple: boolean; observacion?: string };
    tiempoMinimo: { cumple: boolean; observacion?: string };
    ordenJudicial: { cumple: boolean; observacion?: string };
    pago: { cumple: boolean; observacion?: string };
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaSolicitud: Date;
}