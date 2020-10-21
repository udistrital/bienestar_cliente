import { Component, Inject, ElementRef, ViewChild, NgZone, Optional } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { DOCUMENT } from '@angular/common';
declare let gapi: any;


@Component({
  selector: 'ngx-agenda-cita-estudiante',
  templateUrl: './agenda-cita-estudiante.component.html',
  styleUrls: ['./agenda-cita-estudiante.component.scss']
})
export class AgendaCitaEstudianteComponent {

  constructor(private zone: NgZone) { }

	listUpcomingEvents() {
		gapi.client.calendar.events.list({
			'calendarId': 'primary',
			'timeMin': (new Date()).toISOString(),
			'showDeleted': false,
			'singleEvents': true,
			'maxResults': 10,
			'orderBy': 'startTime'
		}).then((response) => {
			let events = response.result.items;
			let listaEventos = [];

			if (events.length > 0) {

				for (let i = 0; i < events.length; i++) {
					let event = events[i];
					let when = event.start.dateTime;
					let title = event.summary;
					let id = event.id;
					
					if (!when) {
						when = event.start.date;
					}

					let finish = event.end.dateTime;
					if (!finish) {
						finish = event.start.date;
					}
					let idCal = createEventId();
					let eventoTemp = {
						id: idCal,
						title: event.summary,
						start: when,
						end: finish
					};
					listaEventos.push(eventoTemp);
					this.listEventsID[idCal] = id;
				}
			} else {
				alert("No se encontraron eventos");
			}

			const { calendarOptions } = this;
			calendarOptions.events = listaEventos;
			this.currentEvents = listaEventos;
		});


	}


	loadClient(): void {
		let CLIENT_ID = '151589550792-5frthkj7odm7f959jc3h900ulihaelmd.apps.googleusercontent.com';
		let API_KEY = 'AIzaSyATQzBPmwLeQUWIsrZZ6y-TBaniZ_zFEVQ';

		// Array of API discovery doc URLs for APIs used by the quickstart
		let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

		// Authorization scopes required by the API; multiple scopes can be
		// included, separated by spaces.
		let SCOPES = "https://www.googleapis.com/auth/calendar";
		let initObj = {
			apiKey: API_KEY,
			clientId: CLIENT_ID,
			discoveryDocs: DISCOVERY_DOCS,
			scope: SCOPES
		};

		gapi.load('client:auth2', () => {
			gapi.client.init(initObj);
		});
	}

	listEventsID = {};

	calendarVisible = true;
	evento = [{
		'summary': 'Google I/O 2015',
		'location': '800 Howard St., San Francisco, CA 94103',
		'description': 'A chance to hear more about Google\'s developer products.',
		'start': {
			'dateTime': '2020-10-28T09:00:00-07:00',
			'timeZone': 'America/Los_Angeles',
		},
		'end': {
			'dateTime': '2020-10-28T17:00:00-07:00',
			'timeZone': 'America/Los_Angeles',
		}
	}];

	eventosJ = [
		{
			title: this.evento[0].summary,
			start: this.evento[0].start.dateTime,
			end: this.evento[0].end.dateTime,
		}
	];


	calendarOptions: CalendarOptions = {
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
		},
		initialView: 'dayGridMonth',
		googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',
		//initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
		//events: 'en.usa#holiday@group.v.calendar.google.com',    
		events: this.eventosJ,
		weekends: true,
		editable: true,
		selectable: true,
		selectMirror: true,
		dayMaxEvents: true,
		select: this.handleDateSelect.bind(this),
		eventClick: this.handleEventClick.bind(this),
		eventsSet: this.handleEvents.bind(this)
		/* you can update a remote database when these fire:
		eventAdd:
		eventChange:
		eventRemove:
		*/
	};
	currentEvents: EventApi[] = [];

	handleCalendarToggle() {
		this.calendarVisible = !this.calendarVisible;
	}

	handleWeekendsToggle() {
		const { calendarOptions } = this;
		calendarOptions.weekends = !calendarOptions.weekends;
	}

	handleDateSelect(selectInfo: DateSelectArg) {
		const title = prompt('Please enter a new title for your event');
		const calendarApi = selectInfo.view.calendar;

		calendarApi.unselect(); // clear date selection

		if (title) {
			let idCal = createEventId();
			calendarApi.addEvent({
				id: idCal,
				title,
				start: selectInfo.startStr,
				end: selectInfo.endStr,
				allDay: selectInfo.allDay
			});

			let eventoCal;

			if (selectInfo.startStr.includes("T")) {
				eventoCal = {
					'summary': title,
					'start': {
						'dateTime': selectInfo.startStr
					},
					'end': {
						'dateTime': selectInfo.endStr
					}
				};
			} else {
				eventoCal = {
					'summary': title,
					'start': {
						'date': selectInfo.startStr
					},
					'end': {
						'date': selectInfo.endStr
					}
				};
			}

			this.listEventsID[idCal] = "";
			this.insertarEvento(eventoCal);

		}
	}
	insertarEvento(event) {
		var request = gapi.client.calendar.events.insert({
			'calendarId': 'primary',
			'resource': event
		});
		request.execute((event) => {
			alert("Evento creado");
		});
	}

	borrarEvento(event_id){
		
		let request = gapi.client.calendar.events.delete({
			'calendarId': 'primary',
			'eventId': event_id
		});
		request.execute((response) =>{
			if(response.error || response == false){
				alert("Error");
			}else{
				alert("Evento borrado");
			}
		});
	}

	handleEventClick(clickInfo: EventClickArg) {
		if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
			let eventID = this.listEventsID[clickInfo.event.id];
			this.borrarEvento(eventID);
			clickInfo.event.remove();
		}
	}

	handleEvents(events: EventApi[]) {
		this.currentEvents = events;
	}

	iniciar() {
		this.loadClient();
	}

	login() {
		gapi.auth2.getAuthInstance().signIn();
		this.listUpcomingEvents();
	}

	logout() {
		gapi.auth2.getAuthInstance().signOut();
	}

}
