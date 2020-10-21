import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Agendamiento Citas',
    icon: 'file-text',
    children: [
      {          
        title: 'Agendar Cita',
        link: '/pages/agendamiento-citas/cita',
        data: {
          rolesPermitidos: ['ESPECIALISTA']
        }
      },
      {          
        title: 'Información Paciente',
        link: '/pages/agendamiento-citas/paciente',
        data: {
          rolesPermitidos: ['ESPECIALISTA']
        }
      },
      {          
        title: 'Horario Especialista',
        link: '/pages/agendamiento-citas/horario-especialista',
        data: {
          rolesPermitidos: ['ESPECIALISTA']
        }
      },
      {          
        title: 'Agendar cita',
        link: '/pages/agendamiento-citas/agendar-cita',
        data: {
          rolesPermitidos: ['ESTUDIANTE']
        }
      }
    ],
  },  
];