import { NgModule } from '@angular/core';

import { UpsProjectFeasibilityRoutingModule } from './ups-project-feasibility-routing.module';
import { SharedModule } from '@shared/shared.module';
import { HistoryDocumentComponent } from './components/history-document/history-document.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { AsignadosComponent } from './components/asignados/asignados.component';
import { AsignarComponent } from './components/asignar/asignar.component';

@NgModule({
  declarations: [
    HistoryDocumentComponent,
    DocumentsComponent,
    AsignadosComponent,
    AsignarComponent
  ],
  imports: [
    SharedModule,
    UpsProjectFeasibilityRoutingModule
  ],
  entryComponents: [
    AsignadosComponent,
    AsignarComponent
  ]
})
export class UpsProjectFeasibilityModule { }
