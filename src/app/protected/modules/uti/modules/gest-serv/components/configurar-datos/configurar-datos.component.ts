import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestServService } from '../../services/gest-serv.service';
import { UnidadMedida } from '../../entities/unidad-medida';
import { PlataformaItem } from '../../entities/plataforma-item';
import * as moment from 'moment';
import { Servicios } from '../../entities/estado';

interface Parametros {
  plat: PlataformaItem;
  serv: Servicios;
}

@Component({
  selector: 'uti-configurar-datos',
  templateUrl: './configurar-datos.component.html',
  styleUrls: ['./configurar-datos.component.scss']
})
export class ConfigurarDatosComponent implements OnInit {

  tabIndex: 0 | 1 = 0;

  medidas: UnidadMedida[] = [];

  formInternet: FormGroup;
  formTelefonia: FormGroup;

  errorCodigo: number;
  errorMensaje: string;
  errorTabIndex: number;

  constructor(
    public dialogRef: MatDialogRef<ConfigurarDatosComponent>,
    @Inject(MAT_DIALOG_DATA) private p: Parametros,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private gestServ: GestServService
  ) { }

  ngOnInit() {
    this.definirTab();
    this.crearForm();

    if (this.p.plat.idServInt > 0) {
      this.formInternet.setValue({
        circuitoDigital: this.p.plat.circuitoInt,
        tipoContrato: this.p.plat.tipoContrato,
        porcAsegurado: this.p.plat.porcentajeVel || '',
        fecInstalacion: this.p.plat.fecInstalacion ? moment(this.p.plat.fecInstalacion, 'YYYY/MM/DD').toDate() : '',
        idUnidadMedida: this.p.plat.idUnidadMedida || '',
        velBajada: this.p.plat.velBajada || '',
        velSubida: this.p.plat.velSubida || '',
        mejorOperador: this.p.plat.mejorOperador,
        priorizacion: this.p.plat.prioUAGS || ''
      });
    }

    if (this.p.plat.idServTel > 0) {
      this.formTelefonia.setValue({
        circuitoDigital: this.p.plat.circuitoTel,
        numeroAnexo: this.p.plat.anexo,
        numeroTelefono: this.p.plat.telefono
      });
    }

    this.gestServ.unidadesMedida()
      .subscribe(medidas => this.medidas = medidas);
  }

  definirTab() {
    switch (this.p.serv) {
      case Servicios.internet:
        this.tabIndex = 0;
        break;
      case Servicios.telefonia:
        this.tabIndex = 1;
        break;
      default:
        this.tabIndex = 0;
    }
  }

  crearForm() {
    this.formInternet = this.fb.group({
      circuitoDigital: ['', Validators.maxLength(100)],
      tipoContrato: ['', Validators.maxLength(100)],
      porcAsegurado: ['', Validators.pattern('^[0-9]+$')],
      fecInstalacion: [''],
      idUnidadMedida: [''],
      velBajada: ['', Validators.pattern('^[0-9]+$')],
      velSubida: ['', Validators.pattern('^[0-9]+$')],
      mejorOperador: ['', Validators.maxLength(100)],
      priorizacion: ['', Validators.pattern('^[0-9]+$')]
    });

    this.formTelefonia = this.fb.group({
      circuitoDigital: ['', Validators.maxLength(100)],
      numeroAnexo: ['', Validators.pattern('^[0-9]+$')],
      numeroTelefono: ['', Validators.pattern('^[0-9]+$')]
    });
  }

  guardarInternet() {
    if (this.formInternet.valid) {
      const datos = this.formInternet.value;
      datos.idServicio = this.p.plat.idServInt;
      datos.fecInstalacion = datos.fecInstalacion ? moment(datos.fecInstalacion).format('YYYY-MM-DD') : '';
      this.gestServ.guardarInternet(datos).subscribe(
        this.finalizar.bind(this),
        this.errores.bind(this)
      );
    } else {
      Object.values(this.formInternet.controls).forEach(c => c.markAsTouched());
    }
  }

  guardarTelefonia() {
    if (this.formTelefonia.valid) {
      const datos = this.formTelefonia.value;
      datos.idServicio = this.p.plat.idServTel;
      this.gestServ.guardarTelefonia(datos).subscribe(
        (error) => {

          this.errorTabIndex = error === null ? null : this.tabIndex;
          this.errorMensaje = error === null ? null : error.mensaje;

          if (error === null) {
            this.finalizar();
          }

        },
        this.errores.bind(this)
      );
    } else {
      Object.values(this.formTelefonia.controls).forEach(c => c.markAsTouched());
    }
  }

  finalizar() {
    const serv = this.tabIndex === 0 ? 'Internet' : 'Telefonía';
    this.snackBar.open(`Datos actualizados del servicio de ${serv}.`);
    this.dialogRef.close(true);
  }

  errores() {
    this.snackBar.open(
      `Errores desconocidos al intentar actualizar la información, comuniquese con UTI.`,
      '',
      {panelClass: 'mat-red-bg'}
    );
  }

}
