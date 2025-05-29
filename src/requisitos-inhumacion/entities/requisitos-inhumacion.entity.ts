import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { HuecosNicho } from 'src/huecos-nichos/entities/huecos-nicho.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Cementerio } from 'src/cementerio/entities/cementerio.entity';

@Entity()
export class RequisitosInhumacion {
 @PrimaryGeneratedColumn('uuid')
  id_requsitoInhumacion: string;

  // A) Datos institucionales
  @ManyToOne(() => Cementerio, (cementerio) => cementerio.requisitos_inhumacion)
  @JoinColumn({ name: 'id_cementerio' })
  id_cementerio: Cementerio;

  @Column()
  pantoneroACargo: string;

  // B) Método de solicitud
  @Column({ default: 'escrita' })
  metodoSolicitud: string;

  // C) Datos del solicitante
  @ManyToOne(() => Persona, (persona) => persona.requisitos_inhumacion_solicitante)
  @JoinColumn({ name: 'id_solicitante' })
  id_solicitante: Persona;

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
  @ManyToOne(() => HuecosNicho, (huecosNicho) => huecosNicho.requisitos_inhumacion)
  @JoinColumn({ name: 'id_hueco_nicho' })
  id_hueco_nicho: HuecosNicho;


  @Column()
  firmaAceptacionSepulcro: string;

  // F) Datos del fallecido
  @ManyToOne(() => Persona, (persona) => persona.requisitos_inhumacion)
  @JoinColumn({ name: 'id_fallecido' })
  id_fallecido: Persona;

  @Column()
  fechaInhumacion: Date;

  @Column()
  horaInhumacion: string;
}
