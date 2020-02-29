import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class CustomIconService {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  cargaIcono() {

    this.matIconRegistry.addSvgIcon(
      'check-pais',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/icons/check.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'excel-pais',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/icons/excel.svg')
    );
    this.matIconRegistry.addSvgIcon(
      '24-hours-pais',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/icons/24-hours.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'business-comunication-pais',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/icons/business-comunication.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'eye-pais',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/icons/eye.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'file-pais',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/icons/file.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'focus-pais',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/icons/focus.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'resize-pais',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/icons/resize.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'resize-option-pais',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/icons/resize-option.svg')
    );
  }

}
