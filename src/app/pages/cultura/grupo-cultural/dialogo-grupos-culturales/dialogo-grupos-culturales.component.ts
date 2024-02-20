import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ngx-dialogo-grupos-culturales',
  template: `<h1> Ventana Modal </h1> <button (click)="close()">Cerrar</button>`,
  templateUrl: './dialogo-grupos-culturales.component.html',
  styleUrls: ['./dialogo-grupos-culturales.component.scss']
})
export class DialogoGruposCulturalesComponent implements OnInit {

  mensaje: string;

  constructor(public dialogRef: MatDialogRef<DialogoGruposCulturalesComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) { this.mensaje = data.mensaje; }

  close(): void {
    this.dialogRef.close(true);
  }

  ngOnInit(){

  }
}
