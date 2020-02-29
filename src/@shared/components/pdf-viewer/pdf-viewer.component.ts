import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit, OnDestroy {

  public currentPdf: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public datos: DataBlob,
    public dialogRef: MatDialogRef<PdfViewerComponent>
  ) { }

  ngOnInit() {
    this.currentPdf = URL.createObjectURL(new Blob([this.datos.dataBlob], { type: 'application/pdf' }));
  }

  ngOnDestroy() {
    this.dialogRef.close();
  }

}

interface DataBlob {
  dataBlob?: any
}
