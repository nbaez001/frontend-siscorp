import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmpleadoPuestoResponse } from '../../../../control-combustible/dto/response/empleado-puesto.response';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataDialog } from '../../../../control-combustible/entities/data-dialog.model';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { BnsPatrimonioService } from '../../../../control-combustible/services/bns-patrimonio.service';
import { WsApiOutResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/WsApiOutResponse';
import { EmpleadoPuestoRequest } from '../../../../control-combustible/dto/request/empleado-puesto.request';

@Component({
  selector: 'app-buscar-empleado',
  templateUrl: './buscar-empleado.component.html',
  styleUrls: ['./buscar-empleado.component.scss']
})
export class BuscarEmpleadoComponent implements OnInit {
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  messages = {
    'puesto': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'puesto': ''
  };

  // proveedores = [];
  listaPuestos = [];

  listaEmpleado: EmpleadoPuestoResponse[];
  dataSource: MatTableDataSource<EmpleadoPuestoResponse> = null;
  displayedColumns: string[];
  columnsGrilla = [
    {
      columnDef: 'nombres',
      header: 'NOMBRES',
      cell: (cond: EmpleadoPuestoResponse) => `${cond.nombre1} ${cond.nombre2}`
    }, {
      columnDef: 'apPaterno',
      header: 'APELLIDO PATERNO',
      cell: (cond: EmpleadoPuestoResponse) => `${cond.apPaterno}`
    }, {
      columnDef: 'apMaterno',
      header: 'APELLIDO MATERNO',
      cell: (cond: EmpleadoPuestoResponse) => `${cond.apMaterno}`
    }, {
      columnDef: 'nomPuesto',
      header: 'PUESTO',
      cell: (cond: EmpleadoPuestoResponse) => `${cond.nomPuesto}`
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<BuscarEmpleadoComponent>,
    // private spinnerService: Ng4LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    @Inject(BnsPatrimonioService) private bnsPatrimonioService: BnsPatrimonioService,
    // @Inject(UsuarioService) private user: UsuarioService,
    // private datePipe: DatePipe,
    // private decimalPipe: DecimalPipe
  ) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      puesto: ['', [Validators.required]],
      nombres: ['', []],
      apPaterno: ['', []],
      apMaterno: ['', []]
    });

    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, false);
    });

    this.inicializarVariables();
  }
  // get getUser(): UsuarioService { return this.user; }

  public inicializarVariables(): void {
    this.cargarPuestos();
    this.definirTabla();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaEmpleado.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaEmpleado);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public cargarPuestos() {
    this.bnsPatrimonioService.listarPuesto().subscribe(
      (data: WsApiOutResponse) => {
        if (data.codResultado == 1) {
          this.listaPuestos = data.response;
          this.formularioGrp.get('puesto').setValue(this.listaPuestos[0]);
        } else {
          this.listaPuestos = [];
        }
      }, error => {
        console.log(error);
      }
    )

    this.formularioGrp.get('puesto').setValue(this.listaPuestos[0]);
  }

  buscar(): void {
    if (this.formularioGrp.valid) {
      this.dataSource = null;
      this.isLoading = true;

      let req = new EmpleadoPuestoRequest();
      req.idUnidadTerritorial = 9;//this.data.objeto.idUnidadT;
      req.idPuesto = this.formularioGrp.get('puesto').value.idCodigo;
      req.fecActual = new Date();
      req.nombre = this.formularioGrp.get('nombres').value;
      req.apPaterno = this.formularioGrp.get('apPaterno').value;
      req.apMaterno = this.formularioGrp.get('apMaterno').value;

      this.bnsPatrimonioService.buscarEmpleadoPuesto(req).subscribe(
        (data: WsApiOutResponse) => {
          if (data.codResultado == 1) {
            this.listaEmpleado = data.response;
            this.cargarDatosTabla();
          } else {
            this.listaEmpleado = [];
            this.cargarDatosTabla();
          }
          this.isLoading = false;
        }, error => {
          console.log(error);
          this.isLoading = false;
        }
      );
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

  seleccionar(el): void {
    this.dialogRef.close(el);
  }

  limpiar(): void {

  }

}
