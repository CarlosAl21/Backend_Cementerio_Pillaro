import { Nicho } from 'src/nicho/entities/nicho.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('propietarios_nichos')
export class PropietarioNicho {
  @PrimaryGeneratedColumn('uuid')
  id_propietario_nicho: string;

  @ManyToOne(() => Persona, (persona) => persona.propietarios_nichos)
  persona: Persona;
  // id de nicho sin relacion directa hasta que se pueda unir 
  @ManyToOne(()=> Nicho, (nicho) => nicho.propietariosNicho)
  nicho: Nicho;

  @Column({ type: 'date' }) fecha_adquisicion: Date;
  @Column({ type: 'varchar', length: 100 }) tipo_documento: string;
  @Column({ type: 'varchar', length: 100 }) numero_documento: string;
  @Column({ type: 'varchar', length: 100 }) estado: string;
  @Column({ type: 'varchar', length: 255 }) observaciones: string;
  @Column({ type: 'timestamp' }) fecha_creacion: Date;
  @Column({ type: 'timestamp', nullable: true }) fecha_actualizacion: Date;

  @BeforeInsert()
  async setFechaCreacion() {
    this.fecha_creacion = new Date();
  }

  @BeforeUpdate()
  async setFechaActualizacion() {
    this.fecha_actualizacion = new Date();
  }


}
