import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MessageComponent } from '@shared/components/message/message.component';
import { _formasAdquisicion } from '../../../data-patrimonio';
import { Adquisicion } from '../../../entities/adquisicion.model';

@Component({
  selector: 'app-reg-adq-masivo',
  templateUrl: './reg-adq-masivo.component.html',
  styleUrls: ['./reg-adq-masivo.component.scss']
})
export class RegAdqMasivoComponent implements OnInit {
  formularioGrp: FormGroup;
  fileupload: any;
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegAdqMasivoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, ) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      cargaMasiva: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  public buscarActa(evt): void {
    document.getElementById('fileCargaMasiva').click();
  }

  public cargarArchivo(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.formularioGrp.get('cargaMasiva').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.formularioGrp.get('cargaMasiva').setValue(nombreArchivo);
    }
  }

  guardar(): void {
    const dialogRef = this.dialog.open(MessageComponent, {
      width: '400px',
      data: { title: 'CONFIRMACION', message: '¿Esta seguro que desea realizar la carga de los datos?', message2: null, alerta: false, confirmacion: true, valor: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        let adq = new Adquisicion();
        adq.id = 0;
        adq.nroDocSustentatorio = '0289-2020';
        adq.adquisicion = _formasAdquisicion[0];
        adq.fecha = new Date();
        adq.totalBienes = 48;

        this.dialogRef.close(adq);
      }
    });
  }

  descargarPlantilla() {
    let url = "http://ccombustible.elnazarenovraem.edu.pe/assets/files/control-patrimonio/plantilla-carga-masiva-bp.xlsx";
    window.location.href = url;
  }

  descargarGuia() {
    let url = "http://ccombustible.elnazarenovraem.edu.pe/assets/files/control-patrimonio/guia-carga-masiva-bp.pdf";
    // window.location.href = url;

    var a = document.createElement('a');
    a.target = "_blank";
    a.href = url;
    a.click();
  }

}
