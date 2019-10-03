import { Component, Input, EventEmitter, Output, OnChanges, ViewChildren, ElementRef, Renderer2 } from '@angular/core';
import {
  NbGetters,
  NbSortDirection,
  NbTreeGridRowComponent,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbSortRequest,
} from '@nebular/theme';
import { Observable } from 'rxjs';
import { ArbolHelper } from '../../../@core/helpers/arbol/arbolHelper';



interface EstructuraArbolRubros {
  Nombre: string;
  Codigo: string;
  Descripcion: string;
}

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
  opcionSeleccionada: string;
  vigenciaSeleccionada: string;
  @ViewChildren(NbTreeGridRowComponent, { read: ElementRef }) treeNodes: ElementRef[];

  update: any;
  customColumn = 'Codigo';
  defaultColumns = ['Nombre'];
  hasListener: any[] = [];
  oldHighlight: ElementRef;

  allColumns = [this.customColumn, ...this.defaultColumns];
  dataSource: NbTreeGridDataSource<EstructuraArbolRubros>;
  dataSource2: NbTreeGridDataSource<EstructuraArbolRubrosApropiaciones>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  idHighlight: any;
  isSelected: boolean;

  constructor(
    private renderer: Renderer2,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<EstructuraArbolRubros>,
    private dataSourceBuilder2: NbTreeGridDataSourceBuilder<EstructuraArbolRubrosApropiaciones>,
    private treeHelper: ArbolHelper) {

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
        console.info(changes.vigencia.currentValue);
        this.vigenciaSeleccionada = changes.vigencia.currentValue;
        this.loadTree();
      }
    }
    if (changes['updateSignal'] && this.updateSignal) {
      this.updateSignal.subscribe(() => {
        this.loadTree();
      });
    }
  }

  // private data: TreeNode<EstructuraArbolRubrosApropiaciones>[] | TreeNode<EstructuraArbolRubros>[];

  private data: EstructuraArbolRubrosApropiaciones[];
  loadTreeRubros() {

    this.treeHelper.getFullArbol().subscribe((res) => {

      this.data = res;
      this.dataSource = this.dataSourceBuilder.create(this.data);

    });
  }


  loadTreeApropiaciones() {
    const getters: NbGetters<EstructuraArbolRubrosApropiaciones, EstructuraArbolRubrosApropiaciones> = {
      dataGetter: (node: EstructuraArbolRubrosApropiaciones) => node.data || undefined,
      childrenGetter: (node: EstructuraArbolRubrosApropiaciones) => typeof node.children === 'undefined' ? [] : node.children,
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
      childrenGetter: (node: EstructuraArbolRubrosApropiaciones) => typeof node.children === 'undefined' ? [] : node.children,
      expandedGetter: (node: EstructuraArbolRubrosApropiaciones) => !!node.expanded,
    };
    this.customColumn = 'Codigo';
    this.defaultColumns = ['Nombre', 'ApropiacionInicial', 'Estado'];
    this.allColumns = [this.customColumn, ...this.defaultColumns];
    if (this.vigenciaSeleccionada) {
      console.info(this.vigenciaSeleccionada);
      this.treeHelper.getFullArbolEstado(this.vigenciaSeleccionada, 'aprobada').subscribe(res => {
        this.data = res;
        console.info(this.data);
        this.dataSource2 = this.dataSourceBuilder2.create(this.data, getters);
        console.info(this.dataSource2);
      },
      );
    }
  }

  loadTree() {
    // console.info(this.opcionSeleccionada);
    // console.info(this.optionSelect);
    if (this.opcionSeleccionada === 'Rubros') {
      this.loadTreeRubros();
    } else if (this.opcionSeleccionada === 'Apropiaciones') {
      this.loadTreeApropiaciones();
    } else if (this.opcionSeleccionada === 'ApropiacionesEstado') {
      this.loadTreeApropiacionesEstado();
    }
  }
  updateTreeSignal($event) {
    console.info('updated', $event);
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
