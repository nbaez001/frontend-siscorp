import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Unidad } from '../../../entities/unidad.model';
import { Tambo } from '../../../entities/tambo.model';
import { DetalleSolicitudMant } from '../../../entities/detalle-solicitud-mant.model';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { VEHICULOS, UNIDADES, TAMBOS, TIPOSMANTENIMIENTO, _tiposProducto, _tiposDocumento, _estadosSolicitudMant } from '../../../data-combustible';
import { DataDialog } from '../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DecimalPipe } from '@angular/common';
import { SolicitudMant } from '../../../entities/solicitud-mant.model';

@Component({
  selector: 'app-reg-sol-mantenimiento',
  templateUrl: './reg-sol-mantenimiento.component.html',
  styleUrls: ['./reg-sol-mantenimiento.component.scss']
})
export class RegSolMantenimientoComponent implements OnInit {
  formularioGrp: FormGroup;
  detFormularioGrp: FormGroup;

  unidades: Unidad[] = UNIDADES;
  tambos: Tambo[] = TAMBOS;
  tiposMantenimiento = [];
  vehiculos = [];
  tiposProducto = [];
  tiposDocumento = [];
  estadoSolicitud = _estadosSolicitudMant;
  fileupload: any;

  listaDetSolicitud: DetalleSolicitudMant[] = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<DetalleSolicitudMant>;
  columnsGrilla = [
    {
      columnDef: 'nomTipoProducto',
      header: 'TIPO',
      cell: (obj: DetalleSolicitudMant) => `${obj.nomTipoProducto}`
    }, {
      columnDef: 'producto',
      header: 'PRODUCTO',
      cell: (obj: DetalleSolicitudMant) => `${obj.producto}`
    }, {
      columnDef: 'cantidad',
      header: 'CANTIDAD',
      cell: (obj: DetalleSolicitudMant) => `${this.decimalPipe.transform(obj.cantidad, '1.1-1')}`
    }, {
      columnDef: 'monto',
      header: 'MONTO',
      cell: (obj: DetalleSolicitudMant) => `${this.decimalPipe.transform(obj.monto, '1.2-2')}`
    }, {
      columnDef: 'unidadMedida',
      header: 'UNIDAD MEDIDA',
      cell: (obj: DetalleSolicitudMant) => obj.unidadMedida ? `${obj.unidadMedida}` : ''
    }];

  messages = {
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'tambo': {
      'required': 'Campo obligatorio'
    },
    'tipoMantenimiento': {
      'required': 'Campo obligatorio'
    },
    'vehiculo': {
      'required': 'Campo obligatorio'
    },
    'nomProveedor': {
      'required': 'Campo obligatorio'
    },
    'tipoDocumento': {
      'required': 'Campo obligatorio'
    },
    'nroDocumento': {
      'required': 'Campo obligatorio'
    },
    'fecha': {
      'required': 'Campo obligatorio'
    },
    'monto': {
      'required': 'Campo obligatorio'
    },
    'proforma': {
      'required': 'Campo obligatorio'
    },
    'observacion': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'unidad': '',
    'tambo': '',
    'tipoMantenimiento': '',
    'vehiculo': '',
    'nomProveedor': '',
    'tipoDocumento': '',
    'nroDocumento': '',
    'fecha': '',
    'monto': '',
    'proforma': '',
    'observacion': '',
  };

  messages2 = {
    'tipoProducto': {
      'required': 'Campo obligatorio'
    },
    'producto': {
      'required': 'Campo obligatorio'
    },
    'cantidad': {
      'required': 'Campo obligatorio'
    },
    'monto': {
      'required': 'Campo obligatorio'
    },
    'unidadMedida': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors2 = {
    'tipoProducto': '',
    'producto': '',
    'cantidad': '',
    'monto': '',
    'unidadMedida': ''
  };

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RegSolMantenimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private _snackBar: MatSnackBar,
    private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.definirTabla();
    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.formularioGrp = this.fb.group({
      unidad: [{ value: '', disabled: true }, [Validators.required]],
      tambo: ['', [Validators.required]],
      tipoMantenimiento: ['', []],
      vehiculo: ['', []],
      nomProveedor: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      nroDocumento: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      monto: [{ value: '', disabled: true }, [Validators.required]],
      proforma: [{ value: '', disabled: true }, [Validators.required]],
      observacion: ['', []],
    });

    this.detFormularioGrp = this.fb.group({
      tipoProducto: ['', [Validators.required]],
      producto: ['', [Validators.required]],
      cantidad: ['', [Validators.required]],
      monto: ['', [Validators.required]],
      unidadMedida: ['', []]
    });

    console.log(this.detFormularioGrp);
    // console.log(this.detFormularioGrp.nativeElement);

    this.cargarTipoMantenimiento();
    this.cargarTipoProducto();
    this.cargarTipoDocumento();
    this.cargarUnidades();
    this.cargarDatosTabla();
  }

  public cargarTipoMantenimiento() {
    this.tiposMantenimiento = JSON.parse(JSON.stringify(TIPOSMANTENIMIENTO));
    this.formularioGrp.get('tipoMantenimiento').setValue(this.tiposMantenimiento[0]);
  }

  public cargarTipoDocumento() {
    this.tiposDocumento = JSON.parse(JSON.stringify(_tiposDocumento));
    this.formularioGrp.get('tipoDocumento').setValue(this.tiposDocumento[0]);
  }

  public cargarTipoProducto() {
    this.tiposProducto = JSON.parse(JSON.stringify(_tiposProducto));
    this.detFormularioGrp.get('tipoProducto').setValue(this.tiposProducto[0]);
  }

  public cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });

    // if (this.user.perfil.id != 3) {
    //   this.formularioGrp.get('unidad').setValue(this.unidades.filter(el => el.id == this.user.idUnidad)[0]);
    if (true) {
      this.formularioGrp.get('unidad').setValue(this.unidades[0]);
    } else {
      this.formularioGrp.get('unidad').setValue(this.unidades[0]);
    }
    this.cargarTambos();
  }

  public cargarTambos() {
    let idUnidad = this.formularioGrp.get('unidad').value.id;

    this.tambos = JSON.parse(JSON.stringify(TAMBOS.filter(tb => tb.idUnidad == idUnidad)));
    this.tambos.unshift({ id: 0, nombre: 'OFICINA DE UNIDAD TERRITORIAL', idUnidad: 0 });

    // if (this.user.perfil.id == 1) {
    //   this.formularioGrp.get('tambo').setValue(this.tambos.filter(el => el.id == this.user.idTambo)[0]);
    if (true) {
      this.formularioGrp.get('tambo').setValue(this.tambos[0]);
      this.formularioGrp.get('tambo').disable();
    } else {
      // if (this.user.perfil.id == 2) {
      if (true) {
        this.formularioGrp.get('tambo').setValue(this.tambos.filter(el => el.id == 0)[0]);
      } else {
        this.formularioGrp.get('tambo').setValue(this.tambos[0]);
      }
    }

    this.buscar();
  }

  buscar() {
    let idUnidad = this.formularioGrp.get('unidad').value.id;
    let idTambo = this.formularioGrp.get('tambo').value.id;

    this.vehiculos = VEHICULOS.filter(el => (el.idUnidad == idUnidad) || (0 == idUnidad));
    this.vehiculos = this.vehiculos.filter(el => (el.idTambo == idTambo));

    this.formularioGrp.get('vehiculo').setValue(this.vehiculos[0]);
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaDetSolicitud.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaDetSolicitud);
    }
  }

  guardar(): void {
    if (this.formularioGrp.valid) {
      if (this.listaDetSolicitud.length > 0) {
        let kil = new SolicitudMant();
        kil.id = 0;
        kil.idUnidad = this.formularioGrp.get('unidad').value.id;
        kil.nomUnidad = this.formularioGrp.get('unidad').value.nombre;
        kil.idTambo = this.formularioGrp.get('tambo').value.id;
        kil.nomTambo = this.formularioGrp.get('tambo').value.nombre;
        kil.idTipoMantenimiento = this.formularioGrp.get('tipoMantenimiento').value.id;
        kil.nomTipoMantenimiento = this.formularioGrp.get('tipoMantenimiento').value.nombre;
        kil.idVehiculo = this.formularioGrp.get('vehiculo').value.id;
        kil.idTipoVehiculo = this.formularioGrp.get('vehiculo').value.idTipo;
        kil.nomTipoVehiculo = this.formularioGrp.get('vehiculo').value.nomTipo;
        kil.marcaVehiculo = this.formularioGrp.get('vehiculo').value.marca;
        kil.placaVehiculo = this.formularioGrp.get('vehiculo').value.placa;
        // kil.idProveedor = this.formularioGrp.get('nomProveedor').value;
        kil.nomProveedor = this.formularioGrp.get('nomProveedor').value;
        kil.idTipoDocumento = this.formularioGrp.get('tipoDocumento').value.id;
        kil.nomTipoDocumento = this.formularioGrp.get('tipoDocumento').value.nombre;
        kil.nroDocumento = this.formularioGrp.get('nroDocumento').value;
        kil.fecha = this.formularioGrp.get('fecha').value;
        kil.monto = this.formularioGrp.get('monto').value;
        kil.proforma = null;
        kil.observacion = this.formularioGrp.get('observacion').value;
        kil.idEstado = this.estadoSolicitud[0].id;
        kil.nomEstado = this.estadoSolicitud[0].nombre;

        this._snackBar.open('Registrado correctamente', 'OK', { duration: 5000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
        this.dialogRef.close(kil);
      } else {
        this._snackBar.open('Inserte al menos un detalle de solicitud', 'OK', { duration: 5000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

  agregarDetalle() {
    if (this.detFormularioGrp.valid) {
      let kil = new DetalleSolicitudMant();
      kil.id = 0;
      kil.idTipoProducto = this.detFormularioGrp.get('tipoProducto').value.id;
      kil.nomTipoProducto = this.detFormularioGrp.get('tipoProducto').value.nombre;
      kil.producto = this.detFormularioGrp.get('producto').value;
      kil.cantidad = this.detFormularioGrp.get('cantidad').value;
      kil.monto = this.detFormularioGrp.get('monto').value;
      kil.unidadMedida = this.detFormularioGrp.get('unidadMedida').value;

      this.listaDetSolicitud.push(kil);
      this.validationService.setAsUntouched(this.detFormularioGrp, this.formErrors2, ['tipoProducto']);
      this.cargarDatosTabla();
      this.actualizarMontoTotal();
    } else {
      this.validationService.getValidationErrors(this.detFormularioGrp, this.messages2, this.formErrors2, true);
    }
  }

  actualizarMontoTotal(): void {
    let sum = 0;
    this.listaDetSolicitud.forEach(el => {
      sum += el.monto;
    })
    this.formularioGrp.get('monto').setValue(sum);
  }

  delDetalleMant(obj) {
    let index = this.listaDetSolicitud.indexOf(obj);
    this.listaDetSolicitud.splice(index, 1);
  }

  public buscarArchivo(evt): void {
    document.getElementById('fileInput').click();
  }

  public cargarArchivo(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.formularioGrp.get('proforma').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.formularioGrp.get('proforma').setValue(nombreArchivo);
    }
  }


}
