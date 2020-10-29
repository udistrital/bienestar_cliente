import { Injectable } from '@angular/core';
import { RequestManager } from '../../managers/requestManager';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  constructor(private rqManager: RequestManager) { }

  /* getEstudiantesInfo
   * Obtiene informacion básica de los estudiantes
  */
  public getEstudiantesInfo() {
    this.rqManager.setPath('BIENESTAR_JBPM_SERVICE');
    return this.rqManager.get('estudiantes_matriculados/2020/3').pipe(
      map(
        (res) => {
            if (res[0]) {
                return undefined;
            }
            return res;
        },
      ),
    )
  }

}
