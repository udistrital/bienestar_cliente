import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from './app.state';
import { REDUCER_LIST } from './reducer.constants';
import { CoreService } from '../data/core.service';

@Injectable()

export class ListService {
  constructor(
    private coreService: CoreService,
    private store: Store<IAppState>
  ) { }

  public findPeriodoAcademico() {
    this.store.select(REDUCER_LIST.PeriodoAcademico).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.coreService.get('periodo/?query=Activo:true&limit=0')
            .subscribe(
              (result: any[]) => {
                console.info('Entro')
                console.info(result)
                this.addList(REDUCER_LIST.PeriodoAcademico, result);
              },
              error => {
                this.addList(REDUCER_LIST.PeriodoAcademico, []);
              },
            );
        }
      },
    );
  }
  findPeriodoActivo(){
    
  }
  private addList(type: string, object: Array<any>) {
    this.store.dispatch({
      type: type,
      payload: object,
    });
  }
}
