import { Exumacion } from 'src/exumacion/entities/exumacion.entity';
import { Nicho } from 'src/nicho/entities/nicho.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
@Entity('inhumaciones')
export class Inhumacion {
  @PrimaryGeneratedColumn('uuid')
  id_inhumacion: string;

  @ManyToOne(() => Nicho, (nicho) => nicho.inhumaciones)
  @JoinColumn({ name: 'id_nicho' })
  id_nicho: Nicho;

  @ManyToOne(() => Persona, (persona) => persona.inhumaciones)
  @JoinColumn({ name: 'id_fallecido' })
  id_fallecido: Persona;

  @Column('date')
  fecha_inhumacion: string;

  @Column('time')
  hora_inhumacion: string;

  @Column()
  solicitante: string;

  @Column()
  responsable_inhumacion: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column()
  estado: string;

  @Column()
  codigo_inhumacion: string;

  @Column('date')
  fecha_creacion: string;

  @Column('date', { nullable: true })
  fecha_actualizacion: string;
  
  @OneToMany(() => Exumacion, (exumacion) => exumacion.id_inhumacion)
  exumaciones: Exumacion[];

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

