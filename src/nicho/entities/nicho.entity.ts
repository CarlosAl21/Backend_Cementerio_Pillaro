// src/nichos/entities/nicho.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('nichos')
export class Nicho {
  @PrimaryGeneratedColumn({ name: 'id_nicho' })
  idNicho: number;

  @Column({ type: 'int', name: 'id_cementerio' })
  idCementerio: number;

  @Column({ length: 50 })
  sector: string;

  @Column({ length: 10 })
  fila: string;

  @Column({ length: 10 })
  numero: string;

  @Column({ length: 20 })
  tipo: string;

  @Column({ length: 20 })
  estado: string;

  @Column({ type: 'date', name: 'fecha_construccion' })
  fechaConstruccion: Date;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @Column({ type: 'int', name: 'numero_pisos' })
  numeroPisos: number;
}