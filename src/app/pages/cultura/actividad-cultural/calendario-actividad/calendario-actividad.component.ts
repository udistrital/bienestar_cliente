import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core'; // useful for typechecking
//import { HttpClient } from '@angular/common/http';
import esLocale from '@fullcalendar/core/locales/es';


@Component({
  selector: 'ngx-calendario-actividad',
  templateUrl: './calendario-actividad.component.html',
  styleUrls: ['./calendario-actividad.component.scss']
})
export class CalendarioActividadComponent implements OnInit {
    public calendarOptions!: CalendarOptions;
    constructor() { }

    eventos = [{
        title: 'Actividad Cultural',
        start: '2024-02-28T00:00:00-10:00',
        end: '2024-02-29T00:08:00-10:00',
        description:'Esta actividad cultural permite al estudiante'
    } ] 
    ngOnInit() {
        this.calendarOptions = {
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            initialView: 'dayGridMonth',
            height: 500,
            //dateClick: this.handleDateClick.bind(this), // MUST ensure `this` context is maintained
            events: this.eventos,
            locale: 'co',
            weekends: true,
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            eventBorderColor :'#000000',
            eventBackgroundColor: '#ff0000',
            eventTextColor: '#0a0404',
            eventColor: '#ffffff',
            
            
            eventClick: this.handleEventClick.bind(this),
            //eventsSet: this.handleEvents.bind(this),
            //themeSystem: 'bootstrap5'
          };

          
    }
    handleDateSelect(selectInfo: DateSelectArg) {
        const title = prompt('Please enter a new title for your event');
        const calendarApi = selectInfo.view.calendar;
    
        calendarApi.unselect(); // clear date selection
    
        

        if (title) {
          calendarApi.addEvent({
            //id: createEventId(),
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          });
          
          
        }
        }
    
      handleEventClick(clickInfo: EventClickArg) {
            if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
                //let eventID = this.listEventsID[clickInfo.event.id];
                //this.borrarEvento(eventID);
                clickInfo.event.remove();
            }
        }
    
        /*handleEvents(events: EventApi[]) {
            this.currentEvents = events;
        }*/
    
      insertarEvento() {
                alert("Evento creado");
        }
      
    
      handleDateClick(arg:any) {
        alert('date click! ' + arg.dateStr)
      }

}