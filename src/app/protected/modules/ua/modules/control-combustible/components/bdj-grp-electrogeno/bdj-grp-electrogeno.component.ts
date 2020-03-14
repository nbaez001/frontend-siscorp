import { Component, OnInit, ViewChild } from '@angular/core';
import { UNIDADES, TAMBOS, generadores } from '../../data-combustible'
import { Generador } from '../../entities/generador.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegPrevLubricanteGrpElecComponent } from './reg-prev-lubricante-grp-elec/reg-prev-lubricante-grp-elec.component';

@Component({
  selector: 'app-bdj-grp-electrogeno',
  templateUrl: './bdj-grp-electrogeno.component.html',
  styleUrls: ['./bdj-grp-electrogeno.component.scss']
})
export class BdjGrpElectrogenoComponent implements OnInit {
  unidades = UNIDADES;
  tambos = TAMBOS;
  listaGeneradores: Generador[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<Generador>;

  bandejaGrp: FormGroup;
  messages = {
    'name': {
      'required': 'Field is required',
      'minlength': 'Insert al least 2 characters',
      'maxlength': 'Max name size 20 characters'
    }
  };

  formErrors = {
    'name': '',
  };

  columnsGrilla = [
    {
      columnDef: 'nomUnidad',
      header: 'Unidad',
      cell: (gen: Generador) => `${gen.nomUnidad}`
    }, {
      columnDef: 'nomTambo',
      header: 'Tambo',
      cell: (gen: Generador) => `${gen.nomTambo}`
    }, {
      columnDef: 'codPatrimonio',
      header: 'Cod patrimonio',
      cell: (gen: Generador) => `${gen.codPatrimonio}`
    }, {
      columnDef: 'denominacion',
      header: 'Denominacion',
      cell: (gen: Generador) => `${gen.denominacion}`
    }, {
      columnDef: 'marca',
      header: 'Marca',
      cell: (gen: Generador) => `${gen.marca}`
    }, {
      columnDef: 'modelo',
      header: 'Modelo',
      cell: (gen: Generador) => `${gen.modelo}`
    }, {
      columnDef: 'tipo',
      header: 'Tipo',
      cell: (gen: Generador) => `${gen.tipo}`
    }, {
      columnDef: 'serie',
      header: 'Serie',
      cell: (gen: Generador) => `${gen.serie}`
    }, {
      columnDef: 'color',
      header: 'Color',
      cell: (gen: Generador) => `${gen.color}`
    }, {
      columnDef: 'estado',
      header: 'Estado',
      cell: (gen: Generador) => `${gen.estado}`
    }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    // private spinnerService: Ng4LoadingSpinnerService,
    // @Inject(UsuarioService) private user: UsuarioService
  ) { }

  ngOnInit() {
    // this.spinnerService.show();
    // const validarIntervalo = setInterval(() => {
    //   if (this.user.getId) {
    //     this.bandejaGrp = this.fb.group({
    //       unidad: [{ value: '', disabled: this.user.perfil.id != 3 }, [Validators.required]],
    //       tambo: [{ value: '', disabled: this.user.perfil.id == 1 }, [Validators.required]],
    //       codPatrimonio: ['', []],
    //       fecInicio: ['', []],
    //       fecFin: ['', []],
    //     });

    //     this.definirTabla();
    //     this.inicializarVariables();
    //     clearInterval(validarIntervalo);
    //   }
    // }, 100);

    this.bandejaGrp = this.fb.group({
      unidad: [{ value: '', disabled: false }, [Validators.required]],
      tambo: [{ value: '', disabled: false }, [Validators.required]],
      codPatrimonio: ['', []],
      fecInicio: ['', []],
      fecFin: ['', []],
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  // get getUser() { return this.user; }

  public inicializarVariables(): void {
    this.cargarUnidades();

    // this.spinnerService.hide();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
    this.displayedColumns.push('opt');
  }

  cargarDatosTabla(): void {
    this.dataSource = null;
    if (this.listaGeneradores.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaGeneradores);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.spinnerService.hide();
  }

  cargarUnidades() {
    this.unidades = JSON.parse(JSON.stringify(UNIDADES));
    this.unidades.unshift({ id: 0, nombre: 'TODOS' });

    // if (this.user.perfil.id != 3) {
    if (true) {
      // this.bandejaGrp.get('unidad').setValue(this.unidades.filter(el => el.id == this.user.idUnidad)[0]);
      this.bandejaGrp.get('unidad').setValue(this.unidades[0]);
    } else {
      this.bandejaGrp.get('unidad').setValue(this.unidades[0]);
    }

    this.cargarTambos();
  }

  cargarTambos() {
    let idUnidad = this.bandejaGrp.get('unidad').value.id;

    this.tambos = JSON.parse(JSON.stringify(TAMBOS.filter(tb => tb.idUnidad == idUnidad)));
    this.tambos.unshift({ id: 0, nombre: 'TODOS', idUnidad: 0 });

    // if (this.user.perfil.id != 3) {
    //   this.bandejaGrp.get('tambo').setValue(this.tambos.filter(el => el.id == this.user.idTambo)[0]);
    if (true) {
      this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
    } else {
      this.bandejaGrp.get('tambo').setValue(this.tambos[0]);
    }

    this.buscar();
  }

  buscar() {
    let idUnidad = this.bandejaGrp.get('unidad').value.id;
    let idTambo = this.bandejaGrp.get('tambo').value.id;

    this.listaGeneradores = generadores.filter(el => (el.idUnidad == idUnidad) || (0 == idUnidad));
    this.listaGeneradores = this.listaGeneradores.filter(el => (el.idTambo == idTambo) || (0 == idTambo));

    this.cargarDatosTabla();
  }

  exportarExcel() {
    let url = "http://ccombustible.elnazarenovraem.edu.pe/assets/files/reportes/generadores.xlsx";
    window.location.href = url;
  }

  regVehiculo(obj): void {
    // console.log(obj);
    // const dialogRef = this.dialog.open(RegistrarVehiculoComponent, {
    //   width: '500px',
    //   data: { name: 'NERIO', animal: 'LEON' }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    // });
  }

  regLubricante(obj): void {
    const dialogRef = this.dialog.open(RegPrevLubricanteGrpElecComponent, {
      width: '600px',
      data: { title: 'REGISTRO PREVENTIVO DE LUBRICANTES', objeto: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

}
