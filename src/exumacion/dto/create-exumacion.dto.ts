// src/exhumacion/dto/create-exhumacion.dto.ts
export class CreateExumacionDto {
    metodoSolicitud: 'escrito' | 'verbal';
    solicitanteId: string;
    parentesco: string;
    fallecidoId: string;
    nichoOriginalId: string;
    nuevoLugar?: string;
    fechaExhumacion: Date;
    horaExhumacion: string;
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
  }