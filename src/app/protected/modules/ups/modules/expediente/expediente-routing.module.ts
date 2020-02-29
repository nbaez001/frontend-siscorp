import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthRouting } from '@shared/auth/auth-routing';
import { JefeUPSComponent } from './components/jefe-ups/jefe-ups.component';
import { CoordinadorComponent } from './components/coordinador-ups/coordinador.component';
import { EncargadoComponent } from './components/encargado-ups/encargado.component';
import { AusenciaJefeComponent } from './components/jefe-ups/ausencia-jefe/ausencia-jefe.component';
import { SolicitarTdrComponent } from './components/encargado-ups/encargado-solicitar/solicitar-tdr/solicitar-tdr.component';
import { JefeElaboradorComponent } from './components/jefe-elaborador/jefe-elaborador.component';
import { JefeRevisorComponent } from './components/jefe-revisor/jefe-revisor.component';
import { RegistroTdrComponent } from './components/encargado-ups/encargado-solicitar/solicitar-tdr/registro-tdr/registro-tdr.component';
import { TreeTableEditDemoComponent } from './components/tree-table-edit-demo/tree-table-edit-demo.component';
import { TreeTableInsumoDemoComponent } from './components/tree-table-insumo-demo/tree-table-insumo-demo.component';


const routes: Routes = [
  {
    path: 'bandeja-jefe',
    component: JefeUPSComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'bandeja-coordinador',
    component: CoordinadorComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'bandeja-encargado',
    component: EncargadoComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'ausencia-jefe',
    component: AusenciaJefeComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'solicitar-tdr',
    component: SolicitarTdrComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'bandeja-jefe-elaborador',
    component: JefeElaboradorComponent,
    canActivate: [AuthRouting]
  },
  { path: 'bandeja-jefe-revisor',
    component: JefeRevisorComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'registro-tdr',
    component: RegistroTdrComponent,
    canActivate: [AuthRouting]
  },

  {
    path: 'tree',
    component: TreeTableEditDemoComponent,
    canActivate: [AuthRouting]
  },
  {
    path: 'tree-insumo',
    component: TreeTableInsumoDemoComponent,
    canActivate: [AuthRouting]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpedienteRoutingModule { }
