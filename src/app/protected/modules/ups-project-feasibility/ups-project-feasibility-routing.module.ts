import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoryDocumentComponent } from './components/history-document/history-document.component';
import { DocumentsComponent } from './components/documents/documents.component';

const routes: Routes = [
  { path: '', component: DocumentsComponent },
  { path: 'historial/:id', component: HistoryDocumentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpsProjectFeasibilityRoutingModule { }
