import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Menú',
    icon: 'nb-start',
    children: [
      {          
        title: 'Estudiante',
        link: '/pages/apoyo-alimentario',
      },
    ],
  },  
];

export const MENU_ITEMS2: NbMenuItem[] = [
    {
      title: 'Menú',
      icon: 'nb-start',
      children: [
        {
          title: 'Admin',
          link: '/pages/dashboard',
        },
      ],
    },  
  ];