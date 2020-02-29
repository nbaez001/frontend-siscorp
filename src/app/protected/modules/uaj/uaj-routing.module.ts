import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BandejaConvenioComponent } from './components/bandeja-convenio/bandeja-convenio.component';
import { AuthRouting } from '@shared/auth/auth-routing';

const routes: Routes = [
  {
    path: 'convenio-bandeja',
    component: BandejaConvenioComponent,
    canActivate: [AuthRouting]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UajRoutingModule { }
