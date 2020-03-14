import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[sololetra]'
})
export class SoloLetrasDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onkeypress(event) {
    let e = <KeyboardEvent>event;

    if ((e.charCode < 97 || e.charCode > 122)//letras mayusculas
      && (e.charCode < 65 || e.charCode > 90) //letras minusculas
      && (e.charCode != 45) //retroceso
      && (e.charCode != 241) //ñ
      && (e.charCode != 209) //Ñ
      && (e.charCode != 32) //espacio
      && (e.charCode != 225) //á
      && (e.charCode != 233) //é
      && (e.charCode != 237) //í
      && (e.charCode != 243) //ó
      && (e.charCode != 250) //ú
      && (e.charCode != 193) //Á
      && (e.charCode != 201) //É
      && (e.charCode != 205) //Í
      && (e.charCode != 211) //Ó
      && (e.charCode != 218) //Ú
    )
      return false;

  }

}
