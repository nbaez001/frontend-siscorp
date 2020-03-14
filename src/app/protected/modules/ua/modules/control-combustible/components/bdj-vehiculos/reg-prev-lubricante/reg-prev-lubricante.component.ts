import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PRODUCTOSLUBRICANTE, UNIDADES, TAMBOS, VEHICULOS } from '../../../data-combustible'
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ValidationService } from 'app/protected/modules/ua/services/validation.service';
import { DatePipe, DecimalPipe, formatDate } from '@angular/common';
import { DataDialog } from '../../../entities/data-dialog.model';
import { TipoLbcteVhcloRequest } from '../../../dto/request/tipo-lbcte-vhclo.request';
import { BnsPatrimonioService } from '../../../services/bns-patrimonio.service';
import { WsApiOutResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/WsApiOutResponse';
import { TipoLbcteVhcloResponse } from '../../../dto/response/tipo-lbcte-vhclo.response';
import { TipoLubricanteResponse } from '../../../dto/response/tipo-lubricante.response';

@Component({
  selector: 'app-reg-prev-lubricante',
  templateUrl: './reg-prev-lubricante.component.html',
  styleUrls: ['./reg-prev-lubricante.component.scss']
})
export class RegPrevLubricanteComponent implements OnInit {
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  messages = {
    'unidad': {
      'required': 'Campo obligatorio'
    },
    'tambo': {
      'required': 'Campo obligatorio'
    },
    'vehiculo': {
      'required': 'Campo obligatorio'
    },
    'tipoLubricante': {
      'required': 'Campo obligatorio'
    },
    'score': {
      'required': 'Campo obligatorio'
    },
    'cantidad': {
      'required': 'Campo obligatorio'
    },
    'fecha': {
      'required': 'Campo obligatorio'
    }
  };
  formErrors = {
    'unidad': '',
    'tambo': '',
    'vehiculo': '',
    'tipoLubricante': '',
    'score': '',
    // 'precio': '',
    // 'total': '',
    'fecha': '',
  };

  tambos = [];
  unidades = [];
  vehiculos = [];
  tiposLubricante: TipoLubricanteResponse[] = [];


  dataSource: MatTableDataSource<TipoLbcteVhcloResponse>;
  displayedColumns: string[];
  columnsGrilla = [
    {
      columnDef: 'nomTipoProducto',
      header: 'Tipo lubricante',
      cell: (cond: TipoLbcteVhcloResponse) => `${cond.nomTipoLbcte}`
    }, {
      columnDef: 'score',
      header: 'Kilometraje',
      cell: (cond: TipoLbcteVhcloResponse) => this.decimalPipe.transform(cond.numKlmtje, '1.1-1')
    }, {
      columnDef: 'cantidad',
      header: 'Cantidad',
      cell: (cond: TipoLbcteVhcloResponse) => this.decimalPipe.transform(cond.ctdad, '1.2-2')
    }, {
      columnDef: 'fecha',
      header: 'Fecha',
      cell: (cond: TipoLbcteVhcloResponse) => this.datePipe.transform(cond.fecAsigcion, 'dd/MM/yyyy')
    }];


  listaTipoLbcteVhclo: TipoLbcteVhcloResponse[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegPrevLubricanteComponent>,
    // private spinnerService: Ng4LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    @Inject(ValidationService) private validationService: ValidationService,
    @Inject(BnsPatrimonioService) private bnsPatrimonioService: BnsPatrimonioService,
    // @Inject(UsuarioService) private user: UsuarioService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.isLoading = true;

    this.formularioGrp = this.fb.group({
      unidad: [{ value: '', disabled: true }, [Validators.required]],
      tambo: [{ value: '', disabled: true }, [Validators.required]],
      vehiculo: ['', [Validators.required]],
      tipoLubricante: ['', [Validators.required]],
      score: [{ value: 2000, disabled: true }, , [Validators.required]],
      cantidad: ['', [Validators.required]],
      // precio: ['', [Validators.required]],
      // total: [{ value: '', disabled: true }, [Validators.required]],
      fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]],
    });

    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, false);
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  // get getUser(): UsuarioService { return this.user; }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaTipoLbcteVhclo.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaTipoLbcteVhclo);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public inicializarVariables(): void {
    this.comboTiposLubricante();
    this.comboUnidades();
    this.listarHistoricoLubricante();
  }

  public comboTiposLubricante(): void {
    this.bnsPatrimonioService.listarTipoLubricante().subscribe(
      (data: WsApiOutResponse) => {
        console.log(data);
        if (data.codResultado == 1) {
          this.tiposLubricante = data.response;
          this.formularioGrp.get('tipoLubricante').setValue(this.tiposLubricante[0]);
        } else {
          console.log(data.msgResultado);
        }
      }, error => {
        console.log(error);
      })
  }

  public comboUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });

    // if (this.user.perfil.id != 3) {
    if (true) {
      // this.formularioGrp.get('unidad').setValue(this.unidades.filter(el => el.id == this.user.idUnidad)[0]);
      this.formularioGrp.get('unidad').setValue(this.unidades[0]);
    } else {
      this.formularioGrp.get('unidad').setValue(this.unidades[0]);
    }
    this.comboTambos();
  }

  public comboTambos() {
    let idUnidad = this.formularioGrp.get('unidad').value.id;

    this.tambos = JSON.parse(JSON.stringify(TAMBOS.filter(tb => tb.idUnidad == idUnidad)));
    this.tambos.unshift({ id: 0, nombre: 'OFICINA DE UNIDAD TERRITORIAL', idunidad: 0 });

    // if (this.user.perfil.id != 3) {
    if (true) {
      // this.formularioGrp.get('tambo').setValue(this.tambos.filter(el => el.id == this.user.idTambo)[0]);
      this.formularioGrp.get('tambo').setValue(this.tambos[0]);
    } else {
      this.formularioGrp.get('tambo').setValue(this.tambos[0]);
    }

    this.buscar();
  }

  listarHistoricoLubricante(): void {
    let req = new TipoLbcteVhcloRequest();
    req.idVehiculo = this.data.objeto.idVehiculo;

    this.bnsPatrimonioService.listarLubricanteVehiculo(req).subscribe(
      (data: WsApiOutResponse) => {
        console.log(data);
        if (data.codResultado == 1) {
          this.formularioGrp.get('score').setValue(data.response.klmtrje);
          this.listaTipoLbcteVhclo = data.response.tipoLbcteVhclo;

          this.cargarDatosTabla();
        } else {
          this.formularioGrp.get('score').setValue(0);
          console.log(data.msgResultado);
        }
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.isLoading = false;
      });
  }

  buscar() {
    let idUnidad = this.formularioGrp.get('unidad').value.id;
    let idTambo = this.formularioGrp.get('tambo').value.id;

    this.vehiculos = VEHICULOS.filter(el => (el.idUnidad == idUnidad) || (0 == idUnidad));
    this.vehiculos = this.vehiculos.filter(el => (el.idTambo == idTambo));

    this.formularioGrp.get('vehiculo').setValue(this.vehiculos[0]);
  }

  validateForm(): void {
    this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
  }

  // calcular(): void {
  //   this.formularioGrp.get('total').setValue(this.formularioGrp.get('cantidad').value * this.formularioGrp.get('precio').value);
  // }

  guardar(): void {
    if (this.formularioGrp.valid) {
      let con = new TipoLbcteVhcloResponse();
      // con.id = 0;
      // con.idUnidad = this.formularioGrp.get('unidad').value.id;
      // con.nomUnidad = this.formularioGrp.get('unidad').value.nombre;
      // con.idTambo = this.formularioGrp.get('tambo').value.id;
      // con.nomTambo = this.formularioGrp.get('tambo').value.nombre;
      // con.idVehiculo = this.formularioGrp.get('vehiculo').value.id;
      // con.nomVehiculo = this.formularioGrp.get('vehiculo').value.nomTipo + ' ' + this.formularioGrp.get('vehiculo').value.marca + ' ' + this.formularioGrp.get('vehiculo').value.placa;
      // con.score = this.formularioGrp.get('score').value;

      // con.idTipoProducto = this.formularioGrp.get('tipoLubricante').value.id;
      // con.nomTipoProducto = this.formularioGrp.get('tipoLubricante').value.nombre;
      // con.cantidad = this.formularioGrp.get('cantidad').value;
      // con.fecha = this.formularioGrp.get('fecha').value;

      this.listaTipoLbcteVhclo.unshift(con);
      this.validationService.setAsUntouched(this.formularioGrp, this.formErrors);
      this.cargarDatosTabla();
    } else {
      this.validationService.getValidationErrors(this.formularioGrp, this.messages, this.formErrors, true);
    }
  }

  limpiar() {

  }
}
