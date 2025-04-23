import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('inhumaciones')
export class Inhumacion {
  @PrimaryGeneratedColumn()
  id_inhumacion: number;

  @Column()
  id_nicho: number;

  @Column()
  id_fallecido: number;

  @Column('date')
  fecha_inhumacion: string;

  @Column('time')
  hora_inhumacion: string;

  @Column('date')
  fecha_creacion: string;

  @Column('date')
  fecha_actualizacion: string;

  @Column()
  solicitante: string;

  @Column()
  responsable_inhumacion: string;

  @Column()
  observaciones: string;

  @Column()
  estado: string;

  @Column()
  codigo_inhumacion: string;
}

