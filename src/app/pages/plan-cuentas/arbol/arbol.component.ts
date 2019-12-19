import { Component, Input, EventEmitter, Output, OnChanges, ViewChildren, ElementRef, Renderer2 } from '@angular/core';
import {
  NbGetters,
  NbSortDirection,
  NbTreeGridRowComponent,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbSortRequest,
} from '@nebular/theme';
import { Observable, forkJoin } from 'rxjs';
import { ArbolHelper } from '../../../@core/helpers/arbol/arbolHelper';
import { RubroHelper } from '../../../@core/helpers/rubros/rubroHelper';
import { registerLocaleData } from '@angular/common';
import locales from '@angular/common/locales/es-CO';

registerLocaleData(locales, 'co');

interface EstructuraArbolRubrosApropiaciones {
  Codigo: string;
  Descripcion?: string;
  ValorInicial: number;
  Hijos?: EstructuraArbolRubrosApropiaciones[];
  Movimientos?: string[];
  Padre?: string;
  UnidadEjecutora: number;
  Estado?: string;
  IsLeaf: boolean;
  expanded?: boolean;
  isHighlighted?: boolean;
  data?: EstructuraArbolRubrosApropiaciones;
  children?: EstructuraArbolRubrosApropiaciones[];
}

@Component({
  selector: 'ngx-arbol',
  templateUrl: './arbol.component.html',
  styleUrls: ['./arbol.component.scss'],
})
export class ArbolComponent implements OnChanges {
  @Output() rubroSeleccionado = new EventEmitter();
  @Input() updateSignal: Observable<string[]>;
  @Input() optionSelect: string;
  @Input() vigencia: string;
  @Input() externalSearch: string;
  @Input('paramsFieldsName') paramsFieldsName: object;
  opcionSeleccionada: string;
  vigenciaSeleccionada: string;
  @ViewChildren(NbTreeGridRowComponent, { read: ElementRef }) treeNodes: ElementRef[];

  update: any;
  customColumn = 'Codigo';
  defaultColumns = ['Nombre'];
  hasListener: any[] = [];
  oldHighlight: ElementRef;

  allColumns = [this.customColumn, ...this.defaultColumns];
  dataSource: NbTreeGridDataSource<EstructuraArbolRubrosApropiaciones>;
  dataSource2: NbTreeGridDataSource<EstructuraArbolRubrosApropiaciones>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  idHighlight: any;
  isSelected: boolean;
  searchValue: string;

  constructor(
    private renderer: Renderer2,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<EstructuraArbolRubrosApropiaciones>,
    private dataSourceBuilder2: NbTreeGridDataSourceBuilder<EstructuraArbolRubrosApropiaciones>,
    private treeHelper: ArbolHelper,
    private rubroHelper: RubroHelper) {

  }
  ngOnChanges(changes) {
    if (changes.optionSelect !== undefined) {
      if (changes.optionSelect.currentValue !== undefined) {
        this.opcionSeleccionada = changes.optionSelect.currentValue;
        this.loadTree();
      }
    }
    if (changes.vigencia !== undefined) {
      if (changes.vigencia.currentValue !== undefined) {
        this.vigenciaSeleccionada = changes.vigencia.currentValue;
        this.loadTree();
      }
    }
    if (changes['updateSignal'] && this.updateSignal) {
      this.updateSignal.subscribe(() => {
        this.loadTree();
      });
    }
    if (changes['externalSearch'] && changes['externalSearch'].currentValue) {
      this.searchValue = changes['externalSearch'].currentValue;
    }
    if (changes['paramsFieldsName'] && changes['paramsFieldsName'].currentValue) {
      this.paramsFieldsName = changes['paramsFieldsName'].currentValue;
    }    
  }

  // private data: TreeNode<EstructuraArbolRubrosApropiaciones>[] | TreeNode<EstructuraArbolRubros>[];

  private data: EstructuraArbolRubrosApropiaciones[];
  loadTreeRubros() {
    const getters: NbGetters<EstructuraArbolRubrosApropiaciones, EstructuraArbolRubrosApropiaciones> = {
      dataGetter: (node: EstructuraArbolRubrosApropiaciones) => node.data || null,
      childrenGetter: (node: EstructuraArbolRubrosApropiaciones) => !!node.children && !!node.children.length ? node.children : [],
      expandedGetter: (node: EstructuraArbolRubrosApropiaciones) => !!node.expanded,
    };
    forkJoin(
      {
        root_2: this.rubroHelper.getArbol('2'),
        root_3: this.rubroHelper.getArbol('3'),
      }
    ).
    subscribe((res) => {
      this.data = res.root_2.concat(res.root_3);
      this.dataSource = this.dataSourceBuilder.create(this.data, getters);
    });
  }


  loadTreeApropiaciones() {
    const getters: NbGetters<EstructuraArbolRubrosApropiaciones, EstructuraArbolRubrosApropiaciones> = {
      dataGetter: (node: EstructuraArbolRubrosApropiaciones) => node.data || undefined,
      childrenGetter: (node: EstructuraArbolRubrosApropiaciones) => !!node.children && !!node.children.length ? node.children : [],
      expandedGetter: (node: EstructuraArbolRubrosApropiaciones) => !!node.expanded,
    };
    this.customColumn = 'Codigo';
    this.defaultColumns = ['Nombre', 'ValorInicial'];
    this.allColumns = [this.customColumn, ...this.defaultColumns];
    if (this.vigenciaSeleccionada) {
      this.treeHelper.getFullArbol(this.vigenciaSeleccionada).subscribe(res => {
        this.data = res;
        this.dataSource2 = this.dataSourceBuilder2.create(this.data, getters);
      },
      );
    }
  }

  loadTreeApropiacionesEstado() {
    const getters: NbGetters<EstructuraArbolRubrosApropiaciones, EstructuraArbolRubrosApropiaciones> = {
      dataGetter: (node: EstructuraArbolRubrosApropiaciones) => node.data || undefined,
      childrenGetter: (node: EstructuraArbolRubrosApropiaciones) => !!node.children && !!node.children.length ? node.children : [],
      expandedGetter: (node: EstructuraArbolRubrosApropiaciones) => !!node.expanded,
    };
    this.customColumn = 'Codigo';
    this.defaultColumns = ['Nombre', 'ValorInicial', 'ValorActual'];
    this.allColumns = [this.customColumn, ...this.defaultColumns];
    if (this.vigenciaSeleccionada) {
      this.treeHelper.getFullArbolEstado(this.vigenciaSeleccionada, 'aprobada', this.paramsFieldsName ? this.paramsFieldsName : '').subscribe(res => {
        this.data = res;
        this.dataSource2 = this.dataSourceBuilder2.create(this.data, getters);
      },
      );
    }
  }

  loadTree() {
    if (this.opcionSeleccionada === 'Rubros') {
      this.loadTreeRubros();
    } else if (this.opcionSeleccionada === 'Apropiaciones') {
      this.loadTreeApropiaciones();
    } else if (this.opcionSeleccionada === 'ApropiacionesEstado') {
      this.loadTreeApropiacionesEstado();
    }
  }
  updateTreeSignal($event) {
    this.loadTree();
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  async onSelect(selectedItem: any, treegrid) {
    this.idHighlight = treegrid.elementRef.nativeElement.getAttribute('data-picker');
    this.rubroSeleccionado.emit(selectedItem.data);
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
  }

  updateHighlight(newHighlight: ElementRef, row) {
    this.oldHighlight && this.renderer.setStyle(this.oldHighlight.nativeElement, 'background', 'white');
    if (row.Codigo === this.idHighlight) {
      this.renderer.setStyle(newHighlight.nativeElement, 'background', 'lightblue');
    }
    this.oldHighlight = newHighlight;
  }

  validHighlight(selectedItem: any, treegrid) {
    if (selectedItem.data.Codigo === this.idHighlight) {
      this.updateHighlight(treegrid.elementRef, selectedItem.data);
      return true;
    }
    return false;
  }

}



@Component({
  selector: 'ngx-nb-fs-icon',
  template: `
    <nb-tree-grid-row-toggle
      [expanded]="expanded"
      *ngIf="isDir(); else fileIcon"
    >
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon> </ng-template>
  `,
})
export class FsIconAComponent {
  @Input() kind: string;

  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
