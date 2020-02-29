import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataDialog } from '../../../entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DatePipe } from '@angular/common';
import { BnsPatrimonioService } from '../../../services/bns-patrimonio.service';
import { BuscarEmpleadoComponent } from './buscar-empleado/buscar-empleado.component';
import { EmpleadoPuestoResponse } from '../../../dto/response/empleado-puesto.response';
import { WsApiOutResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/WsApiOutResponse';
import { ConductorVehiculoRequest } from '../../../dto/request/conductor-vehiculo.request';
import { VehiculoResponse } from '../../../dto/response/vehiculo.response';
import { ConductorVehiculoResponse } from '../../../dto/response/conductor-vehiculo.response';
import { BreveteRequest } from '../../../dto/request/brevete.request';
import { ConductorBreveteRequest } from '../../../dto/request/conductor-brevete.request';
import { Session } from '@shared/auth/Session';
import { DateUtilService } from 'app/protected/modules/ua/services/date-util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageComponent } from '@shared/components/message/message.component';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { EliminaConductorBreveteRequest } from '../../../dto/request/eliminar-conductor-brevete.request';

@Component({
  selector: 'app-reg-conductor',
  templateUrl: './reg-conductor.component.html',
  styleUrls: ['./reg-conductor.component.scss']
})
export class RegConductorComponent implements OnInit {
  anchoOpciones: string = '';//PARA ANCHO DE OPCIONES
  isLoading: boolean = false;
  tipoAccion: number = 1;//1=>GUARDAR 2=>MODIFICAR 3=>RENOVAR
  index: number = -1;

  conductorGrp: FormGroup;
  messages = {
    'nombres': {
      'required': 'Campo obligatorio'
    },
    'nroBrevete': {
      'required': 'Campo obligatorio'
    },
    'iniVigenciaBrevete': {
      'required': 'Campo obligatorio'
    },
    'finVigenciaBrevete': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'nombres': '',
    'nroBrevete': '',
    'iniVigenciaBrevete': '',
    'finVigenciaBrevete': ''
  };
  conductor: EmpleadoPuestoResponse = null;
  conductorVehiculo: ConductorVehiculoResponse = null;


  dataSource: MatTableDataSource<ConductorVehiculoResponse> = null;
  displayedColumns: string[];
  columnsGrilla = [
    {
      columnDef: 'nombres',
      header: 'Nombres',
      cell: (cond: ConductorVehiculoResponse) => `${cond.nombre1}${(cond.nombre2 != null ? ' ' + cond.nombre2 : '')}`
    }, {
      columnDef: 'apellidos',
      header: 'Apellidos',
      cell: (cond: ConductorVehiculoResponse) => `${cond.apPat} ${cond.apMat}`
    }, {
      columnDef: 'nroBrevete',
      header: 'N° Brevete',
      cell: (cond: ConductorVehiculoResponse) => `${cond.numBrevete}`
    }, {
      columnDef: 'iniVigenciaBrevete',
      header: 'Inicio fecha vigencia',
      cell: (cond: ConductorVehiculoResponse) => this.datePipe.transform(cond.vigenBreveteIni, 'dd/MM/yyyy')
    }, {
      columnDef: 'finVigenciaBrevete',
      header: 'Fin fecha vigencia',
      cell: (cond: ConductorVehiculoResponse) => this.datePipe.transform(cond.vigenBreveteFin, 'dd/MM/yyyy')
    }];
  listaConductores: ConductorVehiculoResponse[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegConductorComponent>,
    // private spinnerService: Ng4LoadingSpinnerService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    @Inject(DateUtilService) private dateUtilService: DateUtilService,
    @Inject(BnsPatrimonioService) private bnsPatrimonioService: BnsPatrimonioService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.conductorGrp = this.fb.group({
      nombres: [{ value: '', disabled: true }, [Validators.required]],
      nroBrevete: ['', [Validators.required]],
      iniVigenciaBrevete: ['', [Validators.required]],
      finVigenciaBrevete: ['', [Validators.required]]
    });

    this.conductorGrp.valueChanges.subscribe((val: any) => {
      this.validationService.getValidationErrors(this.conductorGrp, this.messages, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  get getWidthOpciones() {
    return null;
  }

  // get getUser(): UsuarioService { return this.user; }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });

    // if (this.user.perfil.id != 3) {
    if (true) {
      this.displayedColumns.unshift('id');
      this.displayedColumns.push('opt');
    }
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    this.evaFlgModificarEliminar();
    if (this.listaConductores.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaConductores);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public evaFlgModificarEliminar(): void {
    let ancho = 0;

    this.listaConductores.forEach(el => {
      let dias = this.dateUtilService.calcularDias(new Date(this.datePipe.transform(el.fecRegBrevete, 'yyyy/MM/dd')), new Date());
      el.modificable = dias <= 5 && el.flgActualBrevete == 1 && el.flgConductorActual == 1;
      el.renovable = dias > 5 && el.flgActualBrevete == 1 && el.flgConductorActual == 1;
      // console.log('dias: ' + dias);
      // console.log('FLAG: ' + el.flgActualBrevete);
      // console.log('modificable:' + el.modificable);
      // console.log('renovable:' + el.renovable);

      el.modificable ? ancho = this.dateUtilService.evaluarAnchoOpciones(ancho, 2) : null;
      el.renovable ? ancho = this.dateUtilService.evaluarAnchoOpciones(ancho, 1) : null;
    });
    // console.log('BANDERA MODIFICAR ELIMINAR');
    // console.log(ancho);
    // console.log(this.listaConductores.length);
    // console.log(this.listaConductores);
    // console.log(this.flgModificarEliminar);
    if (ancho == 0 || this.listaConductores.length <= 0) {
      this.displayedColumns.splice(this.displayedColumns.length - 1, 1);//QUITA EL ULTIMO
      console.log(this.displayedColumns);
    }

    this.anchoOpciones = this.dateUtilService.calcularAnchoOpciones(ancho);
  }

  public inicializarVariables(): void {
    this.definirTabla();
    this.listarConductores(this.data.objeto);
  }

  listarConductores(veh: VehiculoResponse) {
    this.isLoading = true;

    let req = new ConductorVehiculoRequest();
    req.idVehiculo = veh.idVehiculo;
    this.bnsPatrimonioService.listarConductorVehiculo(req).subscribe(
      (data: WsApiOutResponse) => {
        console.log('LISTA CONDUCTOR');
        console.log(data);
        if (data.codResultado == 1) {
          this.listaConductores = data.response;
          this.cargarDatosTabla();
        } else {
          console.log(data.message);
          this.cargarDatosTabla();
        }
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.isLoading = false;
      });
  }


  listarMaestra(cond: ConductorVehiculoResponse): void {
    this.dataSource = null;
    this.isLoading = true;

    if (cond) {
      this.listaConductores.unshift(cond);
    }

    this.cargarDatosTabla();
    this.isLoading = false;
  }

  validateForm(): void {
    this.validationService.getValidationErrors(this.conductorGrp, this.messages, this.formErrors, true);
  }

  guardar(): void {
    if (this.conductorGrp.valid) {
      this.spinner.show();
      //CASO GUARDAR IDBREVETE = NULL IDCONDUCTOR=NULL
      let brev = new BreveteRequest();
      brev.idBrevete = 0;
      brev.idConductor = 0;
      brev.codBrevete = this.conductorGrp.get('nroBrevete').value;
      brev.fecVgciaIni = this.conductorGrp.get('iniVigenciaBrevete').value;
      brev.fecVgciaFin = this.conductorGrp.get('finVigenciaBrevete').value;

      let req = new ConductorBreveteRequest();
      req.idVehiculo = this.data.objeto.idVehiculo;
      req.idEmpleado = this.conductor.idEmpleado;
      req.fidIdUsuarioReg = +Session.identity.id_usuario;
      req.fecReg = new Date();
      req.txtIpmaqReg = '';
      req.brevete = brev;

      // this.listarMaestra(mae);
      this.bnsPatrimonioService.grabarActualizarConductorBrevete(req).subscribe(
        (data: WsApiOutResponse) => {
          console.log('GUARDAR');
          console.log(data);
          if (data.codResultado == 1) {
            this.setFlagsInactivo(this.listaConductores);
            this.listaConductores.unshift(data.response[0]);
            this.cargarDatosTabla();

            this.validationService.setAsUntouched(this.conductorGrp, this.formErrors);
            this.conductor = null;
          } else {
            console.log(data.message);
          }
          this.spinner.hide();
        }, error => {
          console.log(error);
          this.spinner.hide();
        }
      )
    } else {
      this.validationService.getValidationErrors(this.conductorGrp, this.messages, this.formErrors, true);
    }
  }

  setFlagsInactivo(lista: ConductorVehiculoResponse[]): void {
    lista.forEach(el => {
      el.flgConductorActual = 0;
    })
  }

  eliminar(obj: ConductorVehiculoResponse): void {
    const dialogRef = this.dialog.open(InfoMessageComponent, {
      data: { title: '', message: '¿ESTA SEGURO QUE DESEA ELIMINAR ESTE REGISTRO?', message2: null, alerta: false, confirmacion: true, valor: null },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        //eliminar
        this.spinner.show();

        let req = new EliminaConductorBreveteRequest();
        req.idConductor = obj.idConductor;
        req.fidIdUsuarioReg = + Session.identity.id_usuario;
        req.fecReg = new Date();
        req.txtIpmaqReg = '';

        this.bnsPatrimonioService.eliminarConductorBrevete(req).subscribe(
          (data: WsApiOutResponse) => {
            if (data.codResultado == 1) {
              console.log(data);
              let index = this.listaConductores.indexOf(obj);
              this.listaConductores.splice(index, 1);
              this.cargarDatosTabla();
            } else {
              console.log(data.msgResultado);
            }
            this.spinner.hide();
          }, error => {
            console.log(error);
            this.spinner.hide();
          })
      }
    });
  }

  cargarModificar(obj: ConductorVehiculoResponse): void {
    this.tipoAccion = 2;
    this.conductorVehiculo = JSON.parse(JSON.stringify(obj));

    this.conductorGrp.get('nombres').setValue(obj.nombre1 + ' ' + (obj.nombre2 ? obj.nombre2 + ' ' : '') + obj.apPat + ' ' + obj.apMat);
    this.conductorGrp.get('nroBrevete').setValue(obj.numBrevete);
    this.conductorGrp.get('iniVigenciaBrevete').setValue(new Date(this.datePipe.transform(obj.vigenBreveteIni, 'yyyy/MM/dd')));
    this.conductorGrp.get('finVigenciaBrevete').setValue(new Date(this.datePipe.transform(obj.vigenBreveteFin, 'yyyy/MM/dd')));
    this.index = this.listaConductores.indexOf(obj);
  }

  modificar(): void {
    if (this.conductorGrp.valid) {
      let brev = new BreveteRequest();
      brev.idBrevete = this.conductorVehiculo.idBrevete;
      brev.idConductor = this.conductorVehiculo.idConductor;
      brev.codBrevete = this.conductorGrp.get('nroBrevete').value;
      brev.fecVgciaIni = this.conductorGrp.get('iniVigenciaBrevete').value;
      brev.fecVgciaFin = this.conductorGrp.get('finVigenciaBrevete').value;

      let req = new ConductorBreveteRequest();
      req.idVehiculo = this.data.objeto.idVehiculo;
      req.idEmpleado = this.conductor.idEmpleado;
      req.fidIdUsuarioReg = +Session.identity.id_usuario;
      req.fecReg = new Date();
      req.txtIpmaqReg = '';
      req.brevete = brev;


      this.bnsPatrimonioService.grabarActualizarConductorBrevete(req).subscribe(
        (data: WsApiOutResponse) => {
          console.log('MODIFICAR');
          console.log(data);
          if (data.codResultado == 1) {
            this.listaConductores.splice(this.index, 1);
            this.cargarDatosTabla();
            this.cancelar();
          } else {
            console.log(data.message);
          }
          this.spinner.hide();
        }, error => {
          console.log(error);
          this.spinner.hide();
        });
    } else {
      this.validationService.getValidationErrors(this.conductorGrp, this.messages, this.formErrors, true);
    }

  }

  cargarRenovar(obj: ConductorVehiculoResponse): void {
    this.tipoAccion = 3;
    this.conductorVehiculo = JSON.parse(JSON.stringify(obj));

    this.conductorGrp.get('nombres').setValue(obj.nombre1 + ' ' + (obj.nombre2 ? obj.nombre2 + ' ' : '') + obj.apPat + ' ' + obj.apMat);
    this.conductorGrp.get('nroBrevete').setValue(obj.numBrevete);
    this.conductorGrp.get('iniVigenciaBrevete').setValue(new Date(this.datePipe.transform(obj.vigenBreveteIni, 'yyyy/MM/dd')));
    this.conductorGrp.get('finVigenciaBrevete').setValue(new Date(this.datePipe.transform(obj.vigenBreveteFin, 'yyyy/MM/dd')));
    this.index = this.listaConductores.indexOf(obj);
  }

  renovar(): void {
    if (this.conductorGrp.valid) {
      this.spinner.show();
      let req = new BreveteRequest();
      req.idBrevete = 0;
      req.idConductor = this.conductorVehiculo.idConductor;
      req.codBrevete = this.conductorGrp.get('nroBrevete').value;
      req.fecVgciaIni = this.conductorGrp.get('iniVigenciaBrevete').value;
      req.fecVgciaFin = this.conductorGrp.get('finVigenciaBrevete').value;
      req.fidIdUsuarioReg = +Session.identity.id_usuario;
      req.fecReg = new Date();
      req.txtIpmaqReg = '';

      this.bnsPatrimonioService.modificarRenovarBrevete(req).subscribe(
        (data: WsApiOutResponse) => {
          console.log('RENOVAR');
          console.log(data);
          if (data.codResultado == 1) {
            this.listaConductores[this.index].flgActualBrevete = 0;//SETEA EL BREVETE ACTUAL A 0
            this.listaConductores.unshift(data.response[0]);
            this.cargarDatosTabla();

            this.cancelar();
          } else {
            console.log(data.message);
          }
          this.spinner.hide();
        }, error => {
          console.log(error);
          this.spinner.hide();
        });
    } else {
      this.validationService.getValidationErrors(this.conductorGrp, this.messages, this.formErrors, true);
    }
  }

  cancelar(): void {
    this.tipoAccion = 1;
    this.conductor = null;
    this.conductorVehiculo = null;

    this.validationService.setAsUntouched(this.conductorGrp, this.formErrors);
  }

  buscarEmpleado(evt): void {
    const dialogRef = this.dialog.open(BuscarEmpleadoComponent, {
      width: '800px',
      data: { title: 'BUSCAR EMPLEADO', objeto: this.data.objeto }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.conductor = result;
      result ? this.conductorGrp.get('nombres').setValue(this.conductor.nombre1 + ' ' + this.conductor.nombre2 + ' ' + this.conductor.apPaterno + ' ' + this.conductor.apMaterno) : this.conductorGrp.get('nombres').setValue('');
    });
  }

  quitarEmpleado(evt): void {
    this.conductor = null;
    this.conductorGrp.get('nombres').setValue('');
  }

}
