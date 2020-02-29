import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'ups-pr-fea-history-document',
  templateUrl: './history-document.component.html',
  styleUrls: ['./history-document.component.scss']
})
export class HistoryDocumentComponent implements OnInit {

  doc: any;

  consultorForm: FormGroup;

  consultores: any[] = [{
    nombre: 'JIMY NAVARRO',
    cargo: 'Jefe de Proyecto'
  }];

  especialistas: any[] = [
    {nombre: 'Jorge Moscoso'},
    {nombre: 'Miguel Talla'},
    {nombre: 'Jose Carlos Cornejo'},
    {nombre: 'Fransisco Lavado'}
  ];

  archivoCulminacion = null;
  archivoResolucion = null;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.consultorForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      cargo: ['', Validators.required]
    });
  }

  searchDoc(event: KeyboardEvent): void {

    /*if (event.key === 'Enter') {
      const searchValue = event.target.value;

      const result: any[] = data.documentos.filter((d: any) => d.nro === searchValue);

      if (result.length > 0) {
        this.doc = result[0];
      } else {
        this.doc = null;
        this.snackBar.open('Documento no encontrado');
      }
    }*/
  }

  openDoc() {
    window.open(this.doc.doc, '_black');
  }

  nuevoConsultor() {

    if (this.consultorForm.valid) {
      this.consultores.push(this.consultorForm.value);
      this.consultorForm.reset('');
    }
  }

  quitarConsultor(index: number) {
    this.consultores.splice(index, 1);
  }

  guardarInfoCulminacion(files: FileList) {
    this.archivoCulminacion = files[0].name;
  }

  guardarResolucion(files: FileList) {
    this.archivoResolucion = files[0].name;
  }

}

const data = {
  documentos: [
    {
      nro: '2-2019',
      nroCompleto: 'INFORME N° 2-2019-MIDIS/PNPAIS-UPP',
      asunto: 'PERFIL DE PREDICTIVIDAD 02',
      fecha: '2019-04-10 03:03:10',
      doc: 'http://www.pais.gob.pe/backendsismonitor/public/storage/tramite-documentario/documento-firmado/53mMS5XuiV7ZDxlNzFBQXquDPZMvzkfmNWISTYGt.pdf'
    },
    {
      nro: '3-2019',
      nroCompleto: 'INFORME N° 3-2019-MIDIS/PNPAIS-UPP',
      asunto: 'PERFIL DE PREDICTIVIDAD 03',
      fecha: '2019-03-10 06:02:10',
      doc: 'http://www.pais.gob.pe/backendsismonitor/public/storage/tramite-documentario/documento-firmado/0BmIJFITDwwzIPhkRr6zjB0PXzCmz2HOChLYynY5.pdf'
    },
  ]
};
