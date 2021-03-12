import { REDUCER_LIST } from '../reducer.constants';

export class ListReducer {
  constructor() {
  }
  static ListReducerGenero(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.Genero:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerGrupoSanguineo(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.Sanguineo:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoICFES(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.ICFES:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerFactorRH(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.RH:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerEPS(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.EPS:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerClasificacionNivelIdioma(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.ClasificacionNivelIdioma:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerEstadoInscripcion(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.EstadoInscripcion:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerEstadoCivil(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.EstadoCivil:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerGrupoEtnico(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.GrupoEtnico:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerIdioma(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.Idioma:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerLineaInvestigacion(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.LineaInvestigacion:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerPais(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.Pais:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerCiudad(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.Ciudad:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerLugar(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.Lugar:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerMetodologia(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.Metodologia:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerNivelFormacion(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.NivelFormacion:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerNivelIdioma(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.NivelIdioma:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerProgramaAcademico(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.ProgramaAcademico:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoContacto(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.TipoContacto:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoDiscapacidad(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.TipoDiscapacidad:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoLugar(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.TipoLugar:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTitulacion(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.Titulacion:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoIdentificacion(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.TipoIdentificacion:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoProyecto(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.TipoProyecto:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerGrupoInvestigacion(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.GrupoInvestigacion:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerPeriodoAcademico(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.PeriodoAcademico:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerLocalidadesBogota(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.LocalidadesBogota:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoColegio(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.TipoColegio:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerSemestresSinEstudiar(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.SemestresSinEstudiar:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerMediosEnteroUniversidad(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.MediosEnteroUniversidad:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerSePresentaAUniversidadPor(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.SePresentaAUniversidadPor:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoInscripcionUniversidad(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.TipoInscripcionUniversidad:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoDedicacion(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.TipoDedicacion:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoVinculacion(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.TipoVinculacion:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoOrganizacion(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.TipoOrganizacion:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerCargo(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.Cargo:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerDocumentoPrograma(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.DocumentoPrograma:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerDescuentoDependencia(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.DescuentoDependencia:
        return [...state, action.payload];
      default:
        return state;
    }
  }
}
