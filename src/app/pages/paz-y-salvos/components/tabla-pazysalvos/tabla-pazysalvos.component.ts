import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';



// <th class="border-end">Nombre</th>
// <th class="border-end">Fecha</th>
// <th class="border-end">Facultad</th>
// <th class="border-end">Estado</th>
// <th class="border-end">Ver/Generar</th>




const ELEMENT_DATA= [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},

];






@Component({
  selector: 'ngx-tabla-pazysalvos',
  templateUrl: './tabla-pazysalvos.component.html',
  styleUrls: ['./tabla-pazysalvos.component.scss']
})
export class TablaPazysalvosComponent implements OnInit {
  @Input() solicitudesExt: any[]=[];

  @ViewChild(MatPaginator,{ read: null, static: null }) paginator: MatPaginator;
  @ViewChild(MatSort,{ read: null, static: null }) sort: MatSort;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource  (ELEMENT_DATA);

  // registrosPorPagina = 10;
  // elementosEncontrados = 10;
  // page =0;
  // limit = 3;
  // offset = 0;
  recargarTabla: boolean = false;
  constructor() {
        // Create 100 users
        // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

        // Assign the data to the data source for the table to render
        
 }
   
   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
  
  }
  listar(){
    console.log(this.solicitudesExt)
    for(let solicitud of this.solicitudesExt){
      // const ELEMENT_DATA= [
      //   {Id: solicitud.Id, Nombre: solicitud.NombreCompleto, Apellido: solicitud.PrimerNombre, Periodo: 'H'},
      // ];
      console.log( {Id: solicitud.Id, Nombre: solicitud.NombreCompleto, Apellido: solicitud.PrimerNombre, Periodo: 'H'},);
      
    }
  }
  //listar(){}
  // recargarTablaPage(pagina) {
  //   this.limit = this.registrosPorPagina * (pagina + 1);
  //   this.offset = this.limit - this.registrosPorPagina;
  //   this.recargarTabla = true;
  // }

}

