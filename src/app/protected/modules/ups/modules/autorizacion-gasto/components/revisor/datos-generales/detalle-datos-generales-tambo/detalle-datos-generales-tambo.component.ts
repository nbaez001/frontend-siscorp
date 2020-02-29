import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-detalle-datos-generales-tambo',
  templateUrl: './detalle-datos-generales-tambo.component.html',
  styleUrls: ['./detalle-datos-generales-tambo.component.scss']
})
export class DetalleDatosGeneralesTamboComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DetalleDatosGeneralesTamboComponent>,
  ) { }

  ngOnInit() {
  }

}
