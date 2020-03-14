import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { EmpleadoPuestoResponse } from '../../../../control-combustible/dto/response/empleado-puesto.response';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BienPatrimonio } from '../../../entities/bien-patrimonio.model';
import { MatTableDataSource, MatPaginator, MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { BnsPatrimonialesService } from '../../../services/bns-patrimoniales.service';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DecimalPipe, DatePipe } from '@angular/common';
import { DataDialog } from '../../../../control-combustible/entities/data-dialog.model';
import { _dependencias, _motivoIngBT, _areas } from '../../../data-patrimonio';
import { BuscarBnsPatrimonComponent } from '../../bdj-baja-bienes/reg-baja-bienes/buscar-bns-patrimon/buscar-bns-patrimon.component';
import { FichaIngSldaBT } from '../../../entities/ficha-ing-slda-bt';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';
import { BuscarEmpleadoComponent } from '../../bdj-asig-bienes/buscar-empleado/buscar-empleado.component';

@Component({
  selector: 'app-reg-autoriz-ing-slda-bt',
  templateUrl: './reg-autoriz-ing-slda-bt.component.html',
  styleUrls: ['./reg-autoriz-ing-slda-bt.component.scss']
})
export class RegAutorizIngSldaBtComponent implements OnInit {
  responsable: EmpleadoPuestoResponse = null;
  dependencias: any[] = [];
  areas: any[] = [];

  motivos: any[] = _motivoIngBT;

  formasDispFinal = [];

  formularioGrp: FormGroup;
  messages = {
    'nroDocumento': {
      'required': 'Campo obligatorio'
    },
    'fecha': {
      'required': 'Campo obligatorio'
    },
    'tiempo': {
      'required': 'Campo obligatorio'
    },
    'nomDependencia': {
      'required': 'Campo obligatorio'
    },
    'nomPersonaAutorizada': {
      'required': 'Campo obligatorio'
    },
    'dniPersonaAutorizada': {
      'required': 'Campo obligatorio'
    },
    'telPersonaAutorizada': {
      'required': 'Campo obligatorio'
    },
    'unidadPertenencia': {
      'required': 'Campo obligatorio'
    },
    'areaPertenencia': {
      'required': 'Campo obligatorio'
    },
    'motivoIngreso': {
      'required': 'Campo obligatorio'
    },
    'nombres': {
      'required': 'Campo obligatorio'
    },
    'docReferencia': {
      'required': 'Campo obligatorio'
    },
    'dependenciaDestino': {
      'required': 'Campo obligatorio'
    }
  };

  formErrors = {
    'nroDocumento': '',
    'fecha': '',
    'tiempo': '',
    'nomDependencia': '',
    'nomPersonaAutorizada': '',
    'dniPersonaAutorizada': '',
    'telPersonaAutorizada': '',
    'unidadPertenencia': '',
    'areaPertenencia': '',
    'motivoIngreso': '',
    'nombres': '',
    'docReferencia': '',
    'dependenciaDestino': '',
  };

  listaBienes: BienPatrimonio[] = [];
  dataSource: MatTableDataSource<BienPatrimonio> = null;
  displayedColumns: string[];
  columnsGrilla = [
    {
      columnDef: 'unidad',
      header: 'UNIDAD',
      cell: (bn: BienPatrimonio) => (bn.unidad != null) ? `${bn.unidad.nombre}` : ''
    }, {
      columnDef: 'tambo',
      header: 'TAMBO',
      cell: (bn: BienPatrimonio) => (bn.tambo != null) ? `${bn.tambo.nombre}` : ''
    }, {
      columnDef: 'codPatrimonio',
      header: 'CODIGO PATRIMONIO',
      cell: (bn: BienPatrimonio) => (bn.codPatrimonio != null) ? `${bn.codPatrimonio}` : ''
    }, {
      columnDef: 'denominacion',
      header: 'DESCRIPCION BIEN',
      cell: (bn: BienPatrimonio) => (bn.denominacion != null) ? `${bn.denominacion.cidNombre}` : ''
    }, {
      columnDef: 'marca',
      header: 'MARCA',
      cell: (bn: BienPatrimonio) => (bn.marca != null) ? `${bn.marca.nombre}` : ''
    }, {
      columnDef: 'modelo',
      header: 'MODELO',
      cell: (bn: BienPatrimonio) => (bn.modelo != null) ? `${bn.modelo.nombre}` : ''
    }, {
      columnDef: 'color',
      header: 'COLOR',
      cell: (bn: BienPatrimonio) => (bn.color != null) ? `${this.mostrarColor(bn.color)}` : ''
    }, {
      columnDef: 'serie',
      header: 'SERIE',
      cell: (bn: BienPatrimonio) => (bn.cidSerie != null) ? `${bn.cidSerie}` : ''
    }, {
      columnDef: 'medida',
      header: 'MEDIDA',
      cell: (bn: BienPatrimonio) => (bn.txtMedida != null) ? `${bn.txtMedida}` : ''
    }, {
      columnDef: 'anio',
      header: 'AÑO',
      cell: (bn: BienPatrimonio) => (bn.anio != null) ? `${bn.anio}` : ''
    }, {
      columnDef: 'placa',
      header: 'PLACA',
      cell: (bn: BienPatrimonio) => (bn.placa != null) ? `${bn.placa}` : ''
    }, {
      columnDef: 'chasis',
      header: 'CHASIS',
      cell: (bn: BienPatrimonio) => (bn.chasis != null) ? `${bn.chasis}` : ''
    }, {
      columnDef: 'motor',
      header: 'MOTOR',
      cell: (bn: BienPatrimonio) => (bn.motor != null) ? `${bn.motor}` : ''
    }, {
      columnDef: 'nomEstado',
      header: 'ESTADO',
      cell: (bn: BienPatrimonio) => (bn.estado != null) ? `${bn.estado.nombre}` : ''
    }, {
      columnDef: 'caracteristica',
      header: 'CARACTERISTICAS',
      cell: (bn: BienPatrimonio) => (bn.txtCaracteristica != null) ? (bn.txtCaracteristica.length > 60 ? `${bn.txtCaracteristica.substr(0, 59)}...` : `${bn.txtCaracteristica}`) : ''
    }, {
      columnDef: 'codigoCuenta',
      header: 'CUENTA',
      cell: (bn: BienPatrimonio) => (bn.cuenta.codigo != null) ? bn.cuenta.codigo : ''
    }, {
      columnDef: 'nombreCuenta',
      header: 'DESCRIPCION DE LA CUENTA',
      cell: (bn: BienPatrimonio) => (bn.cuenta.nombre != null) ? bn.cuenta.nombre : ''
    }, {
      columnDef: 'fechaRegistro',
      header: 'FECHA REGISTRO',
      cell: (bn: BienPatrimonio) => this.datePipe.transform(bn.fechaRegistro, 'dd/MM/yyyy')
    }, {
      columnDef: 'fechaContabilidad',
      header: 'FECHA CONTABILIDAD',
      cell: (bn: BienPatrimonio) => this.datePipe.transform(bn.fechaContabilidad, 'dd/MM/yyyy')
    }, {
      columnDef: 'nroDocAdquisicion',
      header: 'NRO. DOC. ADQUISICION',
      cell: (bn: BienPatrimonio) => (bn.nroDocAdquisicion != null) ? bn.nroDocAdquisicion : ''
    }, {
      columnDef: 'valorAdquisicion',
      header: 'VALOR ADQUISICION',
      cell: (bn: BienPatrimonio) => this.decimalPipe.transform(bn.valorAdquisicion, '1.2-2')
    }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegAutorizIngSldaBtComponent>,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    @Inject(BnsPatrimonialesService) private bnsPatrimonialesService: BnsPatrimonialesService,
    @Inject(ValidationService) private validationService: ValidationService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nroDocumento: [{ value: `XXXX-${this.datePipe.transform(new Date(), 'yyyy')}`, disabled: false }, [Validators.required]],
      fecha: ['', [Validators.required]],
      tiempo: ['', [Validators.required]],

      nomDependencia: ['', [Validators.required]],
      nomPersonaAutorizada: [{ value: '', disabled: false }, [Validators.required]],
      dniPersonaAutorizada: [{ value: '', disabled: false }, [Validators.required]],
      telPersonaAutorizada: [{ value: '', disabled: false }, [Validators.required]],
      unidadPertenencia: [{ value: '', disabled: false }, [Validators.required]],
      areaPertenencia: [{ value: '', disabled: false }, [Validators.required]],
      motivoIngreso: [{ value: '', disabled: false }, [Validators.required]],

      nombres: ['', [Validators.required]],
      docReferencia: ['', [Validators.required]],
      dependenciaDestino: ['', [Validators.required]],
    });
    this.formularioGrp.get('fecha').setValue(new Date());

    this.inicializarVariables();
  }

  mostrarColor(lista: any) {
    let colores = '';
    lista.forEach(el => {
      colores += el.nombre + ',';
    });
    return colores.substr(0, lista.length - 2);
  }

  salir(): void {
    this.dialogRef.close(null);
  }

  public inicializarVariables(): void {
    this.comboDependencias();
    this.definirTabla();
  }

  comboDependencias(): void {
    this.dependencias = JSON.parse(JSON.stringify(_dependencias));

    this.formularioGrp.get('dependenciaDestino').setValue(this.dependencias[0]);
    this.formularioGrp.get('unidadPertenencia').setValue(this.dependencias[0]);

    this.comboAreas();
  }

  comboAreas(): void {
    this.areas = [];
    let idDependencia = this.formularioGrp.get('unidadPertenencia').value.idCodigo;

    this.areas = JSON.parse(JSON.stringify(_areas.filter(el => (el.fidDependencia == idDependencia))));
    this.formularioGrp.get('areaPertenencia').setValue(this.areas[0]);
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaBienes.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaBienes);
      this.dataSource.paginator = this.paginator;
    }
  }

  buscarBienes(): void {
    const dialogRef3 = this.dialog.open(BuscarBnsPatrimonComponent, {
      width: '1000px',
      data: { title: 'BUSCAR BIENES PATRIMONIALES', objeto: null }
    });

    dialogRef3.afterClosed().subscribe(result => {
      if (result) {
        result.forEach(el => {
          this.listaBienes.unshift(el);
        });
        this.cargarDatosTabla();
      }
    });
  }

  guardar(): void {
    if (this.formularioGrp.valid) {
      if (this.listaBienes.length > 0) {
        let kil = new FichaIngSldaBT();
        kil.id = 0;
        kil.cidCodigo = this.formularioGrp.get('nroDocumento').value.split('-')[0];
        kil.fecha = this.formularioGrp.get('fecha').value;
        kil.nomUsuario = this.responsable.nombre1 + (this.responsable.nombre2 ? '' + this.responsable.nombre2 : '');
        // kil.apeEmpleado = this.responsable.apPaterno + ' ' + this.responsable.apMaterno;
        // kil.dniEmpleado = this.formularioGrp.get('dniResponsable').value;
        // kil.cargoEmpleado = this.formularioGrp.get('cargoResponsable').value;
        // kil.modContratoEmpleado = this.formularioGrp.get('modContratoResponsable').value;
        // kil.local = this.formularioGrp.get('local').value;
        // kil.dependencia = this.formularioGrp.get('dependencia').value;
        // kil.oficina = this.formularioGrp.get('oficina').value;
        kil.cantBienes = this.listaBienes.length;

        this.dialogRef.close(kil);
      } else {
        this._snackBar.open('Agregue al menos un bien', '', { duration: 5000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }


  buscarEmpleado(evt): void {
    const dialogRef = this.dialog.open(BuscarEmpleadoComponent, {
      width: '800px',
      data: { title: 'BUSCAR EMPLEADO', objeto: this.data.objeto }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.responsable = result;
      result ? this.formularioGrp.get('nombres').setValue(this.responsable.nombre1 + ' ' + this.responsable.nombre2 + ' ' + this.responsable.apPaterno + ' ' + this.responsable.apMaterno) : this.formularioGrp.get('nombres').setValue('');
    });
  }

  quitarEmpleado(evt): void {
    this.responsable = null;
    this.formularioGrp.get('nombres').setValue('');
  }

  vista(): void {
    this.spinner.show();
    let params = { url: "/files/cp/Formato04-AutorizacionIngresoSalidaBT.pdf" };
    this.bnsPatrimonialesService.getPdfModelo(params).subscribe(
      (data: any) => {
        const dialogRef = this.dialog.open(PdfViewerComponent, {
          disableClose: true,
          width: '90%',
          data: { titulo: 'AUTORIZACION SALIDA/RETORNO BIENES DE TERCEROS', dataBlob: data }
        });
        this.spinner.hide();
      }, error => {
        console.error(error);
        this.spinner.hide();
      });
  }
}
