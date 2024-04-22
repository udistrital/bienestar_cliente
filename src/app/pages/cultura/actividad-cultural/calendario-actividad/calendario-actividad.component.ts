import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core'; // useful for typechecking
//import { HttpClient } from '@angular/common/http';
import esLocale from '@fullcalendar/core/locales/es';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material';
import { CulturaService } from '../../../../shared/services/cultura.service';
import { DialogoActividadesCulturalesComponent } from '../dialogo-actividades-culturales/dialogo-actividades-culturales.component';

@Component({
  selector: 'ngx-calendario-actividad',
  templateUrl: './calendario-actividad.component.html',
  styleUrls: ['./calendario-actividad.component.scss']
})
export class CalendarioActividadComponent implements OnInit {

    public calendarOptions!: CalendarOptions;
    eventos: any[] = [];

    constructor(private ListCultura: CulturaService, private dialog: MatDialog) { }

    ngOnInit() {

      this.consultarActividadesCulturales();

        this.calendarOptions = {
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            events: [],
            initialView: 'dayGridMonth',
            themeSystem: 'Litera',
            height: 700,
            locale: 'co',
            weekends: true,
            editable: false,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,

            dayCellContent: (arg) => {
              const fecha = arg.date.getDate();
              const color = 'black';
              return { html: `<span style="color: ${color};">${fecha}</span>` };
            },
        
            dayCellDidMount: (arg) => {
              const fecha = arg.date.getDate();
              const color = 'white';
              arg.el.style.backgroundColor = color;
            },
            
            eventClick: this.handleEventClick.bind(this)
          };
          
    }

    consultarActividadesCulturales(){
      this.ListCultura.getActividadesCulturales().subscribe((data) => {
        //console.log(data['Data'])
        if (JSON.stringify(data['Data'][0]) != '{}') {

          for(let i in data['Data']){

            if(data['Data'][i].Estado == 2 ){
              this.eventos.push({
                idActividad: data['Data'][i].Id,
                title: data['Data'][i].Nombre,
                start: data['Data'][i].FechaInicio,
                end: data['Data'][i].FechaFin,
                backgroundColor: '#ff8000',
                textColor: '#000000'
              });
            } else if (data['Data'][i].Estado == 3) {
              this.eventos.push({
                idActividad: data['Data'][i].Id,
                title: data['Data'][i].Nombre,
                start: data['Data'][i].FechaInicio,
                end: data['Data'][i].FechaFin,
                backgroundColor: '#00913f',
                textColor: '#000000'
              });
            } else if (data['Data'][i].Estado == 4){
              this.eventos.push({
                idActividad: data['Data'][i].Id,
                title: data['Data'][i].Nombre,
                start: data['Data'][i].FechaInicio,
                end: data['Data'][i].FechaFin,
                backgroundColor: '#add8e6',
                textColor: '#000000'
              });
            } else if (data['Data'][i].Estado == 5){
              this.eventos.push({
                idActividad: data['Data'][i].Id,
                title: data['Data'][i].Nombre,
                start: data['Data'][i].FechaInicio,
                end: data['Data'][i].FechaFin,
                backgroundColor: '#4a148c',
                textColor: '#000000'
              });
            }

          }
            
          this.calendarOptions.events = this.eventos;

        }
        
      });
    }

    handleEventClick(clickInfo: EventClickArg) {

      this.mostrarDialogo(clickInfo.event._def.extendedProps.idActividad);
            
    }

    mostrarDialogo(id: number){
      
      let message = {idActividad: id};
        this.dialog.open( DialogoActividadesCulturalesComponent, {height: '1100px' ,width: '500px', data: {
          mensaje: message
        }});   
           
    }

}