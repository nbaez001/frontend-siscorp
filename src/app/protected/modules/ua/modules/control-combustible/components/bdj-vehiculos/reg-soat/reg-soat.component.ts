import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataDialog } from '../../../entities/data-dialog.model';

@Component({
  selector: 'app-reg-soat',
  templateUrl: './reg-soat.component.html',
  styleUrls: ['./reg-soat.component.scss']
})
export class RegSoatComponent implements OnInit {
  soatGrp: FormGroup;
  displayedColumns: string[] = ['nro', 'empresa', 'fechaInicio', 'fechaFin'];
  dataSource: MatTableDataSource<Object>;
  ELEMENT_DATA: Object[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RegSoatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    // @Inject(UsuarioService) private user: UsuarioService
  ) { }

  ngOnInit() {
    this.soatGrp = this.fb.group({
      name: ['', [Validators.required]]
    });

    this.ELEMENT_DATA = [
      { nro: 1, empresa: 'RIMAC SEGUROS', fechaInicio: '26/02/2018', fechaFin: '26/02/2019' },
      { nro: 2, empresa: 'LA POSITIVA', fechaInicio: '26/02/2017', fechaFin: '26/02/2018' },
      { nro: 3, empresa: 'LA POSITIVA', fechaInicio: '26/02/2016', fechaFin: '26/02/2017' }
    ];

    this.dataSource = new MatTableDataSource<Object>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

  // get getUser(): UsuarioService { return this.user; }

  onNoClick(): void {
    this.dialogRef.close();
  }

  limpiar(): void {
    console.log('limpiar');
  }

}
