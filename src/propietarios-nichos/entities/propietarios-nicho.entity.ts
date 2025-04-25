import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('propietarios_nichos')
export class PropietarioNicho {
  @PrimaryGeneratedColumn()
  id_propietario_nicho: number;

  @Column() id_persona: number;

  // id de nicho sin relacion directa hasta que se pueda unir
  @Column() id_nicho: number;

  @Column({ type: 'date' }) fecha_adquisicion: Date;
  @Column() tipo_documento: string;
  @Column() numero_documento: string;
  @Column() estado: string;
  @Column('text') observaciones: string;
  @Column({ type: 'timestamp' }) fecha_creacion: Date;
  @Column({ type: 'timestamp' }) fecha_actualizacion: Date;
}
