import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
@Entity('inhumaciones')
export class Inhumacion {
  @PrimaryGeneratedColumn('uuid')
  id_inhumacion: string;

  @Column()
  id_nicho: string;

  @Column()
  id_fallecido: string;

  @Column('date')
  fecha_inhumacion: string;

  @Column('time')
  hora_inhumacion: string;

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

  @Column('date')
  fecha_creacion: string;

  @Column('date', { nullable: true })
  fecha_actualizacion: string;


  @BeforeInsert()
  async setFechaCreacion() {
    this.fecha_creacion = new Date().toISOString().split('T')[0];
  }

  @BeforeInsert()
  async estadoDefault() {
    if (!this.estado) {
      this.estado = 'Pendiente';
    }
  }

  @BeforeUpdate()
  async setFechaActualizacion() {
    this.fecha_actualizacion = new Date().toISOString().split('T')[0];
  }
}

