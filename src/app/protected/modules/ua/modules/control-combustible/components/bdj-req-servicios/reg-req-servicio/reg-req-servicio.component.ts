import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MantenimientoVehicular } from '../../../entities/mantenimiento-vehiculo.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SolicitudMant } from '../../../entities/solicitud-mant.model';
import { MatTableDataSource, MatPaginator, MatStepper, MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { TIPOSDOCSANEXO, TIPOSPRESUPUESTO, UNIDADES, _solicitudesMant } from '../../../data-combustible';
import { EjecucionPresupuestal } from '../../../entities/ejecucion-presupuestal.model';
import { DetalleEjecucion } from '../../../entities/detalle-ejecucion.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DecimalPipe, DatePipe } from '@angular/common';
import { DataDialog } from '../../../entities/data-dialog.model';
import { BuscarSolMantComponent } from './buscar-sol-mant/buscar-sol-mant.component';
import { VerDetMantComponent } from './ver-det-mant/ver-det-mant.component';
import { BuscarOrdenComponent } from './buscar-orden/buscar-orden.component';
import { RegSolFonfecgComponent } from './reg-sol-fonfecg/reg-sol-fonfecg.component';

@Component({
  selector: 'app-reg-req-servicio',
  templateUrl: './reg-req-servicio.component.html',
  styleUrls: ['./reg-req-servicio.component.scss']
})
export class RegReqServicioComponent implements OnInit {
  unidades = [];
  tiposMantenimiento = [];
  tiposDocsAnexo = TIPOSDOCSANEXO;
  tiposPresupuesto = TIPOSPRESUPUESTO;

  mantenimiento: MantenimientoVehicular;
  fileupload: any;

  subformularioGrp: FormGroup;
  formularioGrp: FormGroup;
  messages = {
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'tipoMantenimiento': {
      'required': 'Campo obligatorio'
    },
    'presupuesto': {
      'required': 'Campo obligatorio'
    },
    'nroHojatramiteConf': {
      'required': 'Campo obligatorio'
    },
    'nroInformeConf': {
      'required': 'Campo obligatorio'
    },
    'actaRecepcionEmpresa': {
      'required': 'Campo obligatorio'
    },
    'cartaInformeProveedor': {
      'required': 'Campo obligatorio'
    },
    'actaRecepccionUURR': {
      'required': 'Campo obligatorio'
    },
    'cantVehiculos': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'unidad': '',
    'tipoMantenimiento': '',
    'presupuesto': '',
    'nroHojatramiteConf': '',
    'nroInformeConf': '',
    'actaRecepcionEmpresa': '',
    'cartaInformeProveedor': '',
    'actaRecepccionUURR': '',
    'cantVehiculos': ''
  };

  formularioGrp1: FormGroup;
  messages1 = {
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'asuntoRequerimiento': {
      'required': 'Campo obligatorio'
    },
    'cotizacion': {
      'required': 'Campo obligatorio'
    },
    'nroHt': {
      'required': 'Campo obligatorio'
    },
    'nroInforme': {
      'required': 'Campo obligatorio'
    },
    'documentacion': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors1 = {
    'unidad': '',
    'asuntoRequerimiento': '',
    'cotizacion': '',
    'nroHt': '',
    'nroInforme': '',
    'documentacion': '',
  };

  formularioGrp2: FormGroup;

  listaSolicitudesMant: SolicitudMant[] = [];
  dataSource1: MatTableDataSource<SolicitudMant> = null;
  displayedColumns1: string[];
  columnsGrilla1 = [
    {
      columnDef: 'id',
      header: 'N°',
      cell: (cond: SolicitudMant) => `${cond.id}`
    }, {
      columnDef: 'nomTambo',
      header: 'TAMBO',
      cell: (cond: SolicitudMant) => `${cond.nomTambo}`
    }, {
      columnDef: 'nomTipoMantenimiento',
      header: 'TIPO MANTENIMIENTO',
      cell: (cond: SolicitudMant) => `${cond.nomTipoMantenimiento}`
    }, {
      columnDef: 'nomTipoVehiculo',
      header: 'VEHICULO',
      cell: (cond: SolicitudMant) => `${cond.nomTipoVehiculo} ${cond.marcaVehiculo} ${cond.placaVehiculo}`
    }, {
      columnDef: 'nomProveedor',
      header: 'PROVEEDOR',
      cell: (cond: SolicitudMant) => `${cond.nomProveedor} - ${cond.nomTipoDocumento}: ${cond.nroDocumento}`
    }, {
      columnDef: 'monto',
      header: 'MONTO',
      cell: (cond: SolicitudMant) => `S/.${this.decimalPipe.transform(cond.monto, '1.2-2')}`
    }, {
      columnDef: 'fecha',
      header: 'FECHA',
      cell: (cond: SolicitudMant) => this.datePipe.transform(cond.fecha, 'dd/MM/yyyy')
    }];



  ejecucionPresupuestal: EjecucionPresupuestal;


  listaDetalleAfectacion: DetalleEjecucion[] = [];
  dataSource2: MatTableDataSource<DetalleEjecucion> = null;
  displayedColumns2: string[];
  columnsGrilla2 = [
    {
      columnDef: 'ffRb',
      header: 'FF/Rb',
      cell: (det: DetalleEjecucion) => `${det.ffRb}`
    }, {
      columnDef: 'metaNmonico',
      header: 'Meta/Nmonico',
      cell: (det: DetalleEjecucion) => `${det.metaNmonico}`
    }, {
      columnDef: 'clasificadorGasto',
      header: 'Clasif. Gasto',
      cell: (det: DetalleEjecucion) => `${det.clasificadorGasto}`
    }, {
      columnDef: 'descripcion',
      header: 'Descripcion',
      cell: (det: DetalleEjecucion) => `${det.descripcion}`
    }, {
      columnDef: 'monto',
      header: 'Monto',
      cell: (det: DetalleEjecucion) => `${this.decimalPipe.transform(det.monto, '1.2-2')}`
    }];


  dataSource: MatTableDataSource<SolicitudMant> = null;
  displayedColumns: string[];
  isLoading: boolean = false;
  columnsGrilla = [
    {
      columnDef: 'nomTambo',
      header: 'TAMBO',
      cell: (cond: SolicitudMant) => `${cond.nomTambo}`
    }, {
      columnDef: 'nomTipoMantenimiento',
      header: 'TIPO MANTENIMIENTO',
      cell: (cond: SolicitudMant) => `${cond.nomTipoMantenimiento}`
    }, {
      columnDef: 'nomTipoVehiculo',
      header: 'VEHICULO',
      cell: (cond: SolicitudMant) => `${cond.nomTipoVehiculo} ${cond.marcaVehiculo} ${cond.placaVehiculo}`
    }, {
      columnDef: 'nomProveedor',
      header: 'PROVEEDOR',
      cell: (cond: SolicitudMant) => `${cond.nomProveedor} - ${cond.nomTipoDocumento}: ${cond.nroDocumento}`
    }, {
      columnDef: 'monto',
      header: 'MONTO',
      cell: (cond: SolicitudMant) => `S/.${this.decimalPipe.transform(cond.monto, '1.2-2')}`
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator1: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  @ViewChild('stepper') private myStepper: MatStepper;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegReqServicioComponent>,
    public dialog: MatDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog) { }

  ngOnInit() {
    this.formularioGrp1 = this.fb.group({
      // unidad: [{ value: '', disabled: this.user.perfil.id == 3 }, [Validators.required]],
      unidad: [{ value: '', disabled: false }, [Validators.required]],
      asuntoRequerimiento: ['', [Validators.required]],
      // tipoDocAnexo: [{ value: '', disabled: this.user.perfil.id == 3 }, [Validators.required]],
      // cotizacion: [{ value: '', disabled: this.user.perfil.id == 3 }, [Validators.required]],
      // nroHt: [{ value: '', disabled: this.user.perfil.id == 3 }, [Validators.required]],
      // nroInforme: [{ value: '', disabled: this.user.perfil.id == 3 }, [Validators.required]],
      tipoDocAnexo: [{ value: '', disabled: false }, [Validators.required]],
      cotizacion: [{ value: '', disabled: false }, [Validators.required]],
      nroHt: [{ value: '', disabled: false }, [Validators.required]],
      nroInforme: [{ value: '', disabled: false }, [Validators.required]],
      documentacion: [{ value: '', disabled: true }, [Validators.required]],
      nomTdrEett: [{ value: '', disabled: true }, [Validators.required]],
      nroFondoEncargo: [{ value: '', disabled: true }, [Validators.required]],
    });

    this.formularioGrp2 = this.fb.group({
      // ordenServicio: [{ value: '', disabled: this.user.perfil.id != 3 }, [Validators.required]],
      ordenServicio: [{ value: '', disabled: true }, [Validators.required]],
      tipoPresupuesto: ['', [Validators.required]],
      monto: ['', [Validators.required]]
    });

    this.formularioGrp = this.fb.group({
      // unidad: [{ value: '', disabled: this.user.perfil.id == 3 }, [Validators.required]],
      // nroHojatramiteConf: [{ value: '', disabled: this.user.perfil.id == 3 }, [Validators.required]],
      // nroInformeConf: [{ value: '', disabled: this.user.perfil.id == 3 }, [Validators.required]],
      unidad: [{ value: '', disabled: false }, [Validators.required]],
      nroHojatramiteConf: [{ value: '', disabled: false }, [Validators.required]],
      nroInformeConf: [{ value: '', disabled: false }, [Validators.required]],
      docsConformidad: [{ value: '', disabled: true }, [Validators.required]],
      // obsRecepccionUURR: [{ value: '', disabled: this.user.perfil.id == 3 }, []]
      obsRecepccionUURR: [{ value: '', disabled: true }, []]
    });
    this.inicializarVariables();
  }

  // get getUser() { return this.user };

  salir(): void {
    this.dialogRef.close(null);
  }


  validateForm(): void {
    this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
  }

  public inicializarVariables(): void {
    if (this.data.objeto == null) {//NUEVO MANTENIMIENTO
      this.mantenimiento = new MantenimientoVehicular();
      this.mantenimiento.idEstadoMantenimiento = 1;
      this.formularioGrp1.get('tipoDocAnexo').setValue(this.tiposDocsAnexo[0]);
      this.formularioGrp2.get('tipoPresupuesto').setValue(this.tiposPresupuesto[0]);
      this.cargarDatosTabla();
    } else {//MANTENIMIENTO EXISTENTE
      this.mantenimiento = JSON.parse(JSON.stringify(this.data.objeto));
      this.listaSolicitudesMant = _solicitudesMant.slice(0, 2);
      this.formularioGrp1.get('tipoDocAnexo').setValue(this.tiposDocsAnexo.filter(el => el.id == this.mantenimiento.idTipoAsigPresupuesto)[0]);
      this.formularioGrp2.get('tipoPresupuesto').setValue(this.tiposPresupuesto.filter(el => el.id == this.mantenimiento.idTipoAsigPresupuesto)[0]);
      this.cargarDatosTabla1();
      this.cargarDatosTabla();
      // if (this.user.perfil.id == 3) {
      if (true) {
        this.formularioGrp1.get('unidad').setValue(this.unidades.filter(el => el.id == this.mantenimiento.idUnidad)[0]);
        this.formularioGrp1.get('cotizacion').setValue(this.mantenimiento.cotizacion);
        this.formularioGrp1.get('nroHt').setValue(this.mantenimiento.nroHojatramiteReq);
        this.formularioGrp1.get('nroInforme').setValue(this.mantenimiento.nroInformeReq);
        this.move(1);//IR A 2 TAB
      } else {
        this.formularioGrp1.get('unidad').setValue(this.unidades.filter(el => el.id == this.mantenimiento.idUnidad)[0]);
        this.formularioGrp1.get('cotizacion').setValue(this.mantenimiento.cotizacion);
        this.formularioGrp1.get('nroHt').setValue(this.mantenimiento.nroHojatramiteReq);
        this.formularioGrp1.get('nroInforme').setValue(this.mantenimiento.nroInformeReq);
        if (this.mantenimiento.idEstadoMantenimiento == 1) {
          this.move(0);//IR A 2 TAB
        } else {
          this.move(2);//IR A 2 TAB
        }
      }
    }

    this.deshabilitarCampos(this.mantenimiento);
    this.cargarUnidades();
    // this.cargarTipomantenimiento();
    // this.formularioGrp.get('cantVehiculos').setValue(1);

    this.calcularCotizacion();

    this.definirTabla();
    // this.listarDetalleMantenimiento();
  }

  // tipoSustento() {
  //   if (this.formularioGrp1.get('tipoPresupuesto').value.id == 1 || this.formularioGrp1.get('tipoPresupuesto').value.id == 2) {
  //     this.tipoOrden = true;
  //   } else {
  //     if (this.formularioGrp1.get('tipoPresupuesto').value.id == 3) {

  //     } else {

  //     }
  //   }
  // }

  definirTabla(): void {
    this.displayedColumns1 = [];
    this.columnsGrilla1.forEach(c => {
      this.displayedColumns1.push(c.columnDef);
    });
    this.displayedColumns1.push('opt');

    //TABLA SEGUNDA
    this.displayedColumns2 = [];
    this.columnsGrilla2.forEach(c => {
      this.displayedColumns2.push(c.columnDef);
    });
    this.displayedColumns2.unshift('id');

    //TABLA TERCERA
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
    this.displayedColumns.push('fechaMant');
    this.displayedColumns.push('kilometrajeInicio');
    this.displayedColumns.push('opt');
  }

  deshabilitarCampos(mant: MantenimientoVehicular) {
    if (mant.idEstadoMantenimiento == 1) {//HABILITAR STEP 1
      this.validationService.disableControls(this.formularioGrp2);
      this.validationService.disableControls(this.formularioGrp);
    }

    if (mant.idEstadoMantenimiento == 2) {
      this.validationService.disableControls(this.formularioGrp1);
      this.validationService.disableControls(this.formularioGrp);
    }

    if (mant.idEstadoMantenimiento == 3) {
      this.validationService.disableControls(this.formularioGrp1);
      this.validationService.disableControls(this.formularioGrp2);
    }
  }

  // listarDetalleMantenimiento(): void {
  //   this.listaDetalleMantenimiento = [];
  //   let cant = this.formularioGrp.get('cantVehiculos').value;
  //   for (let i = 0; i < cant; i++) {
  //     let det = new DetalleMantenimiento();
  //     det.id = i;
  //     this.listaDetalleMantenimiento.push(det);
  //   }

  //   this.cargarDatosTabla();
  // }

  public cargarDatosTabla1(): void {
    this.dataSource1 = null;
    if (this.listaSolicitudesMant.length > 0) {
      this.dataSource1 = new MatTableDataSource(this.listaSolicitudesMant);
      this.dataSource1.paginator = this.paginator1;
    }
  }

  public cargarDatosTabla2(): void {
    this.dataSource2 = null;
    if (this.listaDetalleAfectacion.length > 0) {
      this.dataSource2 = new MatTableDataSource(this.listaDetalleAfectacion);
      this.dataSource2.paginator = this.paginator2;
    }
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaSolicitudesMant.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaSolicitudesMant);
      this.dataSource.paginator = this.paginator;
    }

    this.cargarControles();
  }

  cargarControles(): void {
    const frmCtrl = {};
    for (let i = 1; i <= this.listaSolicitudesMant.length; i++) {
      // frmCtrl[`u${i}`] = new FormControl(null);
      // frmCtrl[`t${i}`] = new FormControl(null);
      // frmCtrl[`vh${i}`] = new FormControl(null);
      frmCtrl[`f${i}`] = new FormControl(null);
      // frmCtrl[`e${i}`] = new FormControl(null);
      frmCtrl[`k${i}`] = new FormControl(null);
    };

    this.subformularioGrp = new FormGroup(frmCtrl);
  }

  // public cargarTipomantenimiento() {
  //   this.tiposMantenimiento = JSON.parse(JSON.stringify(TIPOSMANTENIMIENTO));
  //   this.formularioGrp1.get('tipoMantenimiento').setValue(this.tiposMantenimiento[0]);

  //   this.formularioGrp.get('tipoMantenimiento').setValue(this.tiposMantenimiento[0]);
  //   this.formularioGrp.get('cantVehiculos').setValue(1);
  // }

  public cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    // if (this.user.perfil.id != 3) {
    //   this.formularioGrp.get('unidad').setValue(this.unidades.filter(el => el.id == this.user.idUnidad)[0]);
    //   this.formularioGrp1.get('unidad').setValue(this.unidades.filter(el => el.id == this.user.idUnidad)[0]);
    if (true) {
      this.formularioGrp.get('unidad').setValue(this.unidades[0]);
      this.formularioGrp1.get('unidad').setValue(this.unidades[0]);
    } else {
      this.formularioGrp.get('unidad').setValue(this.unidades[0]);
      this.formularioGrp1.get('unidad').setValue(this.unidades[0]);
    }
  }

  calcularCotizacion(): void {
    if (this.listaSolicitudesMant.length > 0) {
      let cal = 0;
      this.listaSolicitudesMant.forEach(el => {
        cal += el.monto;
      });
      this.formularioGrp1.get('cotizacion').setValue(cal);
    } else {
      this.formularioGrp1.get('cotizacion').setValue(0);
    }
  }

  buscarSolicitudesMant(): void {
    const dialogRef3 = this.dialog.open(BuscarSolMantComponent, {
      width: '800px',
      data: { title: 'BUSCAR SOLICITUDES MANTENIMIENTO', objeto: null }
    });

    dialogRef3.afterClosed().subscribe(result => {
      if (result) {
        result.forEach(el => {
          this.listaSolicitudesMant.push(el);
        });
        this.cargarDatosTabla1();
        this.cargarDatosTabla();//PARA CONFORMIDAD MANT
        this.calcularCotizacion();
      }
    });
  }

  // generarFormulario(): void {
  //   let cant = this.formularioGrp.get('cantVehiculos').value;
  //   if (cant > 0) {
  //     this.listarDetalleMantenimiento();
  //   }
  // }

  guardar(): void {
    if (this.formularioGrp.valid) {
      let kil = new MantenimientoVehicular();
      kil.id = 0;
      kil.idUnidad = this.formularioGrp.get('unidad').value.id;
      kil.nomUnidad = this.formularioGrp.get('unidad').value.nombre;
      kil.asuntoRequerimiento = this.formularioGrp.get('asuntoRequerimiento').value;
      // kil.nomTipoMantenimiento = this.formularioGrp.get('tipoMantenimiento').value.nombre;
      // kil.idTipoAsigPresupuesto = this.formularioGrp.get('tipoPresupuesto').value.id;
      // kil.nomTipoAsigPresupuesto = this.formularioGrp.get('tipoPresupuesto').value.nombre;
      kil.codAsigPresupuesto = this.formularioGrp.get('codAsigPresupuesto').value;
      kil.importeAsigPresupuesto = this.formularioGrp.get('importeAsigPresupuesto').value;

      console.log(kil);
      console.log('TODO CORRECTO');
    } else {
      this.validateForm();
    }

  }

  public buscarDocsConformidad(evt): void {
    document.getElementById('fileInput').click();
  }

  public cargarDocsConformidad(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.formularioGrp.get('docsConformidad').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.formularioGrp.get('docsConformidad').setValue(nombreArchivo);
    }
  }

  // public buscarActa(evt): void {
  //   document.getElementById('fileInput').click();
  // }

  // public cargarArchivo(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
  //   this.fileupload = event.target.files[0];
  //   if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
  //     this.formularioGrp.get('actaRecepcionEmpresa').setValue(null);
  //   } else {
  //     const nombreArchivo = this.fileupload.name;
  //     this.formularioGrp.get('actaRecepcionEmpresa').setValue(nombreArchivo);
  //   }
  // }

  // public buscarActa2(evt): void {
  //   document.getElementById('fileInput2').click();
  // }

  // public cargarArchivo2(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
  //   this.fileupload = event.target.files[0];
  //   if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
  //     this.formularioGrp.get('cartaInformeProveedor').setValue(null);
  //   } else {
  //     const nombreArchivo = this.fileupload.name;
  //     this.formularioGrp.get('cartaInformeProveedor').setValue(nombreArchivo);
  //   }
  // }

  // public buscarActa3(evt): void {
  //   document.getElementById('fileInput3').click();
  // }

  // public cargarArchivo3(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
  //   this.fileupload = event.target.files[0];
  //   if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
  //     this.formularioGrp.get('actaRecepccionUURR').setValue(null);
  //   } else {
  //     const nombreArchivo = this.fileupload.name;
  //     this.formularioGrp.get('actaRecepccionUURR').setValue(nombreArchivo);
  //   }
  // }

  regDetalleServicio(obj): void {
    const dialogRef2 = this.dialog.open(VerDetMantComponent, {
      width: '600px',
      data: { title: 'VER DETALLE SOLICITUD DE MANTENIMIENTO', objeto: null }
    });

    dialogRef2.afterClosed().subscribe(result => {
      console.log(result);
      // this.listaMantenimientos.splice(indice,1);
      // this.listaMantenimientos.push(result);
      // this.cargarDatosTabla();
    });
  }




  public buscarRequerimiento(evt): void {
    document.getElementById('fileRequerimiento').click();
  }

  public cargarRequerimiento(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.formularioGrp1.get('documentacion').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.formularioGrp1.get('documentacion').setValue(nombreArchivo);
    }
  }

  public buscarArchivoB1(evt): void {
    document.getElementById('fileInputB1').click();
  }

  public cargarArchivoB1(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.formularioGrp2.get('ordenServicio').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.formularioGrp2.get('ordenServicio').setValue(nombreArchivo);
    }
  }

  anterior(stepper: MatStepper) {
    stepper.previous();
  }

  siguiente(stepper: MatStepper) {
    if (stepper.selectedIndex == 0) {
      //VALIDAR FORM 1
      if (this.formularioGrp1.valid) {
        if (this.listaSolicitudesMant.length > 0) {
          let kil = new MantenimientoVehicular();
          kil.id = 0;
          kil.idUnidad = this.formularioGrp1.get('unidad').value.id;
          kil.nomUnidad = this.formularioGrp1.get('unidad').value.nombre;
          kil.asuntoRequerimiento = this.formularioGrp1.get('asuntoRequerimiento').value;
          // kil.nomTipoMantenimiento = this.formularioGrp1.get('tipoMantenimiento').value.nombre;

          console.log(kil);
          stepper.next();
        } else {
          this._snackBar.open('Agregue al menos una solicitud de mantenimiento', 'OK', { duration: 5000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
      } else {
        this.validationService.getValidationErrors(this.formularioGrp1, this.messages1, this.formErrors1, true);
      }
    } else {
      if (stepper.selectedIndex == 1) {
        //VALIDAR FORM 2
        if (this.formularioGrp2.valid) {
          let kil = new MantenimientoVehicular();
          kil.id = 0;
          kil.codAsigPresupuesto = this.formularioGrp2.get('ordenServicio').value;

          console.log(kil);
          stepper.next();
        } else {
          this.validationService.getValidationErrors(this.formularioGrp1, this.messages1, this.formErrors1, true);
        }
      } else {
        //VALIDAR FORM 3
      }
    }
  }

  buscarOrdenServicio(evt): void {
    const dialogRef3 = this.dialog.open(BuscarOrdenComponent, {
      width: '800px',
      data: { title: 'BUSCAR ORDEN SERVICIO/RESOLUCION FONDO ENCARGO', objeto: null }
    });

    dialogRef3.afterClosed().subscribe(result => {
      if (result) {
        this.ejecucionPresupuestal = result;
        console.log(this.ejecucionPresupuestal);
        this.formularioGrp2.get('ordenServicio').setValue((this.ejecucionPresupuestal.nroOrdencompra != null && this.ejecucionPresupuestal.nroOrdencompra != '') ? this.ejecucionPresupuestal.nroOrdencompra : this.ejecucionPresupuestal.nroResAdministracion);
        this.formularioGrp2.get('tipoPresupuesto').setValue(this.tiposPresupuesto.filter(el => el.id == this.ejecucionPresupuestal.idTipoejecucion)[0]);
        this.formularioGrp2.get('monto').setValue(this.ejecucionPresupuestal.monto);

        let detEjecucion = new DetalleEjecucion();
        detEjecucion.id = 0;
        detEjecucion.metaNmonico = '0023';
        detEjecucion.descripcion = 'MANTENIMIENTO MOTOCILETA';
        detEjecucion.ffRb = '1-00';
        detEjecucion.clasificadorGasto = '2.3.24.13';
        detEjecucion.monto = 9256.00;

        this.listaDetalleAfectacion = [];
        this.listaDetalleAfectacion.push(detEjecucion);
        this.cargarDatosTabla2();
      }
    });
  }

  quitarSolicitudMant(el): void {

  }

  move(index: number) {
    this.myStepper.selectedIndex = index;
  }

  //FORMULARIO 1

  public buscarTdrEett(evt): void {
    document.getElementById('fileTdrEett').click();
  }

  public cargarTdrEett(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.formularioGrp1.get('nomTdrEett').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.formularioGrp1.get('nomTdrEett').setValue(nombreArchivo);
    }
  }

  solFondoEncargo(): void {
    const dialogRef3 = this.dialog.open(RegSolFonfecgComponent, {
      width: '900px',
      data: { title: 'FORMATO N° 01: SOLICITUD DE OTORGAMIENTO DE ENCARGO', objeto: { tipo: 1 } }//TIPO: 1(BIENES), 2(SERVICIOS)
    });

    dialogRef3.afterClosed().subscribe(result => {
      console.log(result);
      // this.listaMantenimientos.splice(indice,1);
      // this.listaMantenimientos.push(result);
      // this.cargarDatosTabla();
    });
  }

}
