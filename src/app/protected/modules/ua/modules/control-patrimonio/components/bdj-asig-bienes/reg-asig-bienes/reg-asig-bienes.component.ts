import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BienPatrimonio } from '../../../entities/bien-patrimonio.model';
import { MatTableDataSource, MatPaginator, MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DecimalPipe, DatePipe } from '@angular/common';
import { DataDialog } from '../../../../control-combustible/entities/data-dialog.model';
import { BuscarBnsPatrimonComponent } from '../../bdj-baja-bienes/reg-baja-bienes/buscar-bns-patrimon/buscar-bns-patrimon.component';
import { EmpleadoPuestoResponse } from '../../../../control-combustible/dto/response/empleado-puesto.response';
import { BuscarEmpleadoComponent } from '../buscar-empleado/buscar-empleado.component';
import { FichaAsignacion } from '../../../entities/ficha-asignacion.model';
import { _dependencias, _areas } from '../../../data-patrimonio';
import { BnsPatrimonialesService } from '../../../services/bns-patrimoniales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { MessageComponent } from '@shared/components/message/message.component';
import { Session } from '@shared/auth/Session';
import { UaCommonService } from 'app/protected/modules/ua/services/ua-common.service';
import { _perfilesMCP, _estadosFichaAsignacionMCP } from 'app/protected/modules/ua/common-ua';

@Component({
  selector: 'app-reg-asig-bienes',
  templateUrl: './reg-asig-bienes.component.html',
  styleUrls: ['./reg-asig-bienes.component.scss']
})
export class RegAsigBienesComponent implements OnInit {
  flgRegAsistente: boolean = false;
  flgConfPatrimonio: boolean = false;
  flgConfJefe: boolean = false;
  flgConfAsistAdm: boolean = false;

  responsable: EmpleadoPuestoResponse = null;

  formasDispFinal = [];
  dependencias: any[] = [];
  areas: any[] = [];

  formularioGrp: FormGroup;
  messages = {
    'nroDocumento': {
      'required': 'Campo obligatorio'
    },
    'fechaAsignacion': {
      'required': 'Campo obligatorio'
    },
    'nombres': {
      'required': 'Campo obligatorio'
    },
    'dniResponsable': {
      'required': 'Campo obligatorio'
    },
    'cargoResponsable': {
      'required': 'Campo obligatorio'
    },
    'modContratoResponsable': {
      'required': 'Campo obligatorio'
    },
    'local': {
      'required': 'Campo obligatorio'
    },
    'dependencia': {
      'required': 'Campo obligatorio'
    },
    'area': {
      'required': 'Campo obligatorio'
    },
    'pisoAmbiente': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'nroDocumento': '',
    'fechaAsignacion': '',
    'nombres': '',
    'dniResponsable': '',
    'cargoResponsable': '',
    'modContratoResponsable': '',
    'local': '',
    'dependencia': '',
    'area': '',
    'pisoAmbiente': '',
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
    public dialogRef: MatDialogRef<RegAsigBienesComponent>,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    @Inject(BnsPatrimonialesService) private bnsPatrimonialesService: BnsPatrimonialesService,
    @Inject(ValidationService) private validationService: ValidationService,
    @Inject(UaCommonService) private uaCommonService: UaCommonService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nroDocumento: [{ value: `XXXX-${this.datePipe.transform(new Date(), 'yyyy')}`, disabled: false }, [Validators.required]],
      fechaAsignacion: ['', [Validators.required]],
      nombres: [{ value: '', disabled: true }, [Validators.required]],
      dniResponsable: [{ value: '', disabled: true }, [Validators.required]],
      cargoResponsable: [{ value: '', disabled: true }, [Validators.required]],
      modContratoResponsable: [{ value: '', disabled: true }, [Validators.required]],
      local: ['', [Validators.required]],
      dependencia: ['', [Validators.required]],
      area: ['', [Validators.required]],
      pisoAmbiente: ['', [Validators.required]],
    });
    this.formularioGrp.get('fechaAsignacion').setValue(new Date());

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
    this.evaluarBotonesAccion();
    this.definirTabla();
    this.comboDependencias();

    //SI ES PARA VER DETALLE
    if (this.data.objeto != null) {
      this.validationService.disableControls(this.formularioGrp);
      this.listaBienes = this.data.objeto.listaBienes;
      this.cargarDatosTabla();
    } else {

    }
  }

  evaluarBotonesAccion(): void {
    if (!this.data.objeto) {//SI ES QUE NO EXISTE => REGISTRO NUEVO
      if (this.uaCommonService.getIdPerfilMCP() == _perfilesMCP.asistPatrimonio.idCodigo) {
        this.flgRegAsistente = true;
      }
    } else {//CONFORMIDAD REGISTRO
      if (this.uaCommonService.getIdPerfilMCP() == _perfilesMCP.coordPatrimonio.idCodigo && this.data.objeto.idEstadoFicha == _estadosFichaAsignacionMCP.confCoordPatrimonio.idCodigo) {
        this.flgConfPatrimonio = true;
      } else if (this.uaCommonService.getIdPerfilMCP() == _perfilesMCP.jefeUnidad.idCodigo && this.data.objeto.idEstadoFicha == _estadosFichaAsignacionMCP.confJefeUnidad.idCodigo) {
        this.flgConfJefe = true;
      } else if (this.uaCommonService.getIdPerfilMCP() == _perfilesMCP.asistPatrimonio.idCodigo && this.data.objeto.idEstadoFicha == _estadosFichaAsignacionMCP.confAsistPatrimonio.idCodigo) {
        this.flgConfAsistAdm = true;
      }
    }
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.push('opt');
  }

  comboDependencias(): void {
    this.dependencias = JSON.parse(JSON.stringify(_dependencias));

    this.formularioGrp.get('dependencia').setValue(this.dependencias[0]);
    this.comboAreas();
  }

  comboAreas(): void {
    let idDependencia = this.formularioGrp.get('dependencia').value.idCodigo;

    this.areas = JSON.parse(JSON.stringify(_areas.filter(el => (el.fidDependencia == idDependencia || idDependencia == 0))));
    this.formularioGrp.get('area').setValue(this.areas[0]);
    this.formularioGrp.get('local').setValue(this.areas[0].nomLocal);
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaBienes.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaBienes);
      this.dataSource.paginator = this.paginator;
    }
  }

  buscarBienes(): void {
    const dialog = this.dialog.open(BuscarBnsPatrimonComponent, {
      width: '1000px',
      data: { title: 'BUSCAR BIENES PATRIMONIALES', objeto: null }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        result.forEach(el => {
          this.listaBienes.unshift(el);
        });
        this.cargarDatosTabla();
      }
    });
  }

  guardar(): void {
    if (this.formularioGrp.valid && this.responsable != null) {
      if (this.listaBienes.length > 0) {
        let kil = new FichaAsignacion();
        kil.id = 0;
        kil.cidCodigo = this.formularioGrp.get('nroDocumento').value.split('-')[0];
        kil.fecInicio = this.formularioGrp.get('fechaAsignacion').value;
        kil.fidEmpleado = 0;
        kil.nomEmpleado = this.responsable.nombre1 + (this.responsable.nombre2 ? '' + this.responsable.nombre2 : '');
        kil.apeEmpleado = this.responsable.apPaterno + ' ' + this.responsable.apMaterno;
        kil.dniEmpleado = this.formularioGrp.get('dniResponsable').value;
        kil.cargoEmpleado = this.formularioGrp.get('cargoResponsable').value;
        kil.modContratoEmpleado = this.formularioGrp.get('modContratoResponsable').value;
        kil.local = this.formularioGrp.get('local').value;
        kil.idDependencia = this.formularioGrp.get('dependencia').value.idCodigo;
        kil.nomDependencia = this.formularioGrp.get('dependencia').value.cidNombre;
        kil.idArea = this.formularioGrp.get('area').value.idCodigo;
        kil.nomArea = this.formularioGrp.get('area').value.cidNombre;
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
      if (result) {
        this.formularioGrp.get('nombres').setValue(this.responsable.nombre1 + ' ' + this.responsable.nombre2 + ' ' + this.responsable.apPaterno + ' ' + this.responsable.apMaterno);
        this.formularioGrp.get('dniResponsable').setValue('47887880');
        this.formularioGrp.get('cargoResponsable').setValue('JEFE');
        this.formularioGrp.get('modContratoResponsable').setValue('CAS');

        this.formularioGrp.get('dependencia').setValue(this.dependencias[0]);
        this.formularioGrp.get('area').setValue(this.areas[0]);
      } else {
        this.formularioGrp.get('nombres').setValue('');
        this.formularioGrp.get('dniResponsable').setValue('');
        this.formularioGrp.get('cargoResponsable').setValue('');
        this.formularioGrp.get('modContratoResponsable').setValue('');

        this.formularioGrp.get('dependencia').setValue(this.dependencias[0]);
        this.formularioGrp.get('area').setValue(this.areas[0]);
      }
    });
  }

  quitarEmpleado(evt): void {
    this.responsable = null;
    this.formularioGrp.get('nombres').setValue('');
    this.formularioGrp.get('dniResponsable').setValue('');
    this.formularioGrp.get('cargoResponsable').setValue('');
    this.formularioGrp.get('modContratoResponsable').setValue('');
  }

  vista(): void {
    this.spinner.show();
    let params = { url: "/files/cp/Formato01-FichaAsignacionDeBienes.pdf" };
    this.bnsPatrimonialesService.getPdfModelo(params).subscribe(
      (data: any) => {
        const dialog = this.dialog.open(PdfViewerComponent, {
          disableClose: true,
          width: '90%',
          data: { titulo: 'VISTA PREVIA - FICHA DE ASIGNACION DE BIENES', dataBlob: data }
        });
        this.spinner.hide();
      }, error => {
        console.error(error);
        this.spinner.hide();
      });
  }

  conformidad(): void {
    const dialog = this.dialog.open(MessageComponent, {
      data: { title: '', message: '¿ESTA SEGURO QUE DESEA DAR CONFORMIDAD A LA FICHA DE ASIGNACION?', message2: 'Se aplicara una firma digital', alerta: false, confirmacion: true, valor: null },
      disableClose: false
    });

    dialog.afterClosed().subscribe(result => {
      if (result == 1) {
        this.dialogRef.close(null);
      }
    });
  }

}
