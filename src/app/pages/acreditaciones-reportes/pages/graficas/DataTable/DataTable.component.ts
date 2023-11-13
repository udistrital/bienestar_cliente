import { Component, OnInit } from "@angular/core";
import { AtencionesService } from "../../../services/atenciones.service";

@Component({
  selector: "ngx-DataTable",
  templateUrl: "./DataTable.component.html",
  styleUrls: ["./DataTable.component.scss"],
})
export class DataTableComponent implements OnInit {
  ELEMENT_DATA = [];
  displayedColumns: string[] = ["name"];
  dataSource = [];
  view: any[] = [700, 400];

  colorScheme = {
    domain: ["#5AA454", "#E44D25", "#CFC0BB", "#7aa3e5", "#a8385d", "#aae3f5"],
  };
  // cardColor: string = "#232837";
  constructor(private AtencionesService: AtencionesService) {}

  get single() {
    return this.AtencionesService.atencionesDataAxS;
  }

  ngOnInit() {
    this.ELEMENT_DATA = this.AtencionesService.atencionesDataAxS;
    this.dataSource = this.ELEMENT_DATA;
  }
}
