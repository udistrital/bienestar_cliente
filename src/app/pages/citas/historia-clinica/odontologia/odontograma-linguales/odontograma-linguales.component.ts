import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-odontograma-linguales',
  templateUrl: './odontograma-linguales.component.html',
  styleUrls: ['./odontograma-linguales.component.css']
})
export class OdontogramaLingualesComponent implements OnInit {

  color: number = 1;
   dientesArriba: any[] = [
    { diente: 0, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 1, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 2, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 3, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 4, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 5, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 6, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 7, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 8, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 9, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
  ];
  dientesAbajo: any[] = [
    { diente: 0, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 1, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 2, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 3, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 4, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 5, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 6, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 7, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 8, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 9, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 10, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 11, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 12, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 13, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 14, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
    { diente: 15, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', desgaste: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', obturado: 'invisible', obturadoResina: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible' },
  ];
  convencionesArriba: any[] = [
    { nombre: 'Normal', color: 'Lavender', estado: 1 },
    { nombre: 'Implante', color: '#CC66CC', estado: 2 },
    { nombre: 'Ausente', color: 'tomato', estado: 3 },
    { nombre: 'Resina', color: '#CC6600', estado: 4 },
    { nombre: 'Caries', color: 'yellow', estado: 5 },
    { nombre: 'Sellante', color: 'green', estado: 6 },
    { nombre: 'Corona', color: 'blue', estado: 7 },
    { nombre: 'Desgaste', color: 'DarkKhaki', estado: 8 },
  ];
  convencionesAbajo: any[] = [
    { nombre: 'Fracturado', color: 'GoldenRod', estado: 9 },
    { nombre: 'Rotado', color: 'cyan', estado: 10 },
    { nombre: 'Endodoncia', color: 'orange', estado: 11 },
    { nombre: 'Amalgama', color: 'red', estado: 12 },
    { nombre: 'Erupcionado', color: 'black', estado: 13 },
    { nombre: 'Obturado', color: 'Maroon', estado: 14 },
    { nombre: 'Corona Destruida', color: 'DarkMagenta', estado: 15 },
    { nombre: 'Opturado con resina', color: 'DarkCyan', estado: 16 },
  ];

  tipoDiente(est: number) {
    this.color = est;
  }
  cambiarColorAbajo(diente: number, posicion: String) {
    if (posicion === "Arriba") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classArriba = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].ausente = 'marcadoTomate';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classArriba = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classArriba = 'marcadoAmarillo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classArriba = 'marcadoVerde';
      }
      else if (this.color == 7) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].desgaste = 'marcadoKhaki';

      }
      else if (this.color == 9) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].fracturado = 'marcadoDorado';

      }
      else if (this.color == 10) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].rotado = 'marcadoCyan';

      }
      else if (this.color == 11) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodoncia = 'marcadoNaranja';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classArriba = 'marcadoRojo';
      }
      else if (this.color == 13) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].erupcionado = 'marcadoNegro';
      }
      else if (this.color == 14) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].obturado = 'marcadoMaroon';
      }
      else if (this.color == 15) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].obturadoResina = 'marcadoDarkCyan';
      }
    }
    else if (posicion === "Derecha") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classDerecha = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].ausente = 'marcadoTomate';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classDerecha = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classDerecha = 'marcadoAmarillo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classDerecha = 'marcadoVerde';
      }
      else if (this.color == 7) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].desgaste = 'marcadoKhaki';

      }
      else if (this.color == 9) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].fracturado = 'marcadoDorado';

      }
      else if (this.color == 10) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].rotado = 'marcadoCyan';

      }
      else if (this.color == 11) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodoncia = 'marcadoNaranja';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classDerecha = 'marcadoRojo';
      }
      else if (this.color == 13) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].erupcionado = 'marcadoNegro';
      }
      else if (this.color == 14) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].obturado = 'marcadoMaroon';
      }
      else if (this.color == 15) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].obturadoResina = 'marcadoDarkCyan';
      }
    }
    else if (posicion === "Izquierda") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classIzquierda = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].ausente = 'marcadoTomate';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classIzquierda = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classIzquierda = 'marcadoAmarillo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classIzquierda = 'marcadoVerde';
      }
      else if (this.color == 7) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].desgaste = 'marcadoKhaki';

      }
      else if (this.color == 9) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].fracturado = 'marcadoDorado';

      }
      else if (this.color == 10) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].rotado = 'marcadoCyan';

      }
      else if (this.color == 11) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodoncia = 'marcadoNaranja';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classIzquierda = 'marcadoRojo';
      }
      else if (this.color == 13) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].erupcionado = 'marcadoNegro';
      }
      else if (this.color == 14) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].obturado = 'marcadoMaroon';
      }
      else if (this.color == 15) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].obturadoResina = 'marcadoDarkCyan';
      }
    }
    else if (posicion === "Centro") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classCentro = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].ausente = 'marcadoTomate';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classCentro = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classCentro = 'marcadoAmarillo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classCentro = 'marcadoVerde';
      }
      else if (this.color == 7) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].desgaste = 'marcadoKhaki';

      }
      else if (this.color == 9) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].fracturado = 'marcadoDorado';

      }
      else if (this.color == 10) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].rotado = 'marcadoCyan';

      }
      else if (this.color == 11) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodoncia = 'marcadoNaranja';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classCentro = 'marcadoRojo';
      }
      else if (this.color == 13) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].erupcionado = 'marcadoNegro';
      }
      else if (this.color == 14) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].obturado = 'marcadoMaroon';
      }
      else if (this.color == 15) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].obturadoResina = 'marcadoDarkCyan';
      }
    }
    else if (posicion === "Abajo") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classAbajo = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].ausente = 'marcadoTomate';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classAbajo = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classAbajo = 'marcadoAmarillo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classAbajo = 'marcadoVerde';
      }
      else if (this.color == 7) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].desgaste = 'marcadoKhaki';

      }
      else if (this.color == 9) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].fracturado = 'marcadoDorado';

      }
      else if (this.color == 10) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].rotado = 'marcadoCyan';

      }
      else if (this.color == 11) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodoncia = 'marcadoNaranja';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classAbajo = 'marcadoRojo';
      }
      else if (this.color == 13) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].erupcionado = 'marcadoNegro';
      }
      else if (this.color == 14) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].obturado = 'marcadoMaroon';
      }
      else if (this.color == 15) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].obturadoResina = 'marcadoDarkCyan';
      }
    }
  }
  cambiarColorArriba(diente: number, posicion: String) {
    if (posicion === "Arriba") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classArriba = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].ausente = 'marcadoTomate';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classArriba = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classArriba = 'marcadoAmarillo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classArriba = 'marcadoVerde';
      }
      else if (this.color == 7) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].desgaste = 'marcadoKhaki';

      }
      else if (this.color == 9) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].fracturado = 'marcadoDorado';

      }
      else if (this.color == 10) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].rotado = 'marcadoCyan';

      }
      else if (this.color == 11) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodoncia = 'marcadoNaranja';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classArriba = 'marcadoRojo';
      }
      else if (this.color == 13) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].erupcionado = 'marcadoNegro';
      }
      else if (this.color == 14) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].obturado = 'marcadoMaroon';
      }
      else if (this.color == 15) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].obturadoResina = 'marcadoDarkCyan';
      }
    }
    else if (posicion === "Derecha") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classDerecha = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].ausente = 'marcadoTomate';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classDerecha = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classDerecha = 'marcadoAmarillo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classDerecha = 'marcadoVerde';
      }
      else if (this.color == 7) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].desgaste = 'marcadoKhaki';

      }
      else if (this.color == 9) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].fracturado = 'marcadoDorado';

      }
      else if (this.color == 10) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].rotado = 'marcadoCyan';

      }
      else if (this.color == 11) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodoncia = 'marcadoNaranja';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classDerecha = 'marcadoRojo';
      }
      else if (this.color == 13) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].erupcionado = 'marcadoNegro';
      }
      else if (this.color == 14) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].obturado = 'marcadoMaroon';
      }
      else if (this.color == 15) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].obturadoResina = 'marcadoDarkCyan';
      }
    }
    else if (posicion === "Izquierda") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classIzquierda = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].ausente = 'marcadoTomate';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classIzquierda = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classIzquierda = 'marcadoAmarillo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classIzquierda = 'marcadoVerde';
      }
      else if (this.color == 7) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].desgaste = 'marcadoKhaki';

      }
      else if (this.color == 9) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].fracturado = 'marcadoDorado';

      }
      else if (this.color == 10) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].rotado = 'marcadoCyan';

      }
      else if (this.color == 11) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodoncia = 'marcadoNaranja';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classIzquierda = 'marcadoRojo';
      }
      else if (this.color == 13) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].erupcionado = 'marcadoNegro';
      }
      else if (this.color == 14) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].obturado = 'marcadoMaroon';
      }
      else if (this.color == 15) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].obturadoResina = 'marcadoDarkCyan';
      }
    }
    else if (posicion === "Centro") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classCentro = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].ausente = 'marcadoTomate';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classCentro = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classCentro = 'marcadoAmarillo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classCentro = 'marcadoVerde';
      }
      else if (this.color == 7) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].desgaste = 'marcadoKhaki';

      }
      else if (this.color == 9) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].fracturado = 'marcadoDorado';

      }
      else if (this.color == 10) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].rotado = 'marcadoCyan';

      }
      else if (this.color == 11) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodoncia = 'marcadoNaranja';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classCentro = 'marcadoRojo';
      }
      else if (this.color == 13) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].erupcionado = 'marcadoNegro';
      }
      else if (this.color == 14) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].obturado = 'marcadoMaroon';
      }
      else if (this.color == 15) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].obturadoResina = 'marcadoDarkCyan';
      }
    }
    else if (posicion === "Abajo") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classAbajo = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].ausente = 'marcadoTomate';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classAbajo = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classAbajo = 'marcadoAmarillo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classAbajo = 'marcadoVerde';
      }
      else if (this.color == 7) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].desgaste = 'marcadoKhaki';

      }
      else if (this.color == 9) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].fracturado = 'marcadoDorado';

      }
      else if (this.color == 10) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].rotado = 'marcadoCyan';

      }
      else if (this.color == 11) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodoncia = 'marcadoNaranja';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classAbajo = 'marcadoRojo';
      }
      else if (this.color == 13) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].erupcionado = 'marcadoNegro';
      }
      else if (this.color == 14) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].obturado = 'marcadoMaroon';
      }
      else if (this.color == 15) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].obturadoResina = 'marcadoDarkCyan';
      }
    }
  }
  limpiarArriba(diente: number) {
    this.dientesArriba[diente].classArriba = 'diente';
    this.dientesArriba[diente].classAbajo = 'diente';
    this.dientesArriba[diente].classIzquierda = 'diente';
    this.dientesArriba[diente].classDerecha = 'diente';
    this.dientesArriba[diente].classCentro = 'diente';
    this.dientesArriba[diente].implante = 'invisible';
    this.dientesArriba[diente].ausente = 'invisible';
    this.dientesArriba[diente].corona = 'invisible';
    this.dientesArriba[diente].desgaste = 'invisible';
    this.dientesArriba[diente].fracturado = 'invisible';
    this.dientesArriba[diente].rotado = 'invisible';
    this.dientesArriba[diente].endodoncia = 'invisible';
    this.dientesArriba[diente].erupcionado = 'invisible';
    this.dientesArriba[diente].obturado = 'invisible';
    this.dientesArriba[diente].coronaDestruida = 'invisible';
    this.dientesArriba[diente].obturadoResina = 'invisible';
  }
  limpiarEspecialesArriba(diente: number) {
    this.dientesArriba[diente].implante = 'invisible';
    this.dientesArriba[diente].ausente = 'invisible';
    this.dientesArriba[diente].corona = 'invisible';
    this.dientesArriba[diente].desgaste = 'invisible';
    this.dientesArriba[diente].fracturado = 'invisible';
    this.dientesArriba[diente].rotado = 'invisible';
    this.dientesArriba[diente].endodoncia = 'invisible';
    this.dientesArriba[diente].erupcionado = 'invisible';
    this.dientesArriba[diente].obturado = 'invisible';
    this.dientesArriba[diente].coronaDestruida = 'invisible';
    this.dientesArriba[diente].obturadoResina = 'invisible';

  }
  limpiarAbajo(diente: number) {
    this.dientesAbajo[diente].classArriba = 'diente';
    this.dientesAbajo[diente].classAbajo = 'diente';
    this.dientesAbajo[diente].classIzquierda = 'diente';
    this.dientesAbajo[diente].classDerecha = 'diente';
    this.dientesAbajo[diente].classCentro = 'diente';
    this.dientesAbajo[diente].implante = 'invisible';
    this.dientesAbajo[diente].ausente = 'invisible';
    this.dientesAbajo[diente].corona = 'invisible';
    this.dientesAbajo[diente].desgaste = 'invisible';
    this.dientesAbajo[diente].fracturado = 'invisible';
    this.dientesAbajo[diente].rotado = 'invisible';
    this.dientesAbajo[diente].endodoncia = 'invisible';
    this.dientesAbajo[diente].erupcionado = 'invisible';
    this.dientesAbajo[diente].obturado = 'invisible';
    this.dientesAbajo[diente].coronaDestruida = 'invisible';
    this.dientesAbajo[diente].obturadoResina = 'invisible';
  }
  limpiarEspecialesAbajo(diente: number) {
    this.dientesAbajo[diente].implante = 'invisible';
    this.dientesAbajo[diente].ausente = 'invisible';
    this.dientesAbajo[diente].corona = 'invisible';
    this.dientesAbajo[diente].desgaste = 'invisible';
    this.dientesAbajo[diente].fracturado = 'invisible';
    this.dientesAbajo[diente].rotado = 'invisible';
    this.dientesAbajo[diente].endodoncia = 'invisible';
    this.dientesAbajo[diente].erupcionado = 'invisible';
    this.dientesAbajo[diente].obturado = 'invisible';
    this.dientesAbajo[diente].coronaDestruida = 'invisible';
    this.dientesAbajo[diente].obturadoResina = 'invisible';

  }
  constructor() { }

  ngOnInit() {
  }

}
