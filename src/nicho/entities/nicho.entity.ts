// src/nichos/entities/nicho.entity.ts
import { Cementerio } from 'src/cementerio/entities/cementerio.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Exumacion } from 'src/exumacion/entities/exumacion.entity';
import { Inhumacion } from 'src/inhumaciones/entities/inhumacion.entity';
import { PropietarioNicho } from 'src/propietarios-nichos/entities/propietarios-nicho.entity';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';

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

  @CreateDateColumn({ type: 'date' })
  fechaCreacion: Date;

  @UpdateDateColumn({ type: 'date', nullable: true })
  fechaActualizacion: Date;

  @OneToMany(() => Exumacion, (exumacion) => exumacion.nichoOriginal)
  exumaciones: Exumacion[];

  @OneToMany(() => Inhumacion, (inhumacion) => inhumacion.id_nicho)
  inhumaciones: Inhumacion[];

  @OneToMany(() => PropietarioNicho, (propietarioNicho) => propietarioNicho.nicho)
  propietariosNicho: PropietarioNicho[];

  @OneToMany(() => HuecosNicho, (hueco) => hueco.idNicho)
  huecos: HuecosNicho[];

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