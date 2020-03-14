import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AsignadosComponent } from '../asignados/asignados.component';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { AsignarComponent } from '../asignar/asignar.component';

@Component({
  selector: 'ups-pr-fea-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  alertaOpciones: any[] = [
    { class: 'white-fg', text: 'Normal' },
    { class: 'yellow-fg', text: 'Advertencia' },
    { class: 'red-fg', text: 'Peligro' }
  ];

  displayedColumns: string[] = ['nro_documento', 'nro_documento_completo', 'asunto', 'fecha', 'usuario', 'estado', 'plazo', 'acciones'];
  dataSource = data.map((doc: Documento, index: number) => {
    doc.nro = 1 + index;
    return doc;
  });

  rol: 'jefe' | 'esp' | 'enc' | 'prof' = 'enc';

  constructor(
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
  }

  ir(ruta: string): void {
    window.open(ruta, '_black');
  }

  mostrarAsignados(): void {
    const asignadosDialog = this.matDialog.open(AsignadosComponent, {
      width: '600px'
    });
  }

  asignar(): void {
    const asignarDialog = this.matDialog.open(AsignarComponent, {
      width: '600px'
    });
  }

  eliminar(): void {
    const eliminarDialog = this.matDialog.open(ConfirmMessageComponent);
    eliminarDialog.componentInstance.message = '¿Está seguro q deseas eliminar este elemento?';
  }

}

const data: Documento[] = [
  {
    nro_documento_completo: 'INFORME N° 2-2019-MIDIS/PNPAIS-UPP',
    asunto: 'PERFIL DE PREDICTIVIDAD 02',
    fecha: '2019-04-10 03:03:10',
    usuario: 'Jimy Navarro',
    estado: 1,
    plazo: 20
  },
  {
    nro_documento_completo: 'INFORME N° 3-2019-MIDIS/PNPAIS-UPP',
    asunto: 'PERFIL DE PREDICTIVIDAD 03',
    fecha: '2019-03-10 06:02:10',
    usuario: 'Juan Gonzales',
    estado: 2,
    plazo: 15
  },
  {
    nro_documento_completo: 'INFORME N° 4-2019-MIDIS/PNPAIS-UPP',
    asunto: 'PERFIL DE PREDICTIVIDAD 04',
    fecha: '2019-03-10 06:02:10',
    usuario: 'Cristian Pajardo',
    estado: 3,
    plazo: 5
  }
];

interface Documento {
  nro?: number;
  nro_documento_completo: string;
  usuario: string;
  estado: number;
  plazo: number;
  asunto: string;
  fecha: string;
}
