import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BandejaPrincipalComponent } from './components/bandeja-principal/bandeja-principal.component';
import { AuthRouting } from '@shared/auth/auth-routing';

const routes: Routes = [{
  path: '',
  canActivate: [AuthRouting],
  component: BandejaPrincipalComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestServRoutingModule { }
