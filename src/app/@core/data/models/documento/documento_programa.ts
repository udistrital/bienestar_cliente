import { TipoDocumentoPrograma } from './tipo_documento_programa';

export class DocumentoPrograma {
  Id: number;
  Activo: boolean;
  NumeroOrden: number;
  ProgramaId: number;
  PeriodoId: number;
  TipoDocumentoProgramaId: TipoDocumentoPrograma;
}
