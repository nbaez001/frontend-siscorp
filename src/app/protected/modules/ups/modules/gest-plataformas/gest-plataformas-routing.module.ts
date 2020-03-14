import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionarTambosComponent } from './components/gestionar-tambos/gestionar-tambos.component';
import { ResumenTambosComponent } from './components/resumen-tambos/resumen-tambos.component';
import { AuthRouting } from '@shared/auth/auth-routing';
import { EjecucionProyectoComponent } from './components/ejecucion-proyecto/ejecucion-proyecto.component';

const routes: Routes = [
  {
    path: '',
    component: GestionarTambosComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'reporte',
    component: ResumenTambosComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'ejecucion-proyecto',
    component: EjecucionProyectoComponent,
    canActivate: [AuthRouting]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestPlataformasRoutingModule { }
