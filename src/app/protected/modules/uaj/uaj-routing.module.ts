import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BandejaConvenioComponent } from './components/bandeja-convenio/bandeja-convenio.component';
import { AuthRouting } from '@shared/auth/auth-routing';
import { PlanTrabajoComponent } from './components/plan-trabajo/plan-trabajo.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'convenio-bandeja',
    component: BandejaConvenioComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'plan-trabajo/:id_convenio',
    component: PlanTrabajoComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthRouting]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UajRoutingModule { }
