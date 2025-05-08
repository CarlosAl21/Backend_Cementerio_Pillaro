import { Inhumacion } from 'src/inhumaciones/entities/inhumacion.entity';
import { PropietarioNicho } from 'src/propietarios-nichos/entities/propietarios-nicho.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate, In } from 'typeorm';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn('uuid')
  id_persona: string;

  @Column({ type: 'varchar', length: 100 }) cedula: string;
  @Column({ type: 'varchar', length: 100 }) nombres: string;
  @Column() apellidos: string;
  @Column({ type: 'date' }) fecha_nacimiento: Date;
  @Column({ type: 'date', nullable: true }) fecha_defuncion: Date;
  @Column({ type: 'varchar', length: 100, nullable: true }) lugar_defuncion: string;
  @Column({ type: 'varchar', length: 100 ,nullable: true }) causa_defuncion: string;
  @Column({ type: 'varchar', length: 100 }) direccion: string;
  @Column({ type: 'varchar', length: 100 }) telefono: string;
  @Column({ type: 'varchar', length: 100 }) correo: string;
  @Column({ type: 'varchar', length: 100 }) tipo: string;
  @Column({ type: 'timestamp' }) fecha_creacion: Date;
  @Column({ type: 'timestamp', nullable: true }) fecha_actualizacion: Date;

  @OneToMany(() => PropietarioNicho, (propietarioNicho) => propietarioNicho.persona)
  propietarios_nichos: PropietarioNicho[];

  @OneToMany(() => Inhumacion, (inhumacion) => inhumacion.id_fallecido)
  inhumaciones: Inhumacion[];

  @BeforeInsert()
  async setFechaCreacion() {
    this.fecha_creacion = new Date();
  }
  @BeforeUpdate()
  async setFechaActualizacion() {
    this.fecha_actualizacion = new Date();
  }
}
