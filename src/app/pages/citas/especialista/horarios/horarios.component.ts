import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
const fechaHoy = new Date().toISOString(); // YYYY-MM-DDT:HH:mm
// const fechaHoy = new Date().toISOString().replace(/T.*$/, ''); 




@Component({
  selector: 'ngx-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})

export class HorariosComponent implements OnInit {
  constructor() { }
  ngOnInit() {
    console.log(fechaHoy);
  }
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridDay',
    // themeSystem: 'bootstrap',
    weekends: false,
    aspectRatio: 1.8,
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek'
    },
    locale: esLocale,
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
      meridiem: 'short'
    },
    businessHours: {
      start: '08:00:00',
      end: '17:00:00',
      dow: [1, 2, 3, 4, 5]
    },
    navLinks: true,
    editable: true,
    slotMinTime: '08:00:00',
    slotMaxTime: '17:00:00',
    slotDuration: '00:30:00',
    slotLabelInterval: 30,
    snapDuration: '00:30:00',
    events: [
      { title: 'Bryan Alejandro luis', date: '2021-04-21T10:30:00' },
      { title: 'Diego Romero', date: '2021-04-22T11:00:00' },
      { title: 'Diego Romero', date: '2021-04-22T15:00:00' },
      { title: 'Bryan Alejandro luis', date: '2021-04-23T13:30:00' },
      { title: 'Andrés Castro', date: `${fechaHoy}` }
    ],
  };
  cargarCitas() {
    // this.citasService.getCitas().subscribe((cita): any => {
    //   cita.fecha = new Date().toISOString();
    //   this.calendarOptions.events = [{
    //     title: cita.paciente,
    //     date: cita.fecha,
    //   }]
    // });
  }

}
