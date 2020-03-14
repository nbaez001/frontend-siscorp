import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-detalle-datos-generales-tambo',
  templateUrl: './detalle-datos-generales-tambo.component.html',
  styleUrls: ['./detalle-datos-generales-tambo.component.scss']
})
export class DetalleDatosGeneralesTamboComponent implements OnInit {

  
  constructor(
    public dialogRef: MatDialogRef<DetalleDatosGeneralesTamboComponent>,
    @Inject(MAT_DIALOG_DATA)
    public datoObtenido: DataDetalle
  ) { }

  ngOnInit() {
  }

}


interface DataDetalle {
  datoEnviado?: any;
}