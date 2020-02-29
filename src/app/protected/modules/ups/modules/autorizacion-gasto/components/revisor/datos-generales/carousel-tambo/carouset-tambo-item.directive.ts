import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[carouselItem]',
})
export class CarouselTamboItemDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
