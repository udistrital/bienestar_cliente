import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  constructor() { }

  findEstudiante(codigo: string) {
    throw new Error('Method not implemented.');
    /* this.store.select(REDUCER_LIST.Genero).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:6')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.Genero, result);
              },
              error => {
                this.addList(REDUCER_LIST.Genero, []);
              },
           );
        }
      },
    ); */
  }
}
