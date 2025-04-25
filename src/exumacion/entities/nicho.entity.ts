// src/nicho/entities/nicho.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Nicho {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numero: string;

  @Column()
  cementerio: string;

  @Column()
  sector: string;

  @Column({ type: 'date' })
  fechaAdquisicion: Date;

  @Column()
  tipo: 'propio' | 'arrendado';

  @Column({ nullable: true })
  titularId?: string; // Relación con Persona
}