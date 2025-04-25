export class CreatePersonaDto {
  /*datos de la bd*/
    cedula: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: Date;
    fecha_defuncion?: Date;
    lugar_defuncion?: string;
    causa_defuncion?: string;
    direccion: string;
    telefono: string;
    correo: string;
    tipo: string;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
  }
  