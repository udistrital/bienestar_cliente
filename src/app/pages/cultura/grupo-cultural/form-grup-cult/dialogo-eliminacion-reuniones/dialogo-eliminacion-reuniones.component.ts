import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'ngx-dialogo-eliminacion-reuniones',
  templateUrl: './dialogo-eliminacion-reuniones.component.html',
  styleUrls: ['./dialogo-eliminacion-reuniones.component.scss']
})
export class DialogoEliminacionReunionesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogoEliminacionReunionesComponent>) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close(true);
  }

}
