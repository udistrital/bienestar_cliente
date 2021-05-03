import { Component, OnInit } from '@angular/core';
//import { ToastrService } from 'ngx-toastr';
//import { CitasService } from 'src/app/services/citas.service';

@Component({
  selector: 'ngx-listar-cita',
  templateUrl: './listar-cita.component.html',
  styleUrls: ['./listar-cita.component.scss']
})
export class ListarCitaComponent implements OnInit {
  citas: any[]=[];
  displayedColumns = [   'nombre', 'fecha','hora','facultad','tipocita', 'especialista'];
  datasource: any[]=[];
  cargando = true;

  constructor( /*private _CitasService: CitasService,
    private toastr: ToastrService*/) { }

  ngOnInit() {
    //this.getTipoCitas();
  }
  /*getTipoCitas(){
    
    this._CitasService.getCitas().subscribe(data=>{
      this.citas =[];
      this.datasource = this.citas;
      data.forEach((element:any)=>{
        this.citas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    })
  }
  eliminarTipoCita(id: string){
    this._CitasService.eliminarCitas(id).then(()=>{
      this.toastr.error('Tipo Cita eliminado con éxito','Tipo cita eliminado');
    })
  }*/

}
