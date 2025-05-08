import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  id_persona: number;

  @Column() cedula: string;
  @Column() nombres: string;
  @Column() apellidos: string;
  @Column({ type: 'date' }) fecha_nacimiento: Date;
  @Column({ type: 'date', nullable: true }) fecha_defuncion: Date;
  @Column({ nullable: true }) lugar_defuncion: string;
  @Column({ nullable: true }) causa_defuncion: string;
  @Column() direccion: string;
  @Column() telefono: string;
  @Column() correo: string;
  @Column() tipo: string;
  @Column({ type: 'timestamp' }) fecha_creacion: Date;
  @Column({ type: 'timestamp' }) fecha_actualizacion: Date;
}
