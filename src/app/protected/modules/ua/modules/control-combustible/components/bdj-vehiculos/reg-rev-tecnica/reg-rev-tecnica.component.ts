import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataDialog } from '../../../entities/data-dialog.model';

@Component({
  selector: 'app-reg-rev-tecnica',
  templateUrl: './reg-rev-tecnica.component.html',
  styleUrls: ['./reg-rev-tecnica.component.scss']
})
export class RegRevTecnicaComponent implements OnInit {
  revTecnicaGrp: FormGroup;
  displayedColumns: string[] = ['nro', 'empresa', 'fechaInicio', 'fechaFin'];
  dataSource: MatTableDataSource<Object>;
  ELEMENT_DATA: Object[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RegRevTecnicaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    // @Inject(UsuarioService) private user: UsuarioService
  ) { }

  ngOnInit() {
    this.revTecnicaGrp = this.fb.group({
      name: ['', [Validators.required]]
    });

    this.ELEMENT_DATA = [
      { nro: 1, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2018', fechaFin: '19/05/2019' },
      { nro: 2, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2017', fechaFin: '19/05/2018' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
      { nro: 3, empresa: 'MECANICA RAMOS', fechaInicio: '19/05/2016', fechaFin: '19/05/2017' },
    ];

    this.dataSource = new MatTableDataSource<Object>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

  // get getUser(): UsuarioService {
  //   return this.user;
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }

  limpiar(): void {
    console.log('limpiar');
  }

}
