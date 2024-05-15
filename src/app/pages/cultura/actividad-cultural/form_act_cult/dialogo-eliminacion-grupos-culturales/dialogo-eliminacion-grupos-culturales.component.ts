import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'ngx-dialogo-eliminacion-grupos-culturales',
  templateUrl: './dialogo-eliminacion-grupos-culturales.component.html',
  styleUrls: ['./dialogo-eliminacion-grupos-culturales.component.scss']
})
export class DialogoEliminacionGruposCulturalesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogoEliminacionGruposCulturalesComponent>) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close(true);
  }


}
