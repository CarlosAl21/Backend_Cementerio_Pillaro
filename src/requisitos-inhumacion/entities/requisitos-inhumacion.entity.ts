import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Persona } from './persona.entity';
import { Fosa } from './fosa.entity';

@Entity()
export class RequisitosInhumacion {
 @PrimaryGeneratedColumn()
  id: number;

  // A) Datos institucionales
  @Column()
  cementerio: string;

  @Column()
  pantoneroACargo: string;

  // B) Método de solicitud
  @Column({ default: 'escrita' })
  metodoSolicitud: string;

  // C) Datos del solicitante
  @ManyToOne(() => Persona)
  solicitante: Persona;

  @Column({ nullable: true })
  observacionSolicitante: string;

  // D) Checklist de requisitos
  @Column({ default: false })
  copiaCertificadoDefuncion: boolean;

  @Column({ default: false })
  informeEstadisticoINEC: boolean;

  @Column({ default: false })
  copiaCedula: boolean;

  @Column({ default: false })
  pagoTasaInhumacion: boolean;

  @Column({ default: false })
  copiaTituloPropiedadNicho: boolean;

  // E) Datos del nicho/fosa/sillio
  @ManyToOne(() => Fosa)
  fosa: Fosa;

  @Column()
  propiedad: string; // 'propio' o 'arrendado'

  @Column()
  firmaAceptacionSepulcro: string;

  // F) Datos del fallecido
  @ManyToOne(() => Persona)
  fallecido: Persona;

  @Column()
  causaMuerte: string;

  @Column()
  fechaInhumacion: Date;

  @Column()
  horaInhumacion: string;
}
