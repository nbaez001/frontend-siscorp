import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  title: string;
  message: string;
  message2: string;
  alerta: boolean;
  confirmacion: boolean;
  valor: any;
}

@Component({
  selector: 'app-info-message',
  templateUrl: './info-message.component.html',
  styleUrls: ['./info-message.component.scss']
})
export class InfoMessageComponent implements OnInit {

 
  Mensajes: {
    mensaje: string
  }[];
  menMultiple: boolean;

  constructor(public dialogRef: MatDialogRef<InfoMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.menMultiple = false;
    //this.verificarSubMensajes();
  }

  public opcionOK() {
    this.dialogRef.close(0);
  }

  public opcionSI() {
    this.dialogRef.close(1);
  }

  public opcionNO() {
    this.dialogRef.close(0);
  }

  onDialogClose(): void {
    this.dialogRef.close(null);
  }

  public verificarSubMensajes(): void {
    if (this.data.message2 !== null) {
      if (this.data.message2.indexOf('\n') !== -1) {
        console.log(this.data.message2);
        const mensajes = this.data.message2.split('\n');
        this.Mensajes = [];
        mensajes.forEach(men => {
          this.Mensajes.push({
            mensaje: men
          });
        });
      } else {
        this.menMultiple = true;
      }
    } else {
      this.menMultiple = true;
    }
  }


}
