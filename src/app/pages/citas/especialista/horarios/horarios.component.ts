import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { ToastrService } from 'ngx-toastr';
import { ListService } from '../../../../@core/store/list.service';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';
const fechaHoy = new Date().toISOString(); // YYYY-MM-DDT:HH:mm
// const fechaHoy = new Date().toISOString().replace(/T.*$/, ''); 





@Component({
  selector: 'ngx-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.scss']
})

export class HorariosComponent implements OnInit {
  cita: any;
  citas: any[] = [];
  calendarOptions: CalendarOptions;
  constructor(private listService: ListService, private toastr: ToastrService, private personaService: EstudiantesService, private saludService: SaludService) { }
  ngOnInit() {
    this.cargarCitas();
    this.cargarCalendario();
  }
  cargarCalendario(){
  this.calendarOptions = {
    initialView: 'dayGridMonth',
    themeSystem: 'Litera',
    weekends: false,
    aspectRatio: 1.8,
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'dayGridMonth,listWeek'
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
    slotMinTime: '08:00:00',
    slotMaxTime: '17:00:00',
    slotDuration: '00:30:00',
    slotLabelInterval: 30,
    snapDuration: '00:30:00',
    events: [
      
    ],
  };
}
  cargarCitas() {
    this.listService.getInfoEstudiante().then((resp) => {
      //console.log(resp);
      this.personaService.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        //console.log(res);
        this.saludService.getCitaEspecialista(res[0].TerceroId.Id).subscribe((data) => {
          //console.log(data);
          if (data) {
            this.cita = data;
            for (let i in this.cita) {
              this.personaService.getPaciente(this.cita[i].IdPaciente).subscribe((res) => {
                let date = new Date(this.cita[i].Fecha);
                //console.log(date);
                let dateHora = new Date(this.cita[i].Hora);
                dateHora.setHours(dateHora.getHours() + 5);
                // console.log(dateHora);
                let hours = dateHora.getHours();
                let minutes = dateHora.getMinutes();
                let seconds = dateHora.getSeconds();
                let fechaHora;
                if (minutes < 10 && seconds < 10) {
                  fechaHora = hours + ':' + '0' + minutes + ':' + '0' + seconds;
                } else if (minutes >= 10 && seconds < 10) {
                  fechaHora = hours + ':' + minutes + ':' + '0' + seconds;
                } else if (minutes < 10 && seconds >= 10) {
                  fechaHora = hours + ':' + '0' + minutes + ':' + seconds;
                } else {
                  fechaHora = hours + ':' + minutes + ':' + seconds;
                }
                //console.log(fechaHora);
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                let fecha;
                if (month < 10) {
                  fecha = `${year}-0${month}-${day}`;
                } else {
                  fecha = `${year}-${month}-${day}`;
                }
                this.cita[i].NombrePaciente = res["NombreCompleto"];
                let formato = { title: this.cita[i].NombrePaciente + '- ' + this.cita[i].Sede, date: fecha + 'T' + fechaHora }
                this.citas.push(formato);
                this.calendarOptions.events = this.citas;
              });
            }
          }
        });
      });
    });
  }

}
