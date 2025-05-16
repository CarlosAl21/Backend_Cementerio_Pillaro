// src/huecos-nichos/entities/huecos-nicho.entity.ts
import { Nicho } from 'src/nicho/entities/nicho.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Persona } from 'src/personas/entities/persona.entity';
import { PropietarioNicho } from 'src/propietarios-nichos/entities/propietarios-nicho.entity';

@Entity('huecos_nichos')
export class HuecosNicho{
  @PrimaryGeneratedColumn('uuid')
  idDetalleHueco: string;

  @ManyToOne(() => Nicho, (nicho) => nicho.huecos, { eager: true })
  @JoinColumn({ name: 'idNicho' })
  idNicho: Nicho;

  @Column({ type: 'int', name: 'numHueco' })
  numHueco: number;

  @Column({ length: 20 })
  estado: string;
  
  @CreateDateColumn({ type: 'date' })
  fechaCreacion: Date;

  @UpdateDateColumn({ type: 'date', nullable: true })
  fechaActualizacion: Date;

  @ManyToOne(() => Persona, { nullable: true, eager: true }) 
  @JoinColumn({ name: 'idFallecidoInhumado' })
  idFallecidoInhumado: Persona;

  @BeforeInsert()
  async setFechaCreacion() {
    this.fechaCreacion = new Date();
  }

  @BeforeInsert()
  async estadoDefault() {
    this.estado = 'Ocupado';
  }

  @BeforeUpdate()
  async setFechaActualizacion() {
    this.fechaActualizacion = new Date();
  }

}