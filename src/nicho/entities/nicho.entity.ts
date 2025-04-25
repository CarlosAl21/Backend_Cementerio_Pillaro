// src/nichos/entities/nicho.entity.ts
import { Cementerio } from 'src/cementerio/entities/cementerio.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Exumacion } from 'src/exumacion/entities/exumacion.entity';

@Entity('nichos')
export class Nicho {
  @PrimaryGeneratedColumn('uuid')
  idNicho: string;

  @ManyToOne(() => Cementerio, (cementerio) => cementerio.nichos, { eager: true })
  @JoinColumn({ name: 'id_cementerio' })
  idCementerio: Cementerio;

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

  @Column({ type: 'int', name: 'numero_pisos' })
  numeroPisos: number;

  @CreateDateColumn({ type: 'date' })
  fechaCreacion: Date;

  @UpdateDateColumn({ type: 'date', nullable: true })
  fechaActualizacion: Date;

  @OneToMany(() => Exumacion, (exumacion) => exumacion.nichoOriginal)
  exumaciones: Exumacion[];

  @BeforeInsert()
  async setFechaCreacion() {
    this.fechaCreacion = new Date();
  }

  @BeforeInsert()
  async estadoDefault() {
    this.estado = 'Activo';
  }

  @BeforeUpdate()
  async setFechaActualizacion() {
    this.fechaActualizacion = new Date();
  }

}