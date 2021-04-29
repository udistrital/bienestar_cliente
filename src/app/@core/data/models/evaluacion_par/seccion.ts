import { Item } from './item';

export class Seccion {
  id: string;
  nombre: string;
  descripcion: string;
  estructura_seccion: any;
  items_id: Item[];
}
