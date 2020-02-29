import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TIPOSVEHICULO, UNIDADES, TAMBOS, _codGrupo, _codClase } from '../../data-combustible';
import { RegRevTecnicaComponent } from './reg-rev-tecnica/reg-rev-tecnica.component';
import { RegSoatComponent } from './reg-soat/reg-soat.component';
import { RegArtEmergenciaComponent } from './reg-art-emergencia/reg-art-emergencia.component';
import { RegConductorComponent } from './reg-conductor/reg-conductor.component';
import { RegPrevLubricanteComponent } from './reg-prev-lubricante/reg-prev-lubricante.component';
import { BnsPatrimonioService } from '../../services/bns-patrimonio.service';
import { WsApiOutResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/WsApiOutResponse';
import { VehiculoResponse } from '../../dto/response/vehiculo.response';
import { VehiculoRequest } from '../../dto/request/vehiculo.request';
import { Session } from '@shared/auth/Session';
import { DenominacionBienPorPlataformaRequest } from '../../dto/request/denominacion-bien-por-plataforma.request';

@Component({
  selector: 'app-bdj-vehiculos',
  templateUrl: './bdj-vehiculos.component.html',
  styleUrls: ['./bdj-vehiculos.component.scss']
})
export class BdjVehiculosComponent implements OnInit {
  isLoading: boolean = false;

  unidades = [];
  tambos = [];
  tiposvehiculo: any[] = [];
  listaVehiculos: VehiculoResponse[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<VehiculoResponse> = null;

  bandejaGrp: FormGroup;
  messages = {
    'name': {
      'required': 'Field is required',
      'minlength': 'Insert al least 2 characters',
      'maxlength': 'Max name size 20 characters'
    },
    'email': {
      'required': 'Field is required',
      'email': 'Insert a valid email',
      'customEmail': 'Email domain should be dell.com'
    },
    'confirmEmail': {
      'required': 'Field is required',
      'email': 'Insert a valid email'
    },
    'phone': {
      'required': 'Phone is required'
    },
    'skill': {
      'name': {
        'required': 'Field is required',
        'minlength': 'Insert al least 5 characters',
        'maxlength': 'max name size 20 characters'
      },
      'years': {
        'required': 'Field is required',
        'min': 'Min value is 1',
        'max': 'Max value is 100'
      },
      'proficiency': {
        'required': 'option is required'
      }
    }
  };
  formErrors = {
    'name': '',
    'email': '',
    'confirmEmail': '',
    'phone': '',
    'skill': {
      'name': '',
      'years': '',
      'proficiency': ''
    }
  };
  columnsGrilla = [
    {
      columnDef: 'unidad',
      header: 'UNIDAD',
      cell: (vehiculo: VehiculoResponse) => `${vehiculo.nombreUnidadT}`
    }, {
      columnDef: 'tambo',
      header: 'TAMBO',
      cell: (vehiculo: VehiculoResponse) => `${vehiculo.nombrePlataforma}`
    }, {
      columnDef: 'codPatrimonio',
      header: 'COD. PATRIMONIAL',
      cell: (vehiculo: VehiculoResponse) => `${vehiculo.codigoBienPatrimonial}`
    }, {
      columnDef: 'denominacion',
      header: 'DENOMINACION',
      cell: (vehiculo: VehiculoResponse) => `${vehiculo.nombreDenominacion}`
    }, {
      columnDef: 'marca',
      header: 'MARCA',
      cell: (vehiculo: VehiculoResponse) => `${vehiculo.nombreMarca}`
    }, {
      columnDef: 'modelo',
      header: 'MODELO',
      cell: (vehiculo: VehiculoResponse) => `${vehiculo.nombreModelo}`
    }, {
      columnDef: 'serie',
      header: 'SERIE',
      cell: (vehiculo: VehiculoResponse) => `${vehiculo.serieBien}`
    }, {
      columnDef: 'placa',
      header: 'PLACA',
      cell: (vehiculo: VehiculoResponse) => `${vehiculo.placaVehiculo}`
    }, {
      columnDef: 'color',
      header: 'COLOR',
      cell: (vehiculo: VehiculoResponse) => `${vehiculo.listaColor}`
    }, {
      columnDef: 'estado',
      header: 'ESTADO',
      cell: (vehiculo: VehiculoResponse) => `${vehiculo.estadoEtdoCsvcion}`
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // get getUser() { return this.user; }

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    // @Inject(UsuarioService) private user: UsuarioService,
    @Inject(BnsPatrimonioService) private bnsPatrimonioService: BnsPatrimonioService,

  ) { }

  ngOnInit() {
    console.log(Session.identity);
    // this.spinnerService.show();
    // const validarIntervalo = setInterval(() => {
    //   if (this.user.getId) {
    //     console.log('USUARIO');
    //     console.log(this.user);
    //     this.bandejaGrp = this.fb.group({
    //       unidad: [{ value: '', disabled: this.user.perfil.id != 3 }, [Validators.required]],
    //       tambo: [{ value: '', disabled: (this.user.perfil.id == 1) }, [Validators.required]],
    //       tipovehiculo: ['', [Validators.required]]
    //     });

    //     this.definirTabla();
    //     this.inicializarVariables();
    //     clearInterval(validarIntervalo);
    //   }
    // }, 100);
    this.bandejaGrp = this.fb.group({
      unidad: [{ value: '', disabled: false }, [Validators.required]],
      tambo: [{ value: '', disabled: false }, [Validators.required]],
      tipovehiculo: ['', [Validators.required]],
      fechaInicio: ['', []],
      fechaFin: ['', []],
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.cargarUnidades();
  }

  public cargarTiposvehiculo() {
    let req = new DenominacionBienPorPlataformaRequest();
    req.idUTerritorial = this.bandejaGrp.get('unidad').value.idCodigo;
    req.idPlataforma = this.bandejaGrp.get('tambo').value.cidCodigo == -1 ? -1 : this.bandejaGrp.get('tambo').value.idCodigo;
    req.cadClase = _codClase;
    req.cadGrupo = _codGrupo;

    this.bnsPatrimonioService.listarDenominaBienPorPlataforma(req).subscribe(
      (data: WsApiOutResponse) => {
        this.tiposvehiculo = [];
        if (data.codResultado == 1) {
          this.tiposvehiculo = data.response;
          console.log(this.tiposvehiculo);
        } else {
          console.log(data.msgResultado);
        }

        this.tiposvehiculo.unshift({ idDenominacion: 0, nomDenominacion: 'TODOS' });
        this.bandejaGrp.get('tipovehiculo').setValue(this.tiposvehiculo[0]);
      }, error => {
        console.log(error);
      }
    );

    // this.tiposvehiculo = JSON.parse(JSON.stringify(TIPOSVEHICULO));
    // this.tiposvehiculo.unshift({ id: 0, codigo: '00', nombre: 'TODOS' });

    // this.bandejaGrp.get('tipovehiculo').setValue(this.tiposvehiculo[0]);
  }


  public cargarUnidades() {
    this.bnsPatrimonioService.listarUnidadTerritorial().subscribe(
      (data: WsApiOutResponse) => {
        this.unidades = [];
        if (data.codResultado == 1) {
          this.unidades = data.response;
          this.unidades.unshift({ idCodigo: 0, cidNombre: 'TODOS' });

          this.bandejaGrp.get('unidad').setValue(this.unidades[0]);
          this.cargarTambos();
        } else {
          console.log(data.msgResultado);
          this.unidades.unshift({ idCodigo: 0, cidNombre: 'TODOS' });
          this.bandejaGrp.get('unidad').setValue(this.unidades[0]);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public cargarTambos() {
    let unidad = this.bandejaGrp.get('unidad').value;

    this.bnsPatrimonioService.listarPlataformas(unidad).subscribe(
      (data: WsApiOutResponse) => {
        this.tambos = [];
        if (data.codResultado == 1) {
          this.tambos = data.response;
          console.log(this.tambos);
          this.tambos.unshift({ idCodigo: 0, cidNombre: 'TODOS' });
          this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
        } else {
          console.log(data.msgResultado);
          this.tambos.unshift({ idCodigo: 0, cidNombre: 'TODOS' });
          this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
        }
        this.cargarTiposvehiculo();
      },
      error => {
        console.log(error);
      }
    );

    // // if (this.user.perfil.id != 3) {
    // if (true) {
    //   // this.bandejaGrp.get('tambo').setValue(this.tambos.filter(el => el.id == this.user.idTambo)[0]);
    //   this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
    // } else {
    //   this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
    // }

    // this.buscar();
  }

  buscar() {
    this.isLoading = true;

    let vehiculoReq = new VehiculoRequest();
    vehiculoReq.idUnidadTerritorial = this.bandejaGrp.get('unidad').value.idCodigo;
    vehiculoReq.idPlataforma = this.bandejaGrp.get('tambo').value.cidCodigo == -1 ? -1 : this.bandejaGrp.get('tambo').value.idCodigo;
    vehiculoReq.idDenominacion = this.bandejaGrp.get('tipovehiculo').value.idDenominacion;
    vehiculoReq.fechaInicio = (this.bandejaGrp.get('fechaInicio').value) ? this.bandejaGrp.get('fechaInicio').value : null;
    vehiculoReq.fechaFin = (this.bandejaGrp.get('fechaFin').value) ? this.bandejaGrp.get('fechaFin').value : null;

    // let tambo = this.bandejaGrp.get('tambo').value;
    // let tipovehiculo = this.bandejaGrp.get('tipovehiculo').value;
    // const regex = new RegExp(`${codTipovehiculo}.*`);

    // this.listaVehiculos = VEHICULOS.filter(el => (el.idUnidad == idUnidad) || (0 == idUnidad));
    // this.listaVehiculos = this.listaVehiculos.filter(el => (el.idTambo == idTambo) || (0 == idTambo));
    // this.listaVehiculos = this.listaVehiculos.filter(el => (el.codPatrimonio.match(regex)) || ('00' == codTipovehiculo));

    this.bnsPatrimonioService.buscarVehiculo(vehiculoReq).subscribe(
      (data: WsApiOutResponse) => {
        if (data.codResultado == 1) {
          this.listaVehiculos = data.response;
        } else {
          console.log(data.msgResultado);
          this.listaVehiculos = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.isLoading = false;
      }
    )
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
    // this.spinnerService.show();
    this.dataSource = null;
    if (this.listaVehiculos.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaVehiculos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.spinnerService.hide();
  }

  exportarExcel() {
    let url = "http://ccombustible.elnazarenovraem.edu.pe/assets/files/reportes/vehiculos.xlsx";
    window.location.href = url;
  }

  exportarArtEmerg() {
    let url = "http://ccombustible.elnazarenovraem.edu.pe/assets/files/reportes/vehiculos-articulos-emergencia.xlsx";
    window.location.href = url;
  }

  exportarConductores() {
    let url = "http://ccombustible.elnazarenovraem.edu.pe/assets/files/reportes/vehiculos-conductores.xlsx";
    window.location.href = url;
  }

  regRevTecnica(obj): void {
    const dialogRef = this.dialog.open(RegRevTecnicaComponent, {
      width: '600px',
      data: { title: 'REGISTRAR REVISION TECNICA', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  regSOAT(obj): void {
    console.log(obj);
    const dialogRef = this.dialog.open(RegSoatComponent, {
      width: '600px',
      data: { title: 'REGISTRAR SOAT', objeto: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }


  regArticulosEmergencia(obj): void {
    const dialogRef = this.dialog.open(RegArtEmergenciaComponent, {
      width: '900px',
      data: { title: 'DECLARACION ARTICULOS EMERGENCIA', objeto: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  regConductor(row): void {
    const dialogRef = this.dialog.open(RegConductorComponent, {
      width: '600px',
      data: { title: 'REGISTRAR CONDUCTOR', objeto: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }


  regLubricante(obj): void {
    const dialogRef = this.dialog.open(RegPrevLubricanteComponent, {
      width: '600px',
      data: { title: 'REGISTRAR PREVENTIVO DE LUBRICANTE', objeto: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  limpiar(): void {

  }

}
