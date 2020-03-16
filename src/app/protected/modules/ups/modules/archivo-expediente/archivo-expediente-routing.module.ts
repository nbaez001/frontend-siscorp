import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BandejaArchivoExpedienteComponent } from './components/bandeja-archivo-expediente/bandeja-archivo-expediente.component';
import { AuthRouting } from '@shared/auth/auth-routing';

const routes: Routes = [
  {
    path: 'bandeja-archivo-expediente',
    component: BandejaArchivoExpedienteComponent,
    canActivate: [AuthRouting]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivoExpedienteRoutingModule { }
