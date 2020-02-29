import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'tickinterv-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.scss']
})
export class EntidadComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EntidadComponent>,
  ) { }

  ngOnInit() {
  }

}
