import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ngx-dialogo-solicitudes',
  templateUrl: './dialogo-solicitudes.component.html',
  styleUrls: ['./dialogo-solicitudes.component.scss']
})
export class DialogoSolicitudesComponent implements OnInit {

  constructor(public dialogo: MatDialogRef<DialogoSolicitudesComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: any) { }

    confirmado(): void {
      this.dialogo.close(true);
    }

  ngOnInit() {
  }

}
