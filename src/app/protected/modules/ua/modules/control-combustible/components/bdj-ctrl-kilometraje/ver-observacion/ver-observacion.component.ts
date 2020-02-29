import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Kilometraje } from '../../../entities/kilometraje.model';
import { DetalleObservacion } from '../../../entities/detalle-observacion.model';
import { DataDialog } from '../../../entities/data-dialog.model';

@Component({
  selector: 'app-ver-observacion',
  templateUrl: './ver-observacion.component.html',
  styleUrls: ['./ver-observacion.component.scss']
})
export class VerObservacionComponent implements OnInit {
  observacionGrp: FormGroup;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<VerObservacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    // @Inject(UsuarioService) private user: UsuarioService
  ) { }

  ngOnInit() {
    this.observacionGrp = this.fb.group({
      observacion: [{ value: this.data.objeto.detalle, disabled: true }, Validators.required]
    });
  }

}
