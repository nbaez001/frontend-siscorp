import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appOnlyLetters]'
})
export class OnlyLettersDirective {

  @Input() appOnlyLetters: OnylLetters;

  private regex: RegExp = new RegExp(/^[ñA-Za-z _]*[ñA-Za-z][ñA-Za-z _]*$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    if (typeof (this.appOnlyLetters) !== 'undefined' && this.el.nativeElement.value.length >= this.appOnlyLetters.size) {
      event.preventDefault();
      return;
    }

    const current: string = this.el.nativeElement.value;

    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}

export interface OnylLetters {
  size: number;
}
