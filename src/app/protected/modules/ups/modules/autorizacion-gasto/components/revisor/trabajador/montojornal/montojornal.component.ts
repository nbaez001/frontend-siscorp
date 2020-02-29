import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TrabajadorService } from '../../../../service/trabajador.service';
import { filter, take } from 'rxjs/operators';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { MENSAJES } from 'app/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-montojornal',
  templateUrl: './montojornal.component.html',
  styleUrls: ['./montojornal.component.scss']
})
export class MontojornalComponent implements OnInit {
  fileupload: any;
  formularioGrp: FormGroup;
  dialogRefMessage: MatDialogRef<any>;
  constructor(
    public dialogRef: MatDialogRef<MontojornalComponent>,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {

  }



  ngOnInit() {
    this.formularioGrp = this.fb.group({
      docSustentacion: [{ value: '', disabled: true }, Validators.required],
      sustento: [{ value: '', disabled: false}, Validators.required],
      monto: [{ value: '', disabled: false }, Validators.required],
    });
  }


  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }
  enviarMonto() {
    if(this.formularioGrp.valid){
      this.openDialogMensajeConfirm(MENSAJES.TRABAJADOR.MODIFICAR_JORNAL, true);
      this.dialogRefMessage.afterClosed()
        .pipe(filter(verdadero => !!verdadero))
        .subscribe(() => {
          this.dialogRef.close(true);
          this.snackBar.open("Se envió la propuesta");
  
        });
    }
     else{
      const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
        width: '400px',
        disableClose: true,
        data: {
          message:MENSAJES.TRABAJADOR.MODIFICAR_JORNAL_FALTAN_CAMPOS,
          alerta: true,
          confirmacion: false
        }
      });
      }

  } 
   

  

  buscarSustentacion(evt): void {
    document.getElementById('fileSustentacion').click();
  }

  cargarSustentacion(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.formularioGrp.get('docSustentacion').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.formularioGrp.get('docSustentacion').setValue(nombreArchivo);
    }
  }

}




