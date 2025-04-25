import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Nicho } from 'src/nicho/entities/nicho.entity';

@Entity()
export class Exumacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codigo: string; // Ej: 002-2025-CMC-EXH

  @Column({ type: 'enum', enum: ['escrito', 'verbal'] })
  metodoSolicitud: string;

  // Relación con solicitante
  @Column()
  solicitante: string;

  @Column()
  parentesco: string;

  // Relación con fallecido
  @Column()
  fallecido: string;

  // Relación con nicho original
  @ManyToOne(() => Nicho, (nicho) => nicho.exumaciones)
  @JoinColumn({ name: 'id_nicho' })
  nichoOriginal: Nicho;

  // Datos de nueva sepultura
  @Column({ nullable: true })
  nuevoLugar?: string;

  @Column({ type: 'date' })
  fechaExhumacion: Date;

  @Column({ type: 'time' })
  horaExhumacion: string;

  @Column({ type: 'date' })
  fechaFallecimiento: Date;

  @Column({ type: 'date' })
  fechaInhumacion: Date;

  @Column({ default: false })
  aprobado: boolean;

  @Column({ nullable: true })
  aprobadoPor?: string;

  @Column({ type: 'json', nullable: true })
  requisitos: {
    certificadoDefuncion: { cumple: boolean; observacion?: string };
    certificadoInhumacion: { cumple: boolean; observacion?: string };
    copiaCI: { cumple: boolean; observacion?: string };
    tituloPropiedad: { cumple: boolean; observacion?: string };
    certificadoMunicipal: { cumple: boolean; observacion?: string };
    tiempoMinimo: { cumple: boolean; observacion?: string };
    ordenJudicial: { cumple: boolean; observacion?: string };
    pago: { cumple: boolean; observacion?: string };
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaSolicitud: Date;
}